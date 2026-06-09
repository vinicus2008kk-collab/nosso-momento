"use client";

type Props = {
  pageId: string;
  plan: string;
  checkoutUrl: string;
};

export function KiwifyCheckoutClient({ pageId, plan, checkoutUrl }: Props) {
  const planLabel = plan === "PREMIUM" ? "Premium" : "Clássico";
  const price = plan === "PREMIUM" ? "R$ 19,99" : "R$ 9,99";

  return (
    <main className="romantic-gradient flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card mx-auto w-full max-w-lg p-6 text-center">
        <p className="text-5xl">💝</p>

        <h1 className="mt-4 text-3xl font-bold text-white">
          Finalize seu pagamento
        </h1>

        <p className="mt-2 text-cream/80">
          Plano {planLabel} — {price}
        </p>

        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-left">
          <p className="text-sm text-cream/80">
            1. Clique no botão abaixo para abrir o checkout da Kiwify.
          </p>
          <p className="mt-2 text-sm text-cream/80">
            2. Faça o pagamento.
          </p>
          <p className="mt-2 text-sm text-cream/80">
            3. Volte para esta página e clique em “Já paguei”.
          </p>
        </div>

        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-full bg-blush px-6 py-4 text-base font-semibold text-white"
        >
          Abrir checkout seguro
        </a>

        <a
          href={`/sucesso?pageId=${pageId}`}
          className="mt-4 block rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold text-white"
        >
          Já paguei, acessar minha surpresa
        </a>

        <p className="mt-4 text-xs text-cream/50">
          Após a confirmação do pagamento, sua surpresa será liberada automaticamente.
        </p>
      </div>
    </main>
  );
}