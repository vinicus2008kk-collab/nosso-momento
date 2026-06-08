"use client";

import { PrimaryButton } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";

export default function DemoClássicoPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-10"
      style={{ background: "linear-gradient(160deg,#fdf6ee 0%,#f8ede0 40%,#faf2e8 100%)" }}
    >
      <HeartBackground />

      <div className="pointer-events-none absolute -left-32 -top-32 h-[38rem] w-[38rem] rounded-full opacity-20" style={{ background: "radial-gradient(circle,rgba(139,26,42,0.45),transparent 70%)", filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full opacity-10" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.4),transparent 70%)", filter: "blur(100px)" }} />

      <section className="relative mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span
            className="inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{ background: "rgba(139,26,42,0.08)", border: "1px solid rgba(139,26,42,0.2)", color: "#8b1a2a" }}
          >
            Demonstração — Clássico
          </span>

          <h1 className="text-4xl font-black leading-tight md:text-5xl" style={{ color: "#1e0d0d" }}>
            Simples, bonito e de graça
          </h1>

          <p className="text-lg" style={{ color: "#5a3535" }}>
            Com o Clássico você cria uma página romântica com 1 foto, uma
            mensagem especial e o contador de tempo juntos. Rápido e sem custo.
          </p>

          <ul className="space-y-2 text-sm" style={{ color: "#5a3535" }}>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> 1 foto do casal</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> Mensagem personalizada</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> Contador de tempo juntos</li>
            <li className="flex items-center gap-2"><span style={{ color: "rgba(139,26,42,0.3)" }}>✗</span> <span style={{ color: "rgba(90,53,53,0.45)" }}>Música (apenas Premium)</span></li>
            <li className="flex items-center gap-2"><span style={{ color: "rgba(139,26,42,0.3)" }}>✗</span> <span style={{ color: "rgba(90,53,53,0.45)" }}>QR Code (apenas Premium)</span></li>
            <li className="flex items-center gap-2"><span style={{ color: "rgba(139,26,42,0.3)" }}>✗</span> <span style={{ color: "rgba(90,53,53,0.45)" }}>Múltiplas fotos (apenas Premium)</span></li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/criar" className="px-10 py-4 text-lg">
              Criar grátis agora
            </PrimaryButton>
            <a
              href="/demo/premium"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition hover:opacity-80"
              style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.08)", color: "#7a5500" }}
            >
              Ver demo Premium ✨
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="phone-mockup iphone-shell mx-auto">
            <div className="phone-notch" />
            <div className="phone-mockup-screen iphone-screen">
              <div className="screen-reflection" />

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest" style={{ color: "#6b4040" }}>Nosso Momento</p>
                <h2 className="text-2xl font-black" style={{ color: "#1e0d0d" }}>Ana + Lucas</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#4a2a2a" }}>
                  Desde aquele primeiro olhar, cada instante ao seu lado virou poesia.
                  Obrigado por ser o meu lugar favorito.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(139,26,42,0.12)" }}>
                <img
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
                  alt="Foto do casal"
                  className="h-44 w-full object-cover"
                />
              </div>

              <div className="rounded-2xl p-3" style={{ background: "rgba(139,26,42,0.05)", border: "1px solid rgba(139,26,42,0.12)" }}>
                <p className="text-xs" style={{ color: "#6b4040" }}>Tempo juntos</p>
                <p className="text-lg font-bold" style={{ color: "#1e0d0d" }}>3 anos, 2 meses e 14 dias</p>
              </div>

              <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(139,26,42,0.04)", border: "1px solid rgba(139,26,42,0.09)" }}>
                <p className="text-xs" style={{ color: "#9b7070" }}>✦ Criado com Nosso Momento ✦</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
