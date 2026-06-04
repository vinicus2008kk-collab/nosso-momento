"use client";

import { useEffect, useState } from "react";

type RomanticPage = {
  id: string;
  coupleName: string;
  slug: string;
  message: string;
  musicUrl: string | null;
  theme: string;
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED";
};

export default function DashboardPage() {
  const [pages, setPages] = useState<RomanticPage[]>([]);
  const [selected, setSelected] = useState<RomanticPage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/romantic-pages")
      .then((res) => res.json())
      .then((data) => setPages(data));
  }, []);

  async function save() {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/romantic-pages/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: selected.message,
        musicUrl: selected.musicUrl ?? "",
        theme: selected.theme
      })
    });
    setSaving(false);
  }

  return (
    <main className="romantic-gradient min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[320px_1fr]">
        <aside className="glass-card p-4">
          <h1 className="text-xl font-bold text-white">Painel</h1>
          <div className="mt-4 space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelected(page)}
                className="w-full rounded-xl bg-white/10 p-3 text-left text-sm text-white"
              >
                <p>{page.coupleName}</p>
                <p className="text-xs text-cream/70">{page.paymentStatus}</p>
              </button>
            ))}
          </div>
        </aside>
        <section className="glass-card p-5">
          {!selected ? (
            <p className="text-cream/80">Selecione uma página para gerenciar.</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white">{selected.coupleName}</h2>
              <p className="mt-1 text-sm text-cream/80">
                Link: {`${typeof window !== "undefined" ? window.location.origin : ""}/momento/${selected.slug}`}
              </p>
              <div className="mt-4 space-y-3">
                <textarea
                  value={selected.message}
                  onChange={(e) =>
                    setSelected((current) =>
                      current ? { ...current, message: e.target.value } : current
                    )
                  }
                  className="min-h-28 w-full rounded-xl bg-white/10 p-3 text-white"
                />
                <input
                  value={selected.musicUrl ?? ""}
                  onChange={(e) =>
                    setSelected((current) =>
                      current ? { ...current, musicUrl: e.target.value } : current
                    )
                  }
                  placeholder="URL da música"
                  className="w-full rounded-xl bg-white/10 p-3 text-white"
                />
                <button onClick={save} className="rounded-full bg-blush px-5 py-2 text-white">
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/momento/${selected.slug}`
                      )
                    }
                    className="rounded-full bg-white/10 px-5 py-2 text-sm text-white"
                  >
                    Copiar link
                  </button>
                  <a
                    href={`/api/qr/${selected.slug}`}
                    target="_blank"
                    className="rounded-full bg-white/10 px-5 py-2 text-sm text-white"
                  >
                    Baixar QR Code
                  </a>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
