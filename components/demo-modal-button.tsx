"use client";
import { useState } from "react";
import Link from "next/link";

export function DemoModalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border-2 border-[#8b1a2a] bg-transparent px-10 py-5 text-lg font-semibold text-[#8b1a2a] transition-all duration-300 hover:scale-[1.02] hover:bg-[#8b1a2a] hover:text-white"
      >
        Ver demonstração
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl"
            style={{ background: "#fdf6ee", border: "1px solid rgba(139,26,42,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-4 text-2xl leading-none transition hover:opacity-60"
              style={{ color: "#8b1a2a" }}
            >
              ×
            </button>

            <p className="mb-1 text-center text-xs uppercase tracking-widest" style={{ color: "rgba(139,26,42,0.5)" }}>
              Nosso Momento
            </p>
            <h2 className="mb-2 text-center text-2xl font-black" style={{ color: "#1e0d0d" }}>
              Qual plano deseja ver?
            </h2>
            <p className="mb-6 text-center text-sm" style={{ color: "#7a4848" }}>
              Escolha a demonstração que melhor representa o que você quer criar.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/demo/Clássico"
                className="flex flex-col rounded-2xl p-5 transition hover:scale-[1.01]"
                style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.12)" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">🤍</span>
                  <span className="text-lg font-bold" style={{ color: "#1e0d0d" }}>Demonstração Grátis</span>
                </div>
                <span className="text-sm" style={{ color: "#7a4848" }}>
                  1 foto, mensagem especial e contador de tempo juntos.
                </span>
              </Link>

              <Link
                href="/demo/premium"
                className="flex flex-col rounded-2xl p-5 transition hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg,#2a0810,#1a0610)", border: "1px solid rgba(201,168,76,0.4)" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-lg font-bold text-white">Demonstração Premium</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: "rgba(201,168,76,0.2)", color: "#c9a84c" }}>
                    Mais escolhido
                  </span>
                </div>
                <span className="text-sm" style={{ color: "rgba(255,235,215,0.8)" }}>
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
