"use client";

import { useEffect, useState } from "react";

export function TypingLetter({ text }: { text: string }) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypedText(text.slice(0, index));
      if (index >= text.length) clearInterval(interval);
    }, 28);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="glass-card p-5">
      <h3 className="mb-2 text-lg font-semibold text-white">Carta de amor</h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-cream/90">{typedText}</p>
    </div>
  );
}
