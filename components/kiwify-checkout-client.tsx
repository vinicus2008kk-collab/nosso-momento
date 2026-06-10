"use client";

import { useEffect, useState } from "react";

type Props = {
  pageId: string;
  plan: string;
  checkoutUrl: string;
};

export function KiwifyCheckoutClient({ pageId, plan, checkoutUrl }: Props) {
  const [checking, setChecking] = useState(true);

  const planLabel = plan === "PREMIUM" ? "Premium" : "Clássico";
  const price = plan === "PREMIUM" ? "R$ 19,99" : "R$ 9,99";

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.href = `/sucesso?pageId=${pageId}`;
    }, 3000);

    return () => clearInterval(interval);
  }, [pageId]);

  async function simulatePayment() {
    await fetch("/api/checkout/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    });

    window.location.href = `/sucesso?pageId=${pageId}`;
  }

  return (
    <main className="romantic-gradient flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card mx-auto w-full max-w-lg rounded-3xl p-6 text-center">
        <p className="text-5xl">💝</p>

        <h1 className="mt-4 text-3xl font-bold text-white">
          Finalize seu pagamento
        </h1>

        <p className="mt-2 text-cream/80">
          Plano {planLabel} — {price}
        </p>

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-left">
          <p className="text-sm font-semibold text-white">
            Como funciona:
          </p>

          <p className="mt-3 text-sm text-cream/80">
            1. Clique em <strong>Abrir checkout seguro</strong>.
          </p>

          <p className="mt-2 text-sm text-cream/80">
            2. Faça o pagamento na Kiwify.
          </p>

          <p className="mt-2 text-sm text-cream/80">
            3. Volte para esta aba. A liberação será automática.
          </p>
        </div>

        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-full bg-blush px-6 py-4 text-base font-bold text-white transition hover:brightness-110"
        >
          Abrir checkout seguro
        </a>

        <a
          href={`/sucesso?pageId=${pageId}`}
          className="mt-4 block rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/15"
        >
          Verificar minha surpresa
        </a>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="text-sm text-cream/80">
              {checking
                ? "Aguardando confirmação automática..."
                : "Verificando pagamento..."}
            </p>
          </div>
          <p className="mt-2 text-xs text-cream/50">
            Após o pagamento, volte para esta aba. Assim que a confirmação chegar,
            você será levado para o QR Code automaticamente.
          </p>
        </div>

        {process.env.NODE_ENV !== "production" && (
          <button
            onClick={simulatePayment}
            className="mt-4 w-full rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-black"
          >
            🛠 Simular pagamento aprovado
          </button>
        )}
      </div>
    </main>
  );
}