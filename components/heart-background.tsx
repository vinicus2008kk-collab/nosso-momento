export function HeartBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className="heart animate-heart-fall"
          style={{
            left: `${(i * 13 + 7) % 100}%`,
            animationDelay: `${i * 0.42}s`,
            animationDuration: `${7 + (i % 5) * 1.3}s`,
            opacity: 0.2 + (i % 5) * 0.12,
            transform: `rotate(45deg) scale(${0.7 + (i % 4) * 0.18})`
          }}
        />
      ))}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={`particle-${i}`}
          className="romantic-particle animate-particle-float"
          style={{
            left: `${(i * 11 + 3) % 100}%`,
            animationDelay: `${i * 0.34}s`,
            animationDuration: `${8 + (i % 6) * 1.1}s`,
            opacity: 0.15 + (i % 4) * 0.07
          }}
        />
      ))}
    </div>
  );
}
