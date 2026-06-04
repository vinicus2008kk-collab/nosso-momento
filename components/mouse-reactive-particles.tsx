"use client";

import { useEffect, useState } from "react";

export function MouseReactiveParticles() {
  const [pointer, setPointer] = useState({ x: 50, y: 35 });

  useEffect(() => {
    function onMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPointer({ x, y });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="mouse-spotlight"
        style={{
          left: `${pointer.x}%`,
          top: `${pointer.y}%`
        }}
      />
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="mouse-particle"
          style={{
            left: `${12 + i * 6}%`,
            top: `${8 + (i % 4) * 20}%`,
            transform: `translate(${(pointer.x - 50) * (0.03 + i * 0.004)}px, ${(pointer.y - 40) * (0.03 + i * 0.004)}px)`
          }}
        />
      ))}
    </div>
  );
}
