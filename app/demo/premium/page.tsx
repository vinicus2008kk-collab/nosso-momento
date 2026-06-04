"use client";

import { PrimaryButton } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";
import { MouseReactiveParticles } from "@/components/mouse-reactive-particles";
import { useEffect, useState } from "react";

const photos = [
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
];

export default function DemoPremiumPage() {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="romantic-gradient relative min-h-screen overflow-hidden px-4 py-10">
      <HeartBackground />
      <MouseReactiveParticles />
      <div className="cinematic-vignette" />

      <section className="relative mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-sm font-semibold text-[#d4af37]">
            ✨ Demonstração — Plano Premium
          </span>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            Uma experiência cinematográfica e inesquecível
          </h1>
          <p className="text-lg text-white/80">
            Com o Premium você tem várias fotos com carrossel automático, música
            do YouTube, QR Code exclusivo, animações e visual sem marca d&apos;água.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> Até 5 fotos com carrossel animado</li>
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> Música personalizada do YouTube</li>
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> QR Code para compartilhar</li>
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> Link exclusivo do casal</li>
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> Animações e partículas interativas</li>
            <li className="flex items-center gap-2"><span className="text-[#d4af37]">✦</span> Sem marca d&apos;água</li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/criar" className="px-10 py-4 text-lg shadow-[0_0_40px_rgba(255,79,135,0.6)]">
              Criar experiência Premium
            </PrimaryButton>
            <a
              href="/demo/gratis"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20"
            >
              Ver demo Grátis
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="phone-mockup iphone-shell mx-auto">
            <div className="phone-notch" />
            <div className="phone-mockup-screen iphone-screen relative overflow-hidden">
              <div className="screen-reflection" />

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/60">Nosso Momento ✦ Premium</p>
                <h2 className="text-2xl font-black text-white">Ana + Lucas</h2>
                <p className="text-sm leading-relaxed text-white/85">
                  Em cada detalhe, eu te escolho de novo. Obrigado por transformar
                  minha vida em amor.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <img
                  key={currentPhoto}
                  src={photos[currentPhoto]}
                  alt="Foto romântica"
                  className="h-44 w-full object-cover transition-opacity duration-700"
                />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        i === currentPhoto ? "w-4 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-black/25 p-3">
                <p className="text-xs text-white/60">Tempo juntos</p>
                <p className="text-lg font-bold text-white">4 anos, 1 mês e 9 dias</p>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-3">
                  <p className="text-xs text-white/70">Nossa música</p>
                  <p className="text-sm font-semibold text-white">Perfect — Ed Sheeran</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-2">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=116x116&data=https%3A%2F%2Fnossomomento.com.br%2Fmomento%2Fana-e-lucas"
                    alt="QR Code demo"
                    className="h-[4.5rem] w-[4.5rem] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
