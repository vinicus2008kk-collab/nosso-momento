"use client";

import { useState } from "react";

type DeliveryMethod = "email" | "whatsapp";

type Props = {
  pageId: string;
  surpriseUrl: string;
};

export function SuccessDelivery({ pageId, surpriseUrl }: Props) {
  const [method, setMethod] = useState<DeliveryMethod | null>(null);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!contact.trim()) {
      setError(method === "email" ? "Digite o e-mail." : "Digite o número com DDD.");
      return;
    }

    setLoading(true);
    setError("");

    if (method === "whatsapp") {
      const digits = contact.replace(/\D/g, "");
      const phone = digits.startsWith("55") ? digits : `55${digits}`;
      const message = `Oi! Sua surpresa especial está pronta 💝 Acesse aqui: ${surpriseUrl}`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      await fetch("/api/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, method: "whatsapp", contact }),
      });

      setLoading(false);
      window.open(whatsappUrl, "_blank");
      setSent(true);
      return;
    }

    const response = await fetch("/api/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, method: "email", contact }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Não foi possível enviar o e-mail. Tente novamente.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5 text-center">
        <p className="text-2xl">💝</p>
        <p className="mt-2 text-base font-semibold text-white">
          {method === "email" ? "E-mail enviado com sucesso!" : "WhatsApp pronto para enviar!"}
        </p>
        <p className="mt-1 text-sm text-cream/80">
          {method === "email"
            ? `O link da surpresa foi enviado para ${contact}.`
            : "A mensagem foi aberta no WhatsApp. É só enviar!"}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Como você quer receber sua surpresa?
      </h2>

      {!method && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("email")}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center transition hover:bg-white/20"
          >
            <p className="text-2xl">📧</p>
            <p className="mt-2 text-sm font-semibold text-white">Receber por e-mail</p>
          </button>
          <button
            onClick={() => setMethod("whatsapp")}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center transition hover:bg-white/20"
          >
            <p className="text-2xl">💬</p>
            <p className="mt-2 text-sm font-semibold text-white">Receber por WhatsApp</p>
          </button>
        </div>
      )}

      {method && (
        <div className="space-y-3">
          <button
            onClick={() => { setMethod(null); setContact(""); setError(""); }}
            className="text-xs text-cream/60 underline"
          >
            ← Voltar
          </button>

          {method === "email" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-cream/80">
                Digite seu e-mail
              </label>
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-cream/80">
                Digite o número com DDD
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="11999999999"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{error}</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full rounded-full bg-blush py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {loading
              ? "Enviando..."
              : method === "email"
              ? "Enviar link por e-mail"
              : "Abrir WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}
