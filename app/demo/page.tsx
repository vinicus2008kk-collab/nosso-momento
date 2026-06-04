"use client";

import { PrimaryButton } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";
import { MouseReactiveParticles } from "@/components/mouse-reactive-particles";
import { useEffect, useState } from "react";

const demoPhotos = [
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
];

export default function DemoPage() {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % demoPhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="romantic-gradient relative min-h-screen overflow-hidden px-4 py-8">
      <HeartBackground />
      <MouseReactiveParticles />
      <div className="cinematic-vignette" />

      <section className="relative mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-cream/90">
            Demonstração real
          </span>
          <h1 className="text-5xl font-black leading-tight text-white md:text-6xl">
            Veja a experiência romântica em ação
          </h1>
          <p className="text-xl text-cream/90">
            Esta é uma prévia visual do resultado final que o casal recebe com música,
            QR Code, fotos e uma atmosfera cinematográfica.
          </p>
          <PrimaryButton href="/criar" className="px-12 py-4 text-xl">
            Criar a minha agora
          </PrimaryButton>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="phone-mockup iphone-shell mx-auto">
            <div className="phone-notch" />
            <div className="phone-mockup-screen iphone-screen relative overflow-hidden">
              <div className="screen-reflection" />
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/75">Nosso Momento</p>
                <h2 className="text-3xl font-black text-white">Ana + Lucas</h2>
                <p className="text-sm text-cream/90">
                  Em cada detalhe, eu te escolho de novo. Obrigado por transformar
                  minha vida em amor.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={demoPhotos[currentPhoto]}
                  alt="Foto romantica"
                  className="h-48 w-full object-cover transition-opacity duration-700"
                  key={currentPhoto}
                />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {demoPhotos.map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1.5 rounded-full transition-all duration-300 ${i === currentPhoto ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/25 bg-black/25 p-3">
                <p className="text-xs text-cream/80">Tempo juntos</p>
                <p className="text-lg font-bold text-white">4 anos, 1 mês e 9 dias</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="rounded-2xl border border-white/25 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-3">
                  <p className="text-xs text-white/85">Nossa música</p>
                  <p className="text-sm font-semibold text-white">Perfect - Ed Sheeran</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-white/10 p-2">
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
