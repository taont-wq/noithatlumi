/**
 * Simple in-memory rate limiter for API routes.
 * For production, use Redis/Vercel KV — this is a dev-safe default.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 300_000);

interface RateLimitOptions {
  max?: number;        // Max requests per window
  windowMs?: number;  // Window size in ms
  message?: string;
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const max = options.max ?? (process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100);
  const windowMs = options.windowMs ?? (process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : 60_000);
  const now = Date.now();

  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

/**
 * Middleware wrapper for rate limiting API routes.
 */
export function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options: RateLimitOptions = {}
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'anonymous';

    const result = await rateLimit(ip, options);

    const response = await handler(request, ...args);

    // Add rate limit headers
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', String(options.max ?? 100));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'RATE_LIMITED', message: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            ...Object.fromEntries(headers),
          },
        }
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
