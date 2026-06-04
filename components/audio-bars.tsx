"use client";

type AudioBarsProps = {
  active?: boolean;
};

const BAR_HEIGHTS = [12, 20, 14, 24, 10, 18, 16, 22];

export function AudioBars({ active = false }: AudioBarsProps) {
  return (
    <div className="flex h-7 items-end justify-center gap-1" aria-hidden>
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={`w-1.5 rounded-full bg-white/90 ${active ? "animate-pulse" : "opacity-40"}`}
          style={{
            height: `${height}px`,
            animationDelay: active ? `${index * 0.1}s` : undefined
          }}
        />
      ))}
    </div>
  );
}
