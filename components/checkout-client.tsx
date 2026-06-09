"use client";

import { HeartBackground } from "@/components/heart-background";
import { PrimaryButton } from "@/components/ui";
import { useState } from "react";

const PLAN_LABELS: Record<string, string> = {
  CLASSIC: "Clássico",
  PREMIUM: "Premium",
};

const PLAN_PRICES: Record<string, string> = {
  CLASSIC: "R$ 9,99",
  PREMIUM: "R$ 19,99",
};

type CheckoutClientProps = {
  testMode: boolean;
  pageId: string | null;
  status: string | null;
  plan: string;
};

export function CheckoutClient({ testMode, pageId, status, plan }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planLabel = PLAN_LABELS[plan] ?? "Clássico";
  const planPrice = PLAN_PRICES[plan] ?? "R$ 9,99";

  async function startPayment() {
    if (!pageId) {
      setError("Surpresa não encontrada. Volte e crie sua página novamente.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.initPoint) {
      setError(data.error ?? "Não foi possível iniciar o pagamento.");
      return;
    }

    window.location.href = data.initPoint;
  }

  if (!pageId) {
    return (
      <main className="romantic-gradient relative flex min-h-screen items-center px-4 py-10">
        <div className="glass-card mx-auto w-full max-w-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-100">
            Não encontramos sua surpresa. Crie uma nova página em /criar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="romantic-gradient relative flex min-h-screen items-center overflow-hidden px-4 py-10">
      <HeartBackground />
      <div className="romantic-glow romantic-glow-left" />
      <div className="romantic-glow romantic-glow-right" />

      <div className="glass-card relative z-10 mx-auto w-full max-w-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-white">Plano {planLabel}</h1>
        <p className="mt-2 text-sm text-cream/80">
          Finalize o pagamento para liberar sua surpresa romântica.
        </p>

        <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.15em] text-cream/60">Valor a pagar</p>
          <p className="mt-1 text-4xl font-black text-white">{planPrice}</p>
          <p className="mt-1 text-sm text-cream/70">Plano {planLabel} · pagamento único</p>
        </div>

        {status === "pending" && (
          <p className="mt-4 rounded-lg bg-yellow-500/20 p-2 text-sm text-yellow-100">
            Pagamento pendente. Finalize no Mercado Pago.
          </p>
        )}

        {status === "failed" && (
          <p className="mt-4 rounded-lg bg-red-500/20 p-2 text-sm text-red-100">
            Pagamento recusado. Tente novamente.
          </p>
        )}

        {testMode && (
          <p className="mt-4 rounded-lg bg-yellow-500/20 p-2 text-sm text-yellow-100">
            O pagamento online ainda não está configurado corretamente.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{error}</p>
        )}

        <PrimaryButton className="mt-6 w-full py-4" onClick={startPayment}>
          {loading ? "Carregando..." : `Pagar ${planPrice} com segurança`}
        </PrimaryButton>

        <p className="mt-4 text-xs text-cream/50">
          Pagamento seguro via Mercado Pago. Seus dados são protegidos.
        </p>
      </div>
    </main>
  );
}