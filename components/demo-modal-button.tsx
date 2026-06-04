"use client";
import { useState } from "react";
import Link from "next/link";

export function DemoModalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 px-10 py-5 text-xl font-semibold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/25"
      >
        Ver demonstração
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-b from-[#2d0b2e] to-[#1a0a2e] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-4 text-2xl leading-none text-white/50 transition hover:text-white"
            >
              ×
            </button>

            <p className="mb-1 text-center text-xs uppercase tracking-widest text-white/50">
              Nosso Momento
            </p>
            <h2 className="mb-2 text-center text-2xl font-black text-white">
              Qual plano deseja ver?
            </h2>
            <p className="mb-6 text-center text-sm text-white/60">
              Escolha a demonstração que melhor representa o que você quer criar.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/demo/gratis"
                className="flex flex-col rounded-2xl border border-white/20 bg-white/10 p-5 transition hover:bg-white/20"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">🤍</span>
                  <span className="text-lg font-bold text-white">Demonstração Grátis</span>
                </div>
                <span className="text-sm text-white/70">
                  1 foto, mensagem especial e contador de tempo juntos.
                </span>
              </Link>

              <Link
                href="/demo/premium"
                className="flex flex-col rounded-2xl border border-[#d4af37]/50 bg-gradient-to-br from-[#6a234b]/50 to-[#4a1f4f]/50 p-5 transition hover:from-[#6a234b]/70 hover:to-[#4a1f4f]/70"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-lg font-bold text-white">Demonstração Premium</span>
                  <span className="rounded-full bg-[#d4af37]/25 px-2 py-0.5 text-xs font-semibold text-[#d4af37]">
                    Mais escolhido
                  </span>
                </div>
                <span className="text-sm text-white/80">
                  Várias fotos, música, animações, QR Code e visual cinematográfico.
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
