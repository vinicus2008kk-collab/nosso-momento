export const MUSIC_START_MAX_MINUTES = 999;
export const MUSIC_START_MAX_SECONDS = 59;

export function clampMusicStartMinutes(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MUSIC_START_MAX_MINUTES, Math.floor(value));
}

export function clampMusicStartSeconds(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MUSIC_START_MAX_SECONDS, Math.floor(value));
}

/** Converte segundos totais (banco / API) em minutos e segundos para os campos do formulário */
export function splitMusicStartTime(totalSeconds: number): { minutes: number; seconds: number } {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  return {
    minutes: Math.floor(safe / 60),
    seconds: safe % 60
  };
}

export function combineMusicStartTime(minutes: number, seconds: number): number {
  return clampMusicStartMinutes(minutes) * 60 + clampMusicStartSeconds(seconds);
}

export function formatMusicStartTime(minutes: number, seconds: number): string {
  return `${String(clampMusicStartMinutes(minutes)).padStart(2, "0")}:${String(clampMusicStartSeconds(seconds)).padStart(2, "0")}`;
}

export function formatMusicStartTimeFromTotal(totalSeconds: number): string {
  const { minutes, seconds } = splitMusicStartTime(totalSeconds);
  return formatMusicStartTime(minutes, seconds);
}

export function parseMusicStartMinutesInput(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return clampMusicStartMinutes(Number.isNaN(parsed) ? 0 : parsed);
}

export function parseMusicStartSecondsInput(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return clampMusicStartSeconds(Number.isNaN(parsed) ? 0 : parsed);
}
