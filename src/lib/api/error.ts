import { NextResponse } from 'next/server';

/**
 * Global error response helper for API routes.
 */

export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT';

const ERROR_STATUS: Record<ApiErrorCode, number> = {
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  RATE_LIMITED: 429,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

export function apiError(code: ApiErrorCode, message?: string, details?: unknown) {
  return NextResponse.json(
    {
      error: code,
      message: message ?? getDefaultMessage(code),
      ...(details ? { details } : {}),
    },
    { status: ERROR_STATUS[code] }
  );
}

function getDefaultMessage(code: ApiErrorCode): string {
  const messages: Record<ApiErrorCode, string> = {
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
    RATE_LIMITED: 'Too many requests',
    VALIDATION_ERROR: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Resource conflict',
  };
  return messages[code];
}

/**
 * Wraps an async API handler with consistent error handling.
 */
export function tryApi(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('Unhandled API error:', error);
      return apiError('INTERNAL_ERROR');
    }
  };
}
