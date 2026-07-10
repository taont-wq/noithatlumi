'use client';

import Image from 'next/image';

interface Video {
  id: string;
  platform: string;
  videoId: string | null;
  url: string;
  title: string | null;
  thumbnail: string | null;
  duration: number | null;
}

interface Props {
  videos: Video[];
}

const PLATFORM_LABELS: Record<string, string> = {
  YOUTUBE: 'YouTube',
  TIKTOK: 'TikTok',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  VIMEO: 'Vimeo',
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getEmbedUrl(video: Video): string {
  switch (video.platform) {
    case 'YOUTUBE':
      return `https://www.youtube.com/embed/${video.videoId}`;
    case 'VIMEO':
      return `https://player.vimeo.com/video/${video.videoId}`;
    default:
      return video.url;
  }
}

export function ApartmentVideos({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Video</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {videos.map((video) => (
          <div key={video.id} className="group relative overflow-hidden rounded-lg border bg-muted">
            {/* Thumbnail */}
            <div className="relative aspect-video">
              {video.thumbnail ? (
                <Image
                  src={video.thumbnail}
                  alt={video.title ?? 'Video'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <svg className="h-12 w-12 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              {/* Play overlay */}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="rounded-full bg-white/90 p-3 shadow-lg transition-transform hover:scale-110">
                  <svg className="h-6 w-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>

              {/* Duration badge */}
              {video.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                  {formatDuration(video.duration)}
                </span>
              )}

              {/* Platform label */}
              <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                {PLATFORM_LABELS[video.platform] ?? video.platform}
              </span>
            </div>

            {/* Title */}
            {video.title && (
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
