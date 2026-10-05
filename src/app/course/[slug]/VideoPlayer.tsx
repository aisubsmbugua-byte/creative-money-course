"use client";

import { useEffect, useRef, useState, useTransition } from "react";

export function VideoPlayer({
  src,
  poster,
  initiallyWatched,
  initialPosition,
  onMarkWatched,
  onSavePosition,
}: {
  src: string;
  poster?: string;
  initiallyWatched: boolean;
  initialPosition: number;
  onMarkWatched: () => Promise<void>;
  onSavePosition: (seconds: number) => Promise<void>;
}) {
  const [watched, setWatched] = useState(initiallyWatched);
  const [isPending, startTransition] = useTransition();
  const firedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function markWatched() {
    stopTracking();
    if (firedRef.current || watched) return;
    firedRef.current = true;
    setWatched(true);
    startTransition(() => {
      onMarkWatched();
    });
  }

  function savePosition() {
    const video = videoRef.current;
    if (!video) return;
    startTransition(() => {
      onSavePosition(video.currentTime);
    });
  }

  function startTracking() {
    stopTracking();
    intervalRef.current = setInterval(savePosition, 10_000);
  }

  function stopTracking() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => stopTracking, []);

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl border border-paper-line bg-ink">
        <video
          ref={videoRef}
          controls
          preload="metadata"
          poster={poster}
          className="h-full w-full"
          src={src}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (video && !watched && initialPosition > 0 && initialPosition < video.duration - 5) {
              video.currentTime = initialPosition;
            }
          }}
          onPlay={startTracking}
          onPause={() => {
            stopTracking();
            savePosition();
          }}
          onEnded={markWatched}
        />
      </div>
      <div className="mt-4 flex items-center gap-2">
        {watched ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-moss">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M3 8.5L6.2 11.5L13 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Watched
          </span>
        ) : (
          <button
            type="button"
            onClick={markWatched}
            disabled={isPending}
            className="font-mono text-xs uppercase tracking-wide text-text-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-text disabled:opacity-50"
          >
            Mark as watched
          </button>
        )}
      </div>
    </div>
  );
}
