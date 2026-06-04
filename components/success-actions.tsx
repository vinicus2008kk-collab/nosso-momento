"use client";

import { useState } from "react";

export function SuccessActions({ publicUrl, slug }: { publicUrl: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function downloadQr() {
    window.open(`/api/qr/${slug}`, "_blank");
  }

  function shareWhatsApp() {
    const message = `💖 Sua surpresa está pronta!\n\nAbra aqui:\n${publicUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button onClick={copyLink} className="rounded-full bg-blush px-5 py-2 text-sm font-semibold text-white">
        {copied ? "Link copiado!" : "Copiar link"}
      </button>

      <button onClick={shareWhatsApp} className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white">
        Compartilhar WhatsApp
      </button>

      <button onClick={downloadQr} className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white">
        Baixar QR Code em PNG
      </button>
    </div>
  );
}