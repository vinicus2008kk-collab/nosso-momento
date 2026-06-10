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
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=700x700&data=${encodeURIComponent(
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
      setError(method === "email" ? "Digite seu e-mail." : "Digite o número com DDD.");
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
      setError(data.error ?? "Não foi possível enviar o e-mail.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <p className="text-sm font-semibold text-pink-300">Acesse sua surpresa agora</p>
          <p className="mt-1 text-xs leading-relaxed text-cream/60">
            Escaneie o QR Code com a câmera do celular ou copie o link abaixo.
          </p>
        </div>

        <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3 shadow-xl">
          <img
            src={qrCodeUrl}
            alt="QR Code da surpresa"
            className="h-52 w-52 rounded-xl"
          />
        </div>

        <div className="mt-5 grid gap-3">
          <button
            onClick={copyLink}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
          >
            {copied ? "✅ Link copiado!" : "📋 Copiar link"}
          </button>

          <a
            href={surpriseUrl}
            target="_blank"
            className="rounded-xl bg-black/50 px-5 py-3 text-center text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-black/70"
          >
            🔓 Abrir surpresa agora
          </a>

          <button
            onClick={downloadQrCode}
            className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
          >
            ⬇️ Baixar QR Code
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-cream/50">ou</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-xl backdrop-blur-xl">
        <h2 className="text-center text-lg font-bold text-white">
          Receber por outro canal
        </h2>

        {!method && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod("email")}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center transition hover:bg-white/15"
            >
              <p className="text-2xl">✉️</p>
              <p className="mt-2 text-sm font-semibold text-white">Receber por e-mail</p>
            </button>

            <button
              onClick={() => setMethod("whatsapp")}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center transition hover:bg-white/15"
            >
              <p className="text-2xl">🟢</p>
              <p className="mt-2 text-sm font-semibold text-white">Receber no WhatsApp</p>
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
                setSent(false);
              }}
              className="text-xs text-cream/60 underline"
            >
              ← Voltar
            </button>

            <input
              type={method === "email" ? "email" : "tel"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={method === "email" ? "seuemail@exemplo.com" : "11999999999"}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-cream/40 outline-none focus:ring-2 focus:ring-pink-400/40"
            />

            {error && (
              <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{error}</p>
            )}

            {sent && (
              <p className="rounded-lg bg-green-500/20 p-2 text-center text-sm text-green-100">
                {method === "email"
                  ? "E-mail enviado com sucesso!"
                  : "WhatsApp aberto. É só enviar a mensagem!"}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loading
                ? "Enviando..."
                : method === "email"
                ? "Enviar por e-mail"
                : "Abrir WhatsApp"}
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <p className="text-xs text-cream/50">Link da sua surpresa</p>
        <p className="mt-1 break-all text-sm font-medium text-pink-200">{surpriseUrl}</p>
      </div>
    </div>
  );
}