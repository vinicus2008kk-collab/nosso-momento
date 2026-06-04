"use client";

import { useEffect, useState } from "react";

export function RelationshipTimer({ startDate }: { startDate: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;
      setText(`${years} anos, ${months} meses e ${remainingDays} dias`);
    };
    update();
    const interval = setInterval(update, 1000 * 60);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="glass-card p-4 text-center">
      <p className="text-xs text-cream/70">Tempo juntos</p>
      <p className="text-lg font-semibold text-white">{text}</p>
    </div>
  );
}
