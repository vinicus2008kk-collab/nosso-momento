import { PrimaryButton } from "@/components/ui";
import { HeartBackground } from "@/components/heart-background";
import { MouseReactiveParticles } from "@/components/mouse-reactive-particles";
import { DemoModalButton } from "@/components/demo-modal-button";

const benefits = [
  { icon: "💝", title: "Surpreenda quem você ama", desc: "Um presente digital que emociona no primeiro toque." },
  { icon: "📸", title: "Guarde momentos especiais", desc: "Fotos, música e mensagens reunidas numa página única." },
  { icon: "🔒", title: "Privado e seguro", desc: "Só quem tem o link acessa. 100% exclusivo para vocês." },
  { icon: "✨", title: "Fácil de criar e presentear", desc: "Pronto em minutos. Sem instalar nada." },
];

const steps = [
  { n: "01", label: "Personalize sua página" },
  { n: "02", label: "Pague com segurança" },
  { n: "03", label: "Receba o link e QR Code" },
  { n: "04", label: "Surpreenda quem você ama" },
];

const testimonials = [
  {
    quote: "Ela chorou quando abriu o QR Code. Foi o presente mais especial do nosso Dia dos Namorados.",
    author: "Marcos e Luiza",
    image: "/testimonials/casal-1.png",
  },
  {
    quote: "A experiência parece app de marca grande. Fácil de criar e lindo no celular.",
    author: "Fernanda e Caio",
    image: "/testimonials/casal-2.png",
  },
  {
    quote: "Consegui montar em minutos e ficou com cara premium. Recomendo demais.",
    author: "Bianca e Rafael",
    image: "/testimonials/casal-3.png",
  },
];
export default function HomePage() {
  const today = new Date();
  const currentYear = today.getMonth() > 5 || (today.getMonth() === 5 && today.getDate() > 12) ? today.getFullYear() + 1 : today.getFullYear();
  const valentinesDay = new Date(currentYear, 5, 12);
  const diffMs = Math.max(valentinesDay.getTime() - today.getTime(), 0);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg,#fdf6ee 0%,#f8ede0 40%,#faf2e8 100%)" }}>
      <HeartBackground />
      <MouseReactiveParticles />

      {/* Ambient glows — warm rose, sem neon */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[38rem] w-[38rem] rounded-full opacity-20" style={{ background: "radial-gradient(circle,rgba(139,26,42,0.45),transparent 70%)", filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full opacity-10" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.4),transparent 70%)", filter: "blur(100px)" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full opacity-10" style={{ background: "radial-gradient(circle,rgba(139,26,42,0.3),transparent 70%)", filter: "blur(100px)" }} />

      {/* ── HEADER ── */}
      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:py-6">
        <div className="flex items-baseline gap-0.5">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", color: "#1e0d0d" }}
          >
            Nosso
          </span>
          <span
            className="text-[1.7rem] leading-none"
            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#8b1a2a", fontWeight: 700 }}
          >
            &nbsp;Momento
          </span>
        </div>
        <a
          href="#planos"
          className="hidden text-sm font-semibold transition-opacity hover:opacity-60 sm:block"
          style={{ color: "#8b1a2a" }}
        >
          Ver planos
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 pb-16 pt-4 md:flex-row md:items-center md:gap-16 md:pt-8">

        {/* Left */}
        <div className="flex-1 space-y-7 text-center md:text-left">

          {/* Countdown badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            style={{ background: "rgba(139,26,42,0.08)", border: "1px solid rgba(139,26,42,0.2)", color: "#8b1a2a" }}
          >
            <span>🕯️</span>
            Faltam <strong>{daysLeft} dias</strong> para o Dia dos Namorados
          </div>

          {/* Title */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(139,26,42,0.55)" }}>
              ✦ Presente Digital Romântico ✦
            </p>
            <h1
              className="font-black leading-[0.95]"
              style={{ fontSize: "clamp(2.8rem,7.5vw,5.2rem)", color: "#1e0d0d" }}
            >
              O presente que<br />
              <em
                style={{
                  fontStyle: "italic",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#8b1a2a",
                }}
              >
                ela / ele vai amar
              </em>
            </h1>
          </div>

          <p className="mx-auto max-w-lg text-lg leading-relaxed md:mx-0 md:text-xl" style={{ color: "#5a3535" }}>
            Crie uma página exclusiva com fotos, música e uma mensagem de amor —
            e presenteie com um QR Code romântico.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right,transparent,rgba(139,26,42,0.3))" }} />
            <span className="text-sm" style={{ color: "rgba(139,26,42,0.45)" }}>♥ ♥ ♥</span>
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left,transparent,rgba(139,26,42,0.3))" }} />
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <PrimaryButton href="/criar" className="px-10 py-5 text-lg">
              Criar Nosso Momento ♡
            </PrimaryButton>
            <DemoModalButton />
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm" style={{ color: "#7a4848" }}>
            <span className="flex items-center gap-1.5"><span style={{ color: "#8b1a2a" }}>✓</span> Gratuito para começar</span>
            <span className="flex items-center gap-1.5"><span style={{ color: "#8b1a2a" }}>✓</span> Pronto em 5 minutos</span>
            <span className="flex items-center gap-1.5"><span style={{ color: "#8b1a2a" }}>✓</span> Link exclusivo</span>
          </div>
        </div>

        {/* Right — phone mockup (mantém escuro para contraste) */}
        <div className="flex w-full max-w-xs flex-shrink-0 justify-center md:max-w-sm">
          <div className="phone-mockup iphone-shell">
            <div className="phone-notch" />
            <div className="phone-mockup-screen iphone-screen" style={{ background: "linear-gradient(160deg,#1a0810,#0e0608)" }}>
              <div className="screen-reflection" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "rgba(212,175,55,0.75)" }}>
                  ✦ Nosso Momento ✦
                </p>
                <h3 className="text-2xl font-black text-white">Ana + Lucas</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,235,215,0.85)" }}>
                  Desde aquele primeiro olhar, cada instante ao seu lado virou poesia. Obrigado por ser o meu lugar favorito.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                ].map((url, i) => (
                  <div key={i} className="h-14 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${url})`, border: "1px solid rgba(212,175,55,0.2)" }} />
                ))}
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <p className="text-xs" style={{ color: "rgba(255,235,215,0.6)" }}>Tempo juntos</p>
                <p className="text-xl font-bold text-white">3 anos, 2 meses e 14 dias</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="rounded-2xl p-3 text-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#8b1a2a,#6a1525)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  🎵 Toque para ouvir
                </div>
                <div className="rounded-2xl p-2" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https%3A%2F%2Fnossomomento.com.br%2Fmomento%2Fana-e-lucas" alt="QR Code" className="h-16 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#8b1a2a" }}>Por que nos escolher</p>
          <h2 className="text-4xl font-black md:text-5xl" style={{ color: "#1e0d0d" }}>Feito para emocionar</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="romantic-card group rounded-3xl p-7 text-center"
              style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.09)", boxShadow: "0 4px 20px rgba(139,26,42,0.07)" }}
            >
              <div
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ background: "rgba(139,26,42,0.07)", border: "1px solid rgba(139,26,42,0.12)" }}
              >
                {b.icon}
              </div>
              <h3 className="mb-2 text-base font-bold" style={{ color: "#1e0d0d" }}>{b.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b4040" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#8b1a2a" }}>Simples assim</p>
          <h2 className="text-4xl font-black md:text-5xl" style={{ color: "#1e0d0d" }}>Como funciona</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="romantic-card relative rounded-3xl p-7"
              style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.09)", boxShadow: "0 4px 20px rgba(139,26,42,0.07)" }}
            >
              <p className="mb-3 text-5xl font-black leading-none" style={{ color: "rgba(139,26,42,0.15)" }}>{s.n}</p>
              <p className="text-base font-semibold" style={{ color: "#1e0d0d" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

     {/* ── PLANS ── */}
<section id="planos" className="relative mx-auto max-w-7xl px-5 pb-16">
  <div className="mb-10 text-center">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#8b1a2a" }}>
      Escolha sua
    </p>

    <h2 className="text-4xl font-black md:text-5xl" style={{ color: "#1e0d0d" }}>
      Experiência Romântica
    </h2>

    <p className="mx-auto mt-3 max-w-lg text-lg" style={{ color: "#6b4040" }}>
      Escolha a experiência ideal para surpreender quem você ama
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2">

          {/* Free */}
          <div
            className="romantic-card flex flex-col rounded-3xl p-9"
            style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.12)", boxShadow: "0 4px 20px rgba(139,26,42,0.07)" }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#9b7070" }}>Para começar</p>
            <h3 className="text-3xl font-black" style={{ color: "#1e0d0d" }}>Clássico</h3>
            <p className="mt-2 text-base leading-relaxed" style={{ color: "#6b4040" }}>1 foto, mensagem simples, contador e marca d&apos;água.</p>
            <ul className="mt-6 space-y-2.5 text-sm" style={{ color: "#6b4040" }}>
  <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> 1 foto</li>
  <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> Mensagem personalizada</li>
  <li className="flex items-center gap-2"><span style={{ color: "#8b1a2a" }}>✓</span> Contador de tempo juntos</li>
  <li className="flex items-center gap-2"><span style={{ color: "#9b7070" }}>×</span> Música do YouTube</li>
  <li className="flex items-center gap-2"><span style={{ color: "#9b7070" }}>×</span> QR Code exclusivo</li>
  <li className="flex items-center gap-2"><span style={{ color: "#9b7070" }}>×</span> Fotos ilimitadas</li>
</ul>
<li className="flex items-center gap-2">
  <span style={{ color: "#9b7070" }}>✕</span>
  Animações especiais
</li>
            <PrimaryButton href="/criar" className="mt-auto w-full py-4 text-base">
  Criar versão Clássica ♡
</PrimaryButton>
          </div>

          {/* Premium — mantém escuro para contraste e destaque */}
          <div
            className="romantic-card relative flex flex-col overflow-hidden rounded-3xl p-9"
            style={{ background: "linear-gradient(160deg,#2a0810,#1a0610,#0f0408)", border: "1px solid rgba(201,168,76,0.38)", boxShadow: "0 0 60px rgba(139,26,42,0.18),0 30px 70px rgba(0,0,0,0.12)" }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-18" style={{ background: "radial-gradient(circle,#c9a84c,transparent 70%)" }} />
            <div className="mb-3 flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(201,168,76,0.16)", border: "1px solid rgba(201,168,76,0.35)", color: "#c9a84c" }}
              >
                ✦ Mais escolhido
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">Premium</h3>
            <p className="mt-2 text-base leading-relaxed" style={{ color: "rgba(255,235,215,0.85)" }}>Até 5 fotos, música, QR Code, link personalizado, animações e sem marca d&apos;água.</p>
            <p className="mt-5 text-lg font-semibold" style={{ color: "#c9a84c" }}>O presente que ela / ele vai amar ✦</p>
            <ul className="mt-5 space-y-2.5 text-sm" style={{ color: "rgba(255,235,215,0.85)" }}>
              <li className="flex items-center gap-2"><span style={{ color: "#c9a84c" }}>✦</span> Até 5 fotos com carrossel</li>
              <li className="flex items-center gap-2"><span style={{ color: "#c9a84c" }}>✦</span> Música do YouTube</li>
              <li className="flex items-center gap-2"><span style={{ color: "#c9a84c" }}>✦</span> QR Code exclusivo</li>
              <li className="flex items-center gap-2"><span style={{ color: "#c9a84c" }}>✦</span> Link personalizado</li>
              <li className="flex items-center gap-2"><span style={{ color: "#c9a84c" }}>✦</span> Sem marca d&apos;água</li>
            </ul>
            <PrimaryButton href="/criar" className="mt-auto w-full py-4 text-base">
              Criar experiência Premium ♡
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* ── VISUAL THEMES ── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#8b1a2a" }}>Layouts exclusivos</p>
          <h2 className="text-4xl font-black md:text-5xl" style={{ color: "#1e0d0d" }}>Exemplos visuais</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Clássico", color: "from-[#1a0a10] to-[#0d0608]", accent: "#b08090" },
            { name: "Vinho", color: "from-[#2a0810] to-[#180508]", accent: "#c0304a" },
            { name: "Rosa Dream", color: "from-[#2a0820] to-[#180510]", accent: "#e060a0" },
            { name: "Noite Estrelada", color: "from-[#080820] to-[#04040e]", accent: "#6080d0" },
          ].map((t) => (
            <div
              key={t.name}
              className={`romantic-card flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b ${t.color} p-10 text-center`}
              style={{ border: `1px solid ${t.accent}35` }}
            >
              <div className="mb-3 text-3xl">🌹</div>
              <p className="text-xl font-bold text-white">{t.name}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,235,215,0.5)" }}>Paleta pensada para emocionar</p>
            </div>
          ))}
        </div>
      </section>

{/* ── TESTIMONIALS ── */}
<section className="relative mx-auto max-w-7xl px-5 pb-16">
  <div className="mb-10 text-center">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#8b1a2a" }}>Histórias reais</p>
    <h2 className="text-4xl font-black md:text-5xl" style={{ color: "#1e0d0d" }}>Depoimentos apaixonados</h2>
  </div>

  <div className="grid gap-5 md:grid-cols-3">
    {testimonials.map((t) => (
      <div
        key={t.author}
        className="romantic-card rounded-3xl p-7"
        style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.09)", boxShadow: "0 4px 20px rgba(139,26,42,0.07)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <img
            src={t.image}
            alt={t.author}
            className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
            style={{ border: "2px solid #8b1a2a", boxShadow: "0 6px 16px rgba(139,26,42,0.18)" }}
          />
          <p className="text-sm font-semibold" style={{ color: "#8b1a2a" }}>— {t.author}</p>
        </div>

        <p className="mb-2 text-4xl leading-none font-black" style={{ color: "rgba(139,26,42,0.2)" }}>&ldquo;</p>

        <p className="text-base leading-relaxed" style={{ color: "#4a2a2a" }}>
          {t.quote}
        </p>
      </div>
    ))}
  </div>
</section>

      {/* ── FINAL CTA ── */}
      <section className="relative mx-auto max-w-5xl px-5 pb-16">
        <div
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center"
          style={{ background: "linear-gradient(135deg,#8b1a2a,#6a1525,#4a1020)", border: "1px solid rgba(201,168,76,0.22)", boxShadow: "0 20px 60px rgba(139,26,42,0.25)" }}
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full opacity-15" style={{ background: "radial-gradient(circle,#c9a84c,transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#c9a84c,transparent 70%)" }} />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(201,168,76,0.75)" }}>✦ Especial Dia dos Namorados ✦</p>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            Pronto para criar<br />a surpresa perfeita?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: "rgba(255,235,215,0.82)" }}>
            Seu amor merece uma experiência inesquecível neste Dia dos Namorados.
          </p>
          <PrimaryButton
            href="/criar"
            className="mt-8 px-14 py-5 text-xl"
            style={{ background: "linear-gradient(135deg,#fdf6ee,#f5ece2)", color: "#8b1a2a", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
          >
            Quero Presentear Agora ♡
          </PrimaryButton>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm" style={{ color: "rgba(255,235,215,0.5)" }}>
            <span>♥ Gratuito para começar</span>
            <span>♥ Pronto em minutos</span>
            <span>♥ Link exclusivo do casal</span>
          </div>
        </div>
      </section>
    </main>
  );
}
