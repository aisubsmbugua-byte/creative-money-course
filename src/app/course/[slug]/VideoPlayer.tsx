"use client";

import { useRef, useState, useTransition } from "react";

export function VideoPlayer({
  src,
  initiallyWatched,
  onMarkWatched,
}: {
  src: string;
  initiallyWatched: boolean;
  onMarkWatched: () => Promise<void>;
}) {
  const [watched, setWatched] = useState(initiallyWatched);
  const [isPending, startTransition] = useTransition();
  const firedRef = useRef(false);

  function markWatched() {
    if (firedRef.current || watched) return;
    firedRef.current = true;
    setWatched(true);
    startTransition(() => {
      onMarkWatched();
    });
  }

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl border border-paper-line bg-ink">
        <video
          controls
          preload="metadata"
          className="h-full w-full"
          src={src}
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
