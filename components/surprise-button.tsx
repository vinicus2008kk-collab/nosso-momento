"use client";

import { useState } from "react";

export function SurpriseButton() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="glass-card p-4 text-center">
      <button
        className="animate-pulseGlow rounded-full bg-ruby px-5 py-3 font-semibold text-white"
        onClick={() => setOpened(true)}
      >
        Clique para uma surpresa
      </button>
      {opened && <p className="mt-3 text-sm text-cream/90">Eu te amo infinitamente. ❤️</p>}
    </div>
  );
}
