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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
    surpriseUrl
  )}`;

  async function copyLink() {
    await navigator.clipboard.writeText(surpriseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadQrCode() {
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code-surpresa.png";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }

  async function handleConfirm() {
    if (!method) return;

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
      setSent(true);
      window.open(whatsappUrl, "_blank");
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

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-2xl border border-white/20 bg-white p-4 text-center">
        <img
          src={qrCodeUrl}
          alt="QR Code da surpresa"
          className="mx-auto h-56 w-56 rounded-xl"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            onClick={copyLink}
            className="rounded-full bg-blush px-4 py-3 text-sm font-semibold text-white"
          >
            {copied ? "Link copiado!" : "Copiar link"}
          </button>

          <button
            onClick={downloadQrCode}
            className="rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20"
          >
            Baixar QR Code
          </button>
        </div>

        <a
          href={surpriseUrl}
          target="_blank"
          className="mt-3 block rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Abrir surpresa
        </a>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
        <h2 className="text-lg font-semibold text-white">
          Como você quer receber sua surpresa?
        </h2>

        {!method && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod("email")}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center"
            >
              <p className="text-2xl">📧</p>
              <p className="mt-2 text-sm font-semibold text-white">E-mail</p>
            </button>

            <button
              onClick={() => setMethod("whatsapp")}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center"
            >
              <p className="text-2xl">💬</p>
              <p className="mt-2 text-sm font-semibold text-white">WhatsApp</p>
            </button>
          </div>
        )}

        {method && (
          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                setMethod(null);
                setContact("");
                setError("");
              }}
              className="text-xs text-cream/60 underline"
            >
              ← Voltar
            </button>

            <input
              type={method === "email" ? "email" : "tel"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={
                method === "email" ? "seuemail@exemplo.com" : "11999999999"
              }
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-cream/40"
            />

            {error && (
              <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-100">
                {error}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full rounded-full bg-blush py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? "Enviando..."
                : method === "email"
                ? "Enviar por e-mail"
                : "Abrir WhatsApp"}
            </button>

            {sent && (
              <p className="rounded-lg bg-green-500/20 p-2 text-center text-sm text-green-100">
                {method === "email"
                  ? "E-mail enviado com sucesso!"
                  : "WhatsApp aberto. É só enviar a mensagem!"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}