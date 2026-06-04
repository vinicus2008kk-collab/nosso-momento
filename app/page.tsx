import { PrimaryButton, SectionTitle } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";
import { MouseReactiveParticles } from "@/components/mouse-reactive-particles";

const steps = [
  "Personalize sua página",
  "Pague com segurança",
  "Receba o link e QR Code",
  "Surpreenda quem você ama"
];

const benefits = [
  "Design romântico premium",
  "Página pronta para celular",
  "Música, fotos e animações",
  "Link exclusivo para o casal"
];

const testimonials = [
  {
    quote:
      "Ela chorou quando abriu o QR Code. Foi o presente mais especial do nosso Dia dos Namorados.",
    author: "Marcos e Luiza"
  },
  {
    quote:
      "A experiência parece app de marca grande. Fácil de criar e lindo no celular.",
    author: "Fernanda e Caio"
  },
  {
    quote:
      "Consegui montar em minutos e ficou com cara premium. Recomendo demais.",
    author: "Bianca e Rafael"
  }
];

export default function HomePage() {
  const today = new Date();
  const currentYear = today.getMonth() > 5 || (today.getMonth() === 5 && today.getDate() > 12) ? today.getFullYear() + 1 : today.getFullYear();
  const valentinesDay = new Date(currentYear, 5, 12);
  const diffMs = Math.max(valentinesDay.getTime() - today.getTime(), 0);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <main className="romantic-gradient relative min-h-screen overflow-hidden">
      <HeartBackground />
      <MouseReactiveParticles />
      <div className="romantic-glow romantic-glow-left" />
      <div className="romantic-glow romantic-glow-right" />
      <div className="cinematic-vignette" />

      <section className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 pb-10 pt-7 md:grid-cols-2 md:items-center md:pt-10">
        <div className="space-y-4 text-center md:text-left">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-cream/95 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            Nosso Momento - Especial Dia dos Namorados
          </span>
          <h1 className="text-5xl font-black leading-[1.01] text-white sm:text-7xl lg:text-[5.4rem]">
            Transforme o seu amor em uma experiência inesquecível
          </h1>
          <p className="mx-auto max-w-2xl text-2xl leading-relaxed text-cream/95 md:mx-0 md:text-[1.75rem]">
            Crie uma página romântica premium com fotos, música, mensagem especial,
            contador do tempo juntos e QR Code. Um presente digital que emociona no
            primeiro toque.
          </p>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-sm text-cream/95">
            <span className="text-lg">⏳</span>
            Faltam <strong className="text-white">{daysLeft} dias</strong> para o Dia dos Namorados
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <PrimaryButton href="/criar" className="px-12 py-5 text-2xl shadow-[0_0_48px_rgba(255,79,135,0.7)]">
              Criar minha surpresa
            </PrimaryButton>
            <a
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 px-10 py-5 text-xl font-semibold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/25"
            >
              Ver demonstração
            </a>
            <a
              href="#planos"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-11 py-4 text-xl font-semibold text-white transition hover:bg-white/20"
            >
              Ver planos
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="phone-mockup iphone-shell mx-auto">
            <div className="phone-notch" />
            <div className="phone-mockup-screen iphone-screen">
              <div className="screen-reflection" />
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Preview em tempo real
                </p>
                <h3 className="text-2xl font-bold text-white">Ana + Lucas</h3>
                <p className="text-sm leading-relaxed text-cream/90">
                  Desde aquele primeiro olhar, cada instante ao seu lado virou
                  poesia. Obrigado por ser o meu lugar favorito.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                ].map((url, item) => (
                  <div
                    key={item}
                    className="h-14 rounded-xl border border-white/35 bg-cover bg-center"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                ))}
              </div>
              <div className="rounded-2xl border border-white/25 bg-black/20 p-3">
                <p className="text-xs text-cream/80">Tempo juntos</p>
                <p className="text-xl font-bold text-white">3 anos, 2 meses e 14 dias</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="rounded-2xl border border-white/30 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-3 text-center text-sm font-semibold text-white">
                  Toque para ouvir nossa música
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/15 p-2">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https%3A%2F%2Fnossomomento.com.br%2Fmomento%2Fana-e-lucas"
                    alt="QR Code de exemplo"
                    className="h-16 w-16 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-5 px-4 pb-14 md:grid-cols-2">
        <div className="glass-card romantic-card p-8 sm:p-9">
          <SectionTitle title="Como funciona" subtitle="Em 4 passos simples" />
          <ol className="mt-5 space-y-3 text-lg text-cream/95">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#b08935]/30 text-base font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="glass-card romantic-card p-8 sm:p-9">
          <SectionTitle title="Benefícios" subtitle="Feito para surpreender" />
          <ul className="mt-5 space-y-3 text-lg text-cream/95">
            {benefits.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-2xl text-[#d4af37]">♥</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="planos" className="relative mx-auto max-w-7xl px-4 pb-14">
        <SectionTitle
          title="Planos"
          subtitle="Comece grátis e faça upgrade para uma experiência completa"
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="glass-card romantic-card p-9">
            <h3 className="text-3xl font-bold text-white">Plano Grátis</h3>
            <p className="mt-2 text-lg leading-relaxed text-cream/85">
              1 foto, mensagem simples, contador e marca d&apos;água.
            </p>
            <p className="mt-5 text-5xl font-black text-white">R$ 0</p>
          </div>
          <div className="glass-card romantic-card border-[#d4af37]/40 p-9">
            <p className="inline-flex rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
              Mais escolhido
            </p>
            <h3 className="mt-2 text-3xl font-bold text-white">Plano Premium</h3>
            <p className="mt-2 text-lg leading-relaxed text-cream/90">
              Até 5 fotos, música, QR Code, link personalizado, animações e sem
              marca d&apos;água.
            </p>
            <p className="mt-5 text-5xl font-black text-white">Perfeito para presentear</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-10">
        <SectionTitle
          title="Exemplos visuais"
          subtitle="Layouts apaixonantes para momentos especiais"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {["Clássico", "Vinho", "Rosa Dream", "Noite Estrelada"].map((theme) => (
            <div key={theme} className="glass-card romantic-card p-8 text-center">
              <p className="text-3xl font-semibold text-white">{theme}</p>
              <p className="mt-1 text-base text-cream/80">
                Paleta e elementos pensados para emocionar.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-12">
        <SectionTitle
          title="Depoimentos apaixonados"
          subtitle="Quem já criou uma surpresa com o Nosso Momento"
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="glass-card romantic-card p-6">
              <p className="text-base leading-relaxed text-cream/90">&quot;{item.quote}&quot;</p>
              <p className="mt-3 text-sm font-semibold text-white">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-14 text-center">
        <div className="glass-card romantic-card px-8 py-9 sm:px-10">
          <h3 className="text-4xl font-black text-white md:text-6xl">
            Pronto para criar a surpresa perfeita?
          </h3>
          <p className="mx-auto mt-2 max-w-3xl text-2xl text-cream/85">
            Seu amor merece uma experiência inesquecível neste Dia dos Namorados.
          </p>
          <PrimaryButton href="/criar" className="mt-6 px-16 py-5 text-2xl shadow-[0_0_55px_rgba(255,79,135,0.72)]">
            Criar minha surpresa
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
