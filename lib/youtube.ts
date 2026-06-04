const VIDEO_ID_PATTERN = /[a-zA-Z0-9_-]{11}/;

function normalizeVideoId(id: string | null | undefined): string | null {
  if (!id) return null;
  const match = id.match(VIDEO_ID_PATTERN);
  return match?.[0] ?? null;
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  const normalizedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsedUrl = new URL(normalizedUrl);
    const host = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const pathId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return normalizeVideoId(pathId);
    }

    if (host.includes("youtube.com") || host === "music.youtube.com") {
      const fromQuery = parsedUrl.searchParams.get("v");
      if (fromQuery) return normalizeVideoId(fromQuery);

      const pathMatch = parsedUrl.pathname.match(
        /\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/
      );
      if (pathMatch?.[1]) return pathMatch[1];
    }

    return null;
  } catch {
    const fallbackMatch = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return fallbackMatch?.[1] ?? null;
  }
}

export function buildYouTubeEmbedUrl(videoId: string, startSeconds = 0): string {
  const start = Math.max(0, Math.floor(startSeconds));
  return `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1`;
}