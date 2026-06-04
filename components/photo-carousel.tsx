"use client";

import type { PageMediaItem } from "@/lib/romantic-page";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_INTERVAL_MS = 3000;
const SWIPE_THRESHOLD_PX = 50;
const DRAG_START_PX = 12;

type PhotoCarouselProps = {
  media: PageMediaItem[];
  premium?: boolean;
};

type DragState = {
  startX: number;
  startY: number;
  dragging: boolean;
};

export function PhotoCarousel({ media, premium = false }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const dragState = useRef<DragState>({ startX: 0, startY: 0, dragging: false });
  const pointerActiveRef = useRef(false);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const total = media.length;
  const hasMultiple = total > 1;
  const currentItem = media[index];
  const isCurrentVideo = currentItem?.type === "video";

  const shouldAutoAdvance =
    hasMultiple && !manualPaused && !hoverPaused && !(isCurrentVideo && videoPlaying);

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(((nextIndex % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (index >= total) {
      setIndex(0);
    }
  }, [index, total]);

  useEffect(() => {
    setVideoPlaying(false);
    videoRefs.current.forEach((video, videoIndex) => {
      if (videoIndex !== index) {
        video.pause();
      }
    });
  }, [index]);

  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const timer = setInterval(goNext, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [shouldAutoAdvance, goNext]);

  const setVideoRef = useCallback((videoIndex: number, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current.set(videoIndex, element);
    } else {
      videoRefs.current.delete(videoIndex);
    }
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;

      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        dragging: false
      };
      pointerActiveRef.current = true;
      setHoverPaused(true);
      surfaceRef.current?.setPointerCapture(event.pointerId);
    },
    [hasMultiple]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;

      const deltaX = event.clientX - dragState.current.startX;
      const deltaY = event.clientY - dragState.current.startY;

      if (
        !dragState.current.dragging &&
        Math.abs(deltaX) > DRAG_START_PX &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        dragState.current.dragging = true;
      }
    },
    [hasMultiple]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;

      const deltaX = event.clientX - dragState.current.startX;

      if (dragState.current.dragging && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }

      dragState.current.dragging = false;
      pointerActiveRef.current = false;
      setHoverPaused(false);

      if (surfaceRef.current?.hasPointerCapture(event.pointerId)) {
        surfaceRef.current.releasePointerCapture(event.pointerId);
      }
    },
    [goNext, goPrev, hasMultiple]
  );

  const handlePointerCancel = useCallback(() => {
    dragState.current.dragging = false;
    pointerActiveRef.current = false;
    setHoverPaused(false);
  }, []);

  if (total === 0) return null;

  const frameClass =
    "absolute inset-0 transition-opacity duration-700 ease-in-out";

  const carouselSurface = (
    <>
      {media.map((item, mediaIndex) => (
        <div
          key={`slide-${mediaIndex}-${item.url}`}
          className={`${frameClass} ${mediaIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          aria-hidden={mediaIndex !== index}
        >
          {item.type === "video" ? (
            <video
              ref={(element) => setVideoRef(mediaIndex, element)}
              src={item.url}
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              onPlay={() => {
                if (mediaIndex === index) setVideoPlaying(true);
              }}
              onPause={() => {
                if (mediaIndex === index) setVideoPlaying(false);
              }}
              onEnded={() => {
                if (mediaIndex === index && hasMultiple && !manualPaused) {
                  goNext();
                }
              }}
            />
          ) : (
            <img
              src={item.url}
              alt={`Mídia ${mediaIndex + 1}`}
              className={`h-full w-full object-cover ${premium && !hasMultiple ? "animate-pulse" : ""}`}
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

      {hasMultiple && (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setManualPaused((current) => !current)}
          className="absolute right-3 top-3 z-40 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/50"
        >
          {manualPaused ? "Continuar" : "Pausar"}
        </button>
      )}

      {hasMultiple && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-1.5">
          {media.map((_, dotIndex) => (
            <span
              key={dotIndex}
              className={`rounded-full transition-all ${
                dotIndex === index
                  ? "h-2 w-6 bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.55)]"
                  : "h-2 w-2 bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );

  const surfaceClassName =
    "relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.35)]";

  if (!hasMultiple) {
    return <div className={surfaceClassName}>{carouselSurface}</div>;
  }

  return (
    <div className="relative">
      <div
        ref={surfaceRef}
        className={surfaceClassName}
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => {
          if (!pointerActiveRef.current) {
            setHoverPaused(false);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {carouselSurface}
      </div>

      <p className="mt-2 text-center text-xs text-cream/70">
        {index + 1} de {total}
      </p>
    </div>
  );
}
