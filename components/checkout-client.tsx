"use client";

import { HeartBackground } from "@/components/heart-background";
import { PrimaryButton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CheckoutClientProps = {
  testMode: boolean;
  pageId: string | null;
  status: string | null;
};

export function CheckoutClient({ testMode, pageId, status }: CheckoutClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      body: JSON.stringify({ pageId })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.initPoint) {
      setError(data.error ?? "Não foi possível iniciar o pagamento.");
      return;
    }

    window.location.href = data.initPoint;
  }

  async function simulatePayment() {
    if (!pageId) {
      setError("Surpresa não encontrada. Volte e crie sua página novamente.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Não foi possível simular o pagamento.");
      return;
    }

    router.push(`/sucesso?pageId=${pageId}`);
  }

  if (!pageId) {
    return (
      <main className="romantic-gradient relative flex min-h-screen items-center px-4 py-10">
        <div className="glass-card mx-auto w-full max-w-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Checkout Premium</h1>
          <p className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-100">
            Não encontramos sua surpresa. Crie uma nova página em /criar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="romantic-gradient relative flex min-h-screen items-center overflow-hidden px-4 py-10">
      {testMode && <HeartBackground />}
      <div className="romantic-glow romantic-glow-left" />
      <div className="romantic-glow romantic-glow-right" />

      <div className="glass-card relative z-10 mx-auto w-full max-w-lg p-6 text-center">
        {testMode ? (
          <>
            <span className="inline-flex rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5e6b8]">
              Modo teste
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white">Checkout em modo teste</h1>
            <p className="mt-3 text-sm leading-relaxed text-cream/85">
              O Mercado Pago ainda não está configurado. Você pode simular um pagamento
              aprovado para testar o fluxo premium.
            </p>
            <p className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-cream/75">
              Após simular, sua surpresa será liberada com música, animações e QR Code.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white">Checkout Premium</h1>
            <p className="mt-2 text-sm text-cream/80">
              Desbloqueie animações, música, QR Code e experiência completa para seu amor.
            </p>
          </>
        )}

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
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{error}</p>
        )}

        {testMode ? (
          <PrimaryButton className="mt-6 w-full py-4" onClick={simulatePayment}>
            {loading ? "Simulando..." : "Simular pagamento aprovado"}
          </PrimaryButton>
        ) : (
          <PrimaryButton className="mt-6 w-full py-4" onClick={startPayment}>
            {loading ? "Carregando..." : "Pagar com segurança"}
          </PrimaryButton>
        )}
      </div>
    </main>
  );
}
