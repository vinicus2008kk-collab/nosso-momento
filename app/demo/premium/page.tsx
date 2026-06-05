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
    <main
      className="relative min-h-screen overflow-hidden px-4 py-10"
      style={{ background: "linear-gradient(160deg,#fdf6ee 0%,#f8ede0 40%,#faf2e8 100%)" }}
    >
      <HeartBackground />
      <MouseReactiveParticles />

      <div className="pointer-events-none absolute -left-32 -top-32 h-[38rem] w-[38rem] rounded-full opacity-20" style={{ background: "radial-gradient(circle,rgba(139,26,42,0.45),transparent 70%)", filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full opacity-10" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.4),transparent 70%)", filter: "blur(100px)" }} />

      <section className="relative mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span
            className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: "rgba(139,26,42,0.08)", border: "1px solid rgba(139,26,42,0.2)", color: "#8b1a2a" }}
          >
            ✨ Demonstração — Premium
          </span>

          <h1 className="text-4xl font-black leading-tight md:text-5xl" style={{ color: "#1e0d0d" }}>
            Uma experiência cinematográfica e inesquecível
          </h1>

          <p className="text-lg" style={{ color: "#5a3535" }}>
            Com o Premium você tem várias fotos com carrossel automático, música
            do YouTube, QR Code exclusivo, animações e visual sem marca d&apos;água.
          </p>

          <ul className="space-y-2 text-sm" style={{ color: "#5a3535" }}>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> Fotos ilimitadas com carrossel animado</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> Música personalizada do YouTube</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> QR Code para compartilhar</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> Link exclusivo do casal</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> Animações e partículas interativas</li>
            <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✦</span> Sem marca d&apos;água</li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/criar" className="px-10 py-4 text-lg">
              Criar experiência Premium
            </PrimaryButton>
            <a
              href="/demo/gratis"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition hover:opacity-80"
              style={{ border: "1px solid rgba(139,26,42,0.25)", color: "#8b1a2a", background: "rgba(139,26,42,0.05)" }}
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
                <p className="text-xs uppercase tracking-widest" style={{ color: "#6b4040" }}>Nosso Momento ✦ Premium</p>
                <h2 className="text-2xl font-black" style={{ color: "#1e0d0d" }}>Ana + Lucas</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#4a2a2a" }}>
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
                        i === currentPhoto ? "w-4" : "w-1.5"
                      }`}
                      style={{ background: i === currentPhoto ? "#8b1a2a" : "rgba(139,26,42,0.3)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-3" style={{ background: "rgba(139,26,42,0.05)", border: "1px solid rgba(139,26,42,0.12)" }}>
                <p className="text-xs" style={{ color: "#6b4040" }}>Tempo juntos</p>
                <p className="text-lg font-bold" style={{ color: "#1e0d0d" }}>4 anos, 1 mês e 9 dias</p>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-3">
                  <p className="text-xs text-white/70">Nossa música</p>
                  <p className="text-sm font-semibold text-white">Perfect — Ed Sheeran</p>
                </div>
                <div className="rounded-2xl p-2" style={{ background: "rgba(139,26,42,0.06)", border: "1px solid rgba(139,26,42,0.12)" }}>
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
