export const MAX_PHOTOS_FREE = 1;

export type PageMediaItem = {
  type: "image" | "video";
  url: string;
};

export type PageMediaInput = string | PageMediaItem;

const IMAGE_URL_PATTERN = /\.(jpe?g|png|webp|gif)(\?|$)/i;
const VIDEO_URL_PATTERN = /\.(mp4|webm|mov)(\?|$)/i;
const UPLOADS_PATH_PATTERN = /^\/uploads\/[^/?#]+$/i;

export function isStoredPhotoUrl(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

export function isRelativeUploadUrl(value: string): boolean {
  return UPLOADS_PATH_PATTERN.test(value.trim());
}

/** @deprecated Mantido só para páginas antigas já salvas com base64 */
function isLegacyPhotoValue(value: string) {
  return value.startsWith("data:image/");
}

export function isValidPhotoValue(value: string): boolean {
  return isValidMediaUrl(value);
}

export function isValidMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return isStoredPhotoUrl(trimmed) || isRelativeUploadUrl(trimmed) || isLegacyPhotoValue(trimmed);
}

/** Normaliza URLs salvas para caminhos relativos /uploads/ quando possível */
export function resolveMediaUrlForDisplay(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (isRelativeUploadUrl(trimmed)) {
    return trimmed;
  }

  if (isLegacyPhotoValue(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const uploadsPath = parsed.pathname.match(/\/uploads\/[^/?#]+/i);
    if (uploadsPath) {
      return uploadsPath[0];
    }
  } catch {
    // URL relativa ou inválida — tenta extrair /uploads/ manualmente
    const match = trimmed.match(/\/uploads\/[^/?#]+/i);
    if (match) return match[0];
  }

  return trimmed;
}

export function toStoredMediaUrl(url: string): string {
  return resolveMediaUrlForDisplay(url);
}

export function inferMediaTypeFromUrl(url: string): "image" | "video" {
  const base = resolveMediaUrlForDisplay(url).split("?")[0] ?? "";
  if (VIDEO_URL_PATTERN.test(base)) return "video";
  if (IMAGE_URL_PATTERN.test(base)) return "image";
  return "image";
}

export function resolveMediaType(
  savedType: "image" | "video" | undefined,
  url: string
): "image" | "video" {
  const inferred = inferMediaTypeFromUrl(url);
  if (!savedType) return inferred;

  const base = resolveMediaUrlForDisplay(url).split("?")[0] ?? "";
  const hasKnownExtension = IMAGE_URL_PATTERN.test(base) || VIDEO_URL_PATTERN.test(base);

  if (hasKnownExtension && savedType !== inferred) {
    return inferred;
  }

  return savedType;
}

export function normalizeMediaItem(item: PageMediaInput): PageMediaItem | null {
  if (typeof item === "string") {
    const url = resolveMediaUrlForDisplay(item);
    if (!url) return null;
    if (!isValidMediaUrl(url)) return null;
    return { type: inferMediaTypeFromUrl(url), url };
  }

  const url = resolveMediaUrlForDisplay(item.url ?? "");
  if (!url || !isValidMediaUrl(url)) return null;

  return {
    type: resolveMediaType(item.type, url),
    url
  };
}

export function parsePageMedia(photos: string | string[] | PageMediaItem[]): PageMediaItem[] {
  if (Array.isArray(photos)) {
    return photos
      .map((item) => normalizeMediaItem(item as PageMediaInput))
      .filter((item): item is PageMediaItem => item !== null);
  }

  if (!photos?.trim()) return [];

  const raw = photos.trim();

  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => normalizeMediaItem(item as PageMediaInput))
          .filter((item): item is PageMediaItem => item !== null);
      }
    } catch {
      // JSON inválido
    }
  }

  const single = normalizeMediaItem(raw);
  return single ? [single] : [];
}

/** @deprecated Use parsePageMedia — mantido para compatibilidade */
export function parsePagePhotos(photos: string | string[]): string[] {
  return parsePageMedia(photos).map((item) => item.url);
}

export function serializePageMedia(items: PageMediaInput[], plan: "FREE" | "PREMIUM"): string {
  const cleaned = items
    .map((item) => normalizeMediaItem(item))
    .filter((item): item is PageMediaItem => item !== null)
    .filter((item) => isValidMediaUrl(item.url))
    .map((item) => ({
      type: item.type,
      url: toStoredMediaUrl(item.url)
    }));

  const list = plan === "FREE" ? cleaned.slice(0, MAX_PHOTOS_FREE) : cleaned;
  return JSON.stringify(list);
}

/** @deprecated Use serializePageMedia */
export function serializePagePhotos(photos: string[], plan: "FREE" | "PREMIUM"): string {
  return serializePageMedia(photos, plan);
}
