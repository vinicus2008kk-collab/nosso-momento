"use client";

import {
  combineMusicStartTime,
  formatMusicStartTime,
  parseMusicStartMinutesInput,
  parseMusicStartSecondsInput
} from "@/lib/music-start-time";

type MusicStartTimeFieldsProps = {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
};

export function MusicStartTimeFields({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange
}: MusicStartTimeFieldsProps) {
  const formattedTime = formatMusicStartTime(minutes, seconds);
  const hasStart = combineMusicStartTime(minutes, seconds) > 0;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium" style={{ color: "#1e0d0d" }}>Início da música</p>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-center text-xs" style={{ color: "#6b4040" }}>Minutos</span>
          <div className="relative">
            <span className="input-icon">⏱️</span>
            <input
              type="number"
              min={0}
              max={999}
              inputMode="numeric"
              value={minutes}
              onChange={(event) => onMinutesChange(parseMusicStartMinutesInput(event.target.value))}
              className="input-modern input-with-icon text-center"
              aria-label="Minutos de início da música"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-center text-xs" style={{ color: "#6b4040" }}>Segundos</span>
          <div className="relative">
            <span className="input-icon">⏱️</span>
            <input
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              value={seconds}
              onChange={(event) => onSecondsChange(parseMusicStartSecondsInput(event.target.value))}
              className="input-modern input-with-icon text-center"
              aria-label="Segundos de início da música"
            />
          </div>
        </label>
      </div>

      <p className="rounded-xl px-3 py-2 text-center text-sm" style={{ border: "1px solid rgba(139,26,42,0.15)", background: "rgba(139,26,42,0.05)", color: "#4a2a2a" }}>
        {hasStart ? (
          <>
            A música iniciará em <strong style={{ color: "#1e0d0d" }}>{formattedTime}</strong>
          </>
        ) : (
          <>A música iniciará do começo</>
        )}
      </p>
    </div>
  );
}
