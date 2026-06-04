"use client";

import { PrimaryButton } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";

export default function DemoGratisPage() {
  return (
    <main className="romantic-gradient relative min-h-screen overflow-hidden px-4 py-10">
      <HeartBackground />
      <div className="cinematic-vignette" />

      <section className="relative mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white/80">
            Demonstração — Plano Grátis
          </span>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            Simples, bonito e de graça
          </h1>
          <p className="text-lg text-white/80">
            Com o plano grátis você cria uma página romântica com 1 foto, uma
            mensagem especial e o contador de tempo juntos. Rápido e sem custo.
          </p>
          <ul className="space-y-2 text-white/75 text-sm">
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> 1 foto do casal</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Mensagem personalizada</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Contador de tempo juntos</li>
            <li className="flex items-center gap-2"><span className="text-white/30">✗</span> <span className="text-white/40">Música (apenas Premium)</span></li>
            <li className="flex items-center gap-2"><span className="text-white/30">✗</span> <span className="text-white/40">QR Code (apenas Premium)</span></li>
            <li className="flex items-center gap-2"><span className="text-white/30">✗</span> <span className="text-white/40">Múltiplas fotos (apenas Premium)</span></li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/criar" className="px-10 py-4 text-lg">
              Criar grátis agora
            </PrimaryButton>
            <a
              href="/demo/premium"
              className="inline-flex items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#d4af37]/10 px-8 py-4 text-base font-semibold text-[#d4af37] transition hover:bg-[#d4af37]/20"
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
                <p className="text-xs uppercase tracking-widest text-white/60">Nosso Momento</p>
                <h2 className="text-2xl font-black text-white">Ana + Lucas</h2>
                <p className="text-sm leading-relaxed text-white/85">
                  Desde aquele primeiro olhar, cada instante ao seu lado virou poesia.
                  Obrigado por ser o meu lugar favorito.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
                  alt="Foto do casal"
                  className="h-44 w-full object-cover"
                />
              </div>

              <div className="rounded-2xl border border-white/20 bg-black/25 p-3">
                <p className="text-xs text-white/60">Tempo juntos</p>
                <p className="text-lg font-bold text-white">3 anos, 2 meses e 14 dias</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-xs text-white/40">✦ Criado com Nosso Momento ✦</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
