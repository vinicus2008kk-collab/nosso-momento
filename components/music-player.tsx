"use client";

import { AudioBars } from "@/components/audio-bars";
import { formatMusicStartTimeFromTotal } from "@/lib/music-start-time";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type MusicPlayerProps = {
  videoId: string;
  startSeconds?: number;
};

type PlaybackState = "stopped" | "loading" | "playing" | "paused" | "blocked";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YTPlayerConstructor = new (
  elementId: string,
  options: {
    height: string;
    width: string;
    videoId: string;
    playerVars: Record<string, number | string>;
    events?: {
      onStateChange?: (event: { data: number }) => void;
      onReady?: () => void;
      onError?: () => void;
    };
  }
) => YTPlayer;

declare global {
  interface Window {
    YT?: {
      Player: YTPlayerConstructor;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_ENDED = 0;
const LOADING_TIMEOUT_MS = 5000;

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("YouTube API timeout"));
    }, LOADING_TIMEOUT_MS);

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      previousReady?.();
      resolve();
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("YouTube API script failed"));
      };
      document.body.appendChild(script);
    } else if (window.YT?.Player) {
      window.clearTimeout(timeout);
      resolve();
    }
  });
}

export function MusicPlayer({ videoId, startSeconds = 0 }: MusicPlayerProps) {
  const playerId = useId().replace(/:/g, "");
  const playerRef = useRef<YTPlayer | null>(null);
  const hasPlayedRef = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playback, setPlayback] = useState<PlaybackState>("stopped");
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackKey, setFallbackKey] = useState(0);
  const start = Math.max(0, Math.floor(startSeconds));

  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  const markBlocked = useCallback(() => {
    clearLoadingTimeout();
    setPlayback("blocked");
  }, [clearLoadingTimeout]);

  const initPlayer = useCallback(async () => {
    if (playerRef.current) return playerRef.current;

    await loadYouTubeIframeApi();

    const origin =
      typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;

    return new Promise<YTPlayer>((resolve, reject) => {
      const readyTimeout = window.setTimeout(() => {
        reject(new Error("Player ready timeout"));
      }, LOADING_TIMEOUT_MS);

      const player = new window.YT!.Player(playerId, {
        height: "1",
        width: "1",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          start,
          enablejsapi: 1,
          origin: origin ?? "http://localhost:3000"
        },
        events: {
          onReady: () => {
            window.clearTimeout(readyTimeout);
            playerRef.current = player;
            resolve(player);
          },
          onError: () => {
            window.clearTimeout(readyTimeout);
            reject(new Error("YouTube player error"));
          },
          onStateChange: (event) => {
            if (event.data === YT_PLAYING) {
              hasPlayedRef.current = true;
              clearLoadingTimeout();
              setPlayback("playing");
            } else if (event.data === YT_PAUSED && hasPlayedRef.current) {
              setPlayback("paused");
            } else if (event.data === YT_ENDED) {
              setPlayback("paused");
            }
          }
        }
      });
    });
  }, [clearLoadingTimeout, playerId, start, videoId]);

  useEffect(() => {
    return () => {
      clearLoadingTimeout();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [clearLoadingTimeout]);

  const playWithFallback = useCallback(() => {
    clearLoadingTimeout();
    setUseFallback(true);
    setFallbackKey((current) => current + 1);
    setPlayback("playing");
    hasPlayedRef.current = true;
  }, [clearLoadingTimeout]);

  async function handleMainButton() {
    if (playback === "playing") {
      playerRef.current?.pauseVideo();
      setPlayback("paused");
      return;
    }

    if (playback === "paused" && playerRef.current && !useFallback) {
      playerRef.current.playVideo();
      return;
    }

    if (useFallback || playback === "blocked") {
      playWithFallback();
      return;
    }

    setPlayback("loading");
    clearLoadingTimeout();

    loadingTimeoutRef.current = setTimeout(() => {
      markBlocked();
    }, LOADING_TIMEOUT_MS);

    try {
      const player = playerRef.current ?? (await initPlayer());
      player.playVideo();
    } catch {
      clearLoadingTimeout();
      setUseFallback(true);
      playWithFallback();
    }
  }

  const buttonLabel =
    playback === "loading"
      ? "Preparando..."
      : playback === "playing"
        ? "Pausar música"
        : playback === "paused"
          ? "Continuar música"
          : playback === "blocked"
            ? "Tocar novamente"
            : "Tocar nossa música ❤️";

  const fallbackSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&controls=0&playsinline=1&modestbranding=1&rel=0&enablejsapi=1`;

  return (
    <div className="glass-card relative overflow-hidden p-4">
      <div
        id={playerId}
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />

      {useFallback && (
        <iframe
          key={fallbackKey}
          src={fallbackSrc}
          title="Nossa música"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="pointer-events-none absolute left-0 top-0 h-px w-px border-0 opacity-0"
        />
      )}

      <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-white/80">Nossa música</p>

        <div className="mt-3 flex flex-col items-center gap-3">
          <AudioBars active={playback === "playing"} />

          <button
            type="button"
            onClick={handleMainButton}
            disabled={playback === "loading"}
            className="rounded-full border border-[#d4af37]/45 bg-black/25 px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {buttonLabel}
          </button>

          {playback === "playing" && (
            <p className="text-sm text-cream/90">Tocando agora...</p>
          )}

          {playback === "blocked" && (
            <p className="text-center text-sm text-cream/90">
              Toque novamente para iniciar a música.
            </p>
          )}

          {start > 0 && playback === "stopped" && (
            <p className="text-center text-[11px] text-cream/70">
              Começa em {formatMusicStartTimeFromTotal(start)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
