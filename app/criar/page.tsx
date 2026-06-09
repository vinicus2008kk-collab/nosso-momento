"use client";

import { HeartBackground } from "@/components/heart-background";
import { MusicStartTimeFields } from "@/components/music-start-time-fields"
import { combineMusicStartTime, formatMusicStartTime } from "@/lib/music-start-time";
import { MAX_PHOTOS_FREE, inferMediaTypeFromUrl, isValidMediaUrl, type PageMediaItem } from "@/lib/romantic-page";
import { getYouTubeVideoId } from "@/lib/youtube";
import { uploadPhotosToStorage } from "@/lib/upload-photos-client";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "CLASSIC" | "PREMIUM";

const themePreviewConfig: Record<string, string> = {
  classic:    "from-[#190a21] via-[#2d1b4e] to-[#0d0b14]",
  wine:       "from-[#22020c] via-[#5a0f2b] to-[#120008]",
  rose:       "from-[#ffb6d5] via-[#ff7eb6] to-[#7b2049]",
  night:      "from-[#030712] via-[#1e1b4b] to-[#000000]",
  champagne:  "from-[#F8F1E8] via-[#FFFFFF] to-[#F0E8DC]",
};

const themeLabel: Record<string, string> = {
  classic:   "Clássico",
  wine:      "Vinho",
  rose:      "Rosa Dream",
  night:     "Noite Estrelada",
  champagne: "Champagne",
};

function generateSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<PageMediaItem[]>([]);
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [plan, setPlan] = useState<Plan>("CLASSIC");
  const [error, setError] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [importantMoments, setImportantMoments] = useState("");
  const [message, setMessage] = useState("");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [letterError, setLetterError] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicStartMinutes, setMusicStartMinutes] = useState(0);
  const [musicStartSeconds, setMusicStartSeconds] = useState(0);
  const [theme, setTheme] = useState("classic");
  const [slug, setSlug] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const [now, setNow] = useState(new Date());

  const musicStartTimeTotal = useMemo(
    () => combineMusicStartTime(musicStartMinutes, musicStartSeconds),
    [musicStartMinutes, musicStartSeconds]
  );

  const formattedMusicStart = useMemo(
    () => formatMusicStartTime(musicStartMinutes, musicStartSeconds),
    [musicStartMinutes, musicStartSeconds]
  );
  const validMedia = useMemo(() => mediaItems, [mediaItems]);
  const previewMedia = useMemo(() => {
    const fallbackMedia = [
      { type: "image" as const, url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=700&q=80" },
      { type: "image" as const, url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80" },
      { type: "image" as const, url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=700&q=80" }
    ];

    const media = validMedia.length ? validMedia : fallbackMedia;
    return plan === "CLASSIC" ? media.slice(0, MAX_PHOTOS_FREE) : media;
  }, [validMedia, plan]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (plan === "CLASSIC") {
      setMediaItems((current) => current.slice(0, MAX_PHOTOS_FREE));
    }
  }, [plan]);

  async function handleGalleryPick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setError("");
    setUploadingPhotos(true);

    try {
      const selected = plan === "CLASSIC" ? files.slice(0, MAX_PHOTOS_FREE) : files;
      const uploadPlan = plan === "PREMIUM" ? "PREMIUM" : "FREE";
      const items = await uploadPhotosToStorage(selected, uploadPlan);
      setMediaItems((current) => (plan === "CLASSIC" ? items : [...current, ...items]));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Não foi possível enviar as mídias. Tente novamente."
      );
    } finally {
      setUploadingPhotos(false);
    }
  }

  function removeMedia(index: number) {
    setMediaItems((current) => current.filter((_, mediaIndex) => mediaIndex !== index));
  }

  function addMediaUrl() {
    const url = mediaUrlInput.trim();
    if (!isValidMediaUrl(url)) {
      setError("Informe uma URL válida (https://... ou /uploads/...).");
      return;
    }

    const item: PageMediaItem = { type: inferMediaTypeFromUrl(url), url };

    setError("");
    setMediaItems((current) => {
      if (plan === "CLASSIC") return [item];
      if (current.some((entry) => entry.url === url)) return current;
      return [...current, item];
    });
    setMediaUrlInput("");
  }

  const canPickFromGallery = plan === "PREMIUM" || (plan === "CLASSIC" && mediaItems.length < MAX_PHOTOS_FREE);

  async function handleGenerateLetter() {
    setLetterError("");

    if (!creatorName.trim() || !partnerName.trim() || !coupleName.trim()) {
      setLetterError("Preencha seu nome, o nome da pessoa amada e o nome do casal antes de gerar.");
      return;
    }

    if (importantMoments.trim().length < 20) {
      setLetterError("Conte os momentos importantes com pelo menos 20 caracteres.");
      return;
    }

    setGeneratingLetter(true);

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName: creatorName.trim(),
          partnerName: partnerName.trim(),
          coupleName: coupleName.trim(),
          importantMoments: importantMoments.trim()
        })
      });

      const data = (await response.json()) as { letter?: string; error?: string };

      if (!response.ok || !data.letter) {
        setLetterError(
          data.error ?? "Não consegui gerar agora. Tente novamente ou escreva sua própria mensagem."
        );
        return;
      }

      setMessage(data.letter);
    } catch {
      setLetterError("Não consegui gerar agora. Tente novamente ou escreva sua própria mensagem.");
    } finally {
      setGeneratingLetter(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (uploadingPhotos) return;

    if (!creatorName.trim()) { setError("Informe o seu nome."); return; }
    if (!partnerName.trim()) { setError("Informe o nome da pessoa amada."); return; }
    if (!coupleName.trim()) { setError("Informe o nome do casal."); return; }
    if (!startDate.trim()) { setError("Informe a data de início do relacionamento."); return; }
    if (!message.trim()) { setError("Escreva uma mensagem romântica para a pessoa amada."); return; }
    if (!mediaItems.length) { setError("Adicione pelo menos uma foto ou vídeo do casal."); return; }
    if (plan === "PREMIUM" && musicUrl.trim() && !getYouTubeVideoId(musicUrl.trim())) {
      setError("Informe um link válido do YouTube.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      creatorName: formData.get("creatorName"),
      partnerName: formData.get("partnerName"),
      coupleName: formData.get("coupleName"),
      startDate: formData.get("startDate"),
      message: formData.get("message"),
      photos: mediaItems,
      musicUrl: plan === "PREMIUM" ? formData.get("musicUrl") || "" : "",
      musicStartTime: plan === "PREMIUM" ? musicStartTimeTotal : 0,
      theme: plan === "PREMIUM" ? formData.get("theme") : "classic",
      slug: formData.get("slug"),
      plan
    };

    const response = await fetch("/api/romantic-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Não foi possível criar sua surpresa.");
      return;
    }

    router.push(`/checkout?pageId=${data.id}`);
  }

  const startDateObj = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const loveMs = startDateObj ? Math.max(now.getTime() - startDateObj.getTime(), 0) : 0;
  const loveDays = Math.floor(loveMs / (1000 * 60 * 60 * 24));
  const loveYears = Math.floor(loveDays / 365);
  const loveMonths = Math.floor((loveDays % 365) / 30);
  const loveRemainderDays = loveDays % 30;

  const year = now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() > 12) ? now.getFullYear() + 1 : now.getFullYear();
  const valentinesDay = new Date(year, 5, 12, 0, 0, 0);
  const valentineMs = Math.max(valentinesDay.getTime() - now.getTime(), 0);
  const valentineDays = Math.floor(valentineMs / (1000 * 60 * 60 * 24));
  const valentineHours = Math.floor((valentineMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const inputStyle = { background: "#fff", color: "#1e0d0d", borderColor: "rgba(139,26,42,0.2)" };
  const labelStyle = { color: "#1e0d0d" };
  const cardStyle = { background: "rgba(139,26,42,0.03)", border: "1px solid rgba(139,26,42,0.1)" };
  const activeTheme = plan === "PREMIUM" ? theme : "classic";
  const isChampagne = activeTheme === "champagne";

  return (
    <main
      className="relative min-h-screen w-full max-w-full overflow-x-hidden px-4 pb-28 pt-6 md:pb-10"
      style={{ background: "linear-gradient(160deg,#fdf6ee 0%,#f8ede0 40%,#faf2e8 100%)" }}
    >
      <HeartBackground />
      <style>{`
        #create-form input,
        #create-form textarea,
        #create-form select {
          color: #1e0d0d !important;
          background-color: #fff !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }
        #create-form label > .relative {
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        #create-form input::placeholder,
        #create-form textarea::placeholder {
          color: #7a6a6a !important;
          opacity: 1;
        }
      `}</style>
      <div className="pointer-events-none absolute -left-32 -top-32 h-[38rem] w-[38rem] rounded-full opacity-20" style={{ background: "radial-gradient(circle,rgba(139,26,42,0.45),transparent 70%)", filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full opacity-10" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.4),transparent 70%)", filter: "blur(100px)" }} />

      <div
        className="relative mx-auto mb-4 grid w-full max-w-6xl gap-2 rounded-2xl p-3 text-center sm:grid-cols-3 sm:text-left"
        style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.09)", boxShadow: "0 4px 20px rgba(139,26,42,0.07)" }}
      >
        <p className="text-sm" style={{ color: "#5a3535" }}>⏳ Dia dos Namorados em <strong style={{ color: "#1e0d0d" }}>{valentineDays} dias</strong> e <strong style={{ color: "#1e0d0d" }}>{valentineHours}h</strong></p>
        <p className="text-sm" style={{ color: "#5a3535" }}>🔒 Checkout seguro e dados protegidos</p>
        <p className="text-sm" style={{ color: "#5a3535" }}>💘 Mais de 10.000 surpresas criadas</p>
      </div>

      <div className="relative mx-auto grid grid-cols-1 w-full max-w-6xl gap-4 md:grid-cols-[1.04fr_0.96fr]">
        <form
          id="create-form"
          onSubmit={onSubmit}
          className="rounded-3xl w-full min-w-0 overflow-x-hidden space-y-4 p-4 sm:p-6"
          style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.12)", boxShadow: "0 4px 24px rgba(139,26,42,0.08)" }}
        >
          <h1 className="text-center text-4xl font-black leading-tight md:text-left" style={{ color: "#1e0d0d" }}>
            Crie um momento que vira lembrança eterna
          </h1>

          <p className="text-center text-base md:text-left" style={{ color: "#5a3535" }}>
            Interface premium para você montar sua página romântica em poucos minutos.
          </p>

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Seu nome</span>
            <div className="relative">
              <span className="input-icon">👤</span>
              <input name="creatorName" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} required placeholder="Seu nome" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Pessoa amada</span>
            <div className="relative">
              <span className="input-icon">💖</span>
              <input name="partnerName" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} required placeholder="Nome da pessoa amada" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Nome do casal</span>
            <div className="relative">
              <span className="input-icon">✨</span>
              <input name="coupleName" value={coupleName} onChange={(e) => { setCoupleName(e.target.value); if (!slugEditedManually) setSlug(generateSlug(e.target.value)); }} required placeholder="Ex: Ana e Lucas" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Data de início</span>
            <div className="relative w-full max-w-full min-w-0 overflow-hidden">
              <span className="input-icon">📅</span>
              <input name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required type="date" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <div className="w-full max-w-full min-w-0 space-y-3 rounded-2xl p-4" style={cardStyle}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium" style={labelStyle}>
                Me conte momentos importantes de vocês dois
              </span>
              <div className="relative">
                <span className="input-icon">✨</span>
                <textarea
                  value={importantMoments}
                  onChange={(e) => setImportantMoments(e.target.value)}
                  maxLength={2000}
                  placeholder="Ex: nosso primeiro encontro foi no shopping, viajamos juntos para praia, ela me apoiou em um momento difícil, temos a música X como especial..."
                  className="input-modern input-with-icon min-h-24"
                  style={inputStyle}
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleGenerateLetter}
              disabled={generatingLetter}
              className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#8b1a2a,#6a1525)", border: "1px solid rgba(139,26,42,0.3)", boxShadow: "0 4px 16px rgba(139,26,42,0.2)" }}
            >
              {generatingLetter ? "Gerando carta..." : "Gerar carta com IA ✨"}
            </button>

            {letterError && <p className="text-sm" style={{ color: "#991b1b" }}>{letterError}</p>}

            <label className="block">
              <span className="mb-1 block text-sm font-medium" style={labelStyle}>Mensagem romântica</span>
              <div className="relative">
                <span className="input-icon">💌</span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Escreva algo inesquecível ou gere com IA acima..."
                  className="input-modern input-with-icon min-h-32"
                  style={inputStyle}
                />
              </div>
              <p className="mt-1 text-xs" style={{ color: "#7a4848" }}>
                Você pode editar a carta depois de gerar.
              </p>
            </label>
          </div>

          <div className="w-full max-w-full min-w-0 space-y-3 rounded-2xl p-4" style={cardStyle}>
            <p className="text-sm" style={{ color: "#3a2020" }}>
              Fotos e vídeos do casal ({validMedia.length}
              {plan === "CLASSIC" ? `/${MAX_PHOTOS_FREE}` : ""})
            </p>

            <label
              className={`flex w-full cursor-pointer items-center justify-center rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                canPickFromGallery && !uploadingPhotos
                  ? "hover:opacity-80"
                  : "cursor-not-allowed opacity-60"
              }`}
              style={
                canPickFromGallery && !uploadingPhotos
                  ? { background: "rgba(139,26,42,0.07)", border: "1px solid rgba(139,26,42,0.2)", color: "#8b1a2a" }
                  : { background: "rgba(139,26,42,0.03)", border: "1px solid rgba(139,26,42,0.1)", color: "#9b7070" }
              }
            >
              <span className="text-center">
                {uploadingPhotos
                  ? "Enviando mídias..."
                  : plan === "CLASSIC"
                    ? "📷 Escolher foto ou vídeo da galeria"
                    : "📷 Escolher fotos e vídeos da galeria"}
              </span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                multiple={plan === "PREMIUM"}
                disabled={!canPickFromGallery || uploadingPhotos}
                onChange={handleGalleryPick}
                className="hidden"
              />
            </label>

            {plan === "PREMIUM" && (
              <p className="text-xs" style={{ color: "#7a4848" }}>
                No celular, você pode selecionar várias fotos e vídeos de uma vez na galeria.
              </p>
            )}

            {mediaItems.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {mediaItems.map((item, index) => (
                  <div key={`${item.url}-${index}`} className="relative overflow-hidden rounded-xl" style={{ border: "1px solid rgba(139,26,42,0.15)" }}>
                    {item.type === "video" ? (
                      <video src={item.url} className="h-28 w-full object-cover" muted playsInline preload="metadata" />
                    ) : (
                      <img src={item.url} alt={`Mídia ${index + 1}`} className="h-28 w-full object-cover" />
                    )}
                    {item.type === "video" && (
                      <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                        Vídeo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <span className="input-icon">🔗</span>
                <input
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="Ou cole uma URL de imagem ou vídeo (https://)"
                  className="input-modern input-with-icon"
                  style={inputStyle}
                />
              </div>
              <button
                type="button"
                onClick={addMediaUrl}
                disabled={uploadingPhotos}
                className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-60"
                style={{ border: "1px solid rgba(139,26,42,0.25)", background: "rgba(139,26,42,0.06)", color: "#8b1a2a" }}
              >
                Adicionar URL
              </button>
            </div>
          </div>

          {plan === "PREMIUM" && (
            <>
          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Link da música no YouTube</span>
            <div className="relative">
              <span className="input-icon">🎵</span>
              <input name="musicUrl" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <MusicStartTimeFields
            minutes={musicStartMinutes}
            seconds={musicStartSeconds}
            onMinutesChange={setMusicStartMinutes}
            onSecondsChange={setMusicStartSeconds}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Tema visual</span>
            <div className="relative">
              <span className="input-icon">🎨</span>
              <select name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="input-modern input-with-icon" style={inputStyle}>
                <option value="classic">Clássico</option>
                <option value="wine">Vinho</option>
                <option value="rose">Rosa Dream</option>
                <option value="night">Noite Estrelada</option>
                <option value="champagne">Champagne</option>
              </select>
              <div
                className={`mt-3 rounded-2xl p-4 text-center bg-gradient-to-br transition-all duration-500 ${themePreviewConfig[activeTheme] ?? themePreviewConfig.classic}`}
                style={theme === "champagne"
                  ? { border: "1px solid rgba(139,26,42,0.12)", boxShadow: "0 4px 16px rgba(139,26,42,0.07)" }
                  : { border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: theme === "champagne" ? "#6b4040" : "rgba(255,255,255,0.8)" }}>
                  Preview do tema
                </p>
                <p className="mt-1 text-xl font-bold" style={{ color: theme === "champagne" ? "#1e0d0d" : "#ffffff" }}>
                  {themeLabel[activeTheme] ?? "Clássico"}
                </p>
                <p className="mt-1 text-sm" style={{ color: theme === "champagne" ? "#6b4040" : "rgba(255,255,255,0.8)" }}>
                  Assim ficará a aparência principal da surpresa.
                </p>
              </div>
            </div>
          </label>

            </>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-medium" style={labelStyle}>Slug personalizado</span>
            <div className="relative">
              <span className="input-icon">🔗</span>
              <input name="slug" value={slug} onChange={(e) => { setSlugEditedManually(true); setSlug(e.target.value); }} required placeholder="ana-e-lucas" className="input-modern input-with-icon" style={inputStyle} />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlan("CLASSIC")}
              className="rounded-2xl p-3 text-base font-semibold transition"
              style={
                plan === "CLASSIC"
                  ? { background: "linear-gradient(135deg,#8b1a2a,#6a1525)", color: "#fff", border: "1px solid rgba(139,26,42,0.4)", boxShadow: "0 4px 16px rgba(139,26,42,0.2)" }
                  : { background: "rgba(139,26,42,0.05)", color: "#8b1a2a", border: "1px solid rgba(139,26,42,0.2)" }
              }
            >
              Clássico
            </button>

            <button
              type="button"
              onClick={() => setPlan("PREMIUM")}
              className="rounded-2xl p-3 text-base font-semibold transition"
              style={
                plan === "PREMIUM"
                  ? { background: "linear-gradient(135deg,#8b1a2a,#6a1525)", color: "#fff", border: "1px solid rgba(139,26,42,0.4)", boxShadow: "0 4px 16px rgba(139,26,42,0.2)" }
                  : { background: "rgba(139,26,42,0.05)", color: "#8b1a2a", border: "1px solid rgba(139,26,42,0.2)" }
              }
            >
               Premium
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl px-4 py-3" style={{ border: "1px solid rgba(220,38,38,0.35)", background: "rgba(220,38,38,0.07)" }}>
              <span className="mt-0.5 shrink-0">⚠️</span>
              <p className="text-sm font-medium" style={{ color: "#991b1b" }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploadingPhotos}
            className="hidden w-full items-center justify-center rounded-full py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:opacity-70 md:inline-flex"
            style={{ background: "linear-gradient(135deg,#8b1a2a,#6a1525)", border: "1px solid rgba(139,26,42,0.35)", boxShadow: "0 8px 32px rgba(139,26,42,0.25)" }}
          >
            {loading ? "Criando..." : uploadingPhotos ? "Aguarde o envio das mídias..." : "Continuar"}
          </button>
        </form>

        <aside
          className="rounded-3xl h-fit p-4 sm:p-5 md:sticky md:top-6"
          style={{ background: "#ffffff", border: "1px solid rgba(139,26,42,0.12)", boxShadow: "0 4px 24px rgba(139,26,42,0.08)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "#6b4040" }}>Preview ao vivo</p>
            <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(139,26,42,0.08)", color: "#8b1a2a" }}>
              {themeLabel[activeTheme] ?? "Clássico"}
            </span>
          </div>
          <p className="mt-1 text-sm" style={{ color: "#5a3535" }}>Atualiza automaticamente enquanto voce digita.</p>

          <div className="mt-3 flex justify-center">
            <div className="phone-mockup iphone-shell w-full max-w-[22rem]">
              <div className="phone-notch" />

              <div className={`phone-mockup-screen iphone-screen relative overflow-hidden bg-gradient-to-br transition-all duration-500 ${themePreviewConfig[activeTheme] ?? themePreviewConfig.classic}`}>
                <div className="screen-reflection" />

                <div className="relative z-10 space-y-3">
                  {/* Card casal */}
                  <div
                    className="rounded-2xl p-3 backdrop-blur-md"
                    style={isChampagne
                      ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                      : { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: isChampagne ? "#8b1a2a" : "rgba(255,235,215,0.8)" }}>Nosso Momento</p>
                    <h2 className="mt-1 text-2xl font-black" style={{ color: isChampagne ? "#1e0d0d" : "#ffffff" }}>{coupleName || "Seu casal aqui"}</h2>
                    <p className="mt-1 text-xs" style={{ color: isChampagne ? "#6b4040" : "rgba(255,235,215,0.85)" }}>
                      {creatorName || "Voce"} + {partnerName || "Amor"}
                    </p>
                  </div>

                  {/* Galeria */}
                  <div className="grid grid-cols-3 gap-2">
                    {previewMedia.map((item, index) =>
                      item.type === "video" ? (
                        <div key={index} className="relative h-16 w-full overflow-hidden rounded-xl" style={{ border: `1px solid ${isChampagne ? "rgba(139,26,42,0.14)" : "rgba(255,255,255,0.25)"}` }}>
                          <video src={item.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-xs text-white">
                            ▶
                          </span>
                        </div>
                      ) : (
                        <img
                          key={index}
                          src={item.url}
                          alt={`Mídia do casal ${index + 1}`}
                          className="h-16 w-full rounded-xl object-cover"
                          style={{ border: `1px solid ${isChampagne ? "rgba(139,26,42,0.14)" : "rgba(255,255,255,0.25)"}` }}
                        />
                      )
                    )}
                  </div>

                  {/* Contador */}
                  <div
                    className="rounded-2xl p-3"
                    style={isChampagne
                      ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                      : { background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <p className="text-xs" style={{ color: isChampagne ? "#8b1a2a" : "rgba(255,235,215,0.8)" }}>Tempo juntos</p>
                    <p className="text-lg font-bold" style={{ color: isChampagne ? "#1e0d0d" : "#ffffff" }}>
                      {startDateObj ? `${loveYears} anos, ${loveMonths} meses e ${loveRemainderDays} dias` : "Defina a data para ativar o contador"}
                    </p>
                  </div>

                  {/* Mensagem */}
                  <div
                    className="rounded-2xl p-3"
                    style={isChampagne
                      ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                      : { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <p className="line-clamp-3 text-sm" style={{ color: isChampagne ? "#6b4040" : "rgba(255,235,215,0.95)" }}>
                      {message || "Sua mensagem romântica aparecerá aqui em tempo real."}
                    </p>
                  </div>

                  {plan === "PREMIUM" && (
                    <>
                  {/* Música + QR */}
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div
                      className="rounded-2xl p-3"
                      style={isChampagne
                        ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                        : { background: "linear-gradient(135deg,#6a234b,#4a1f4f)", border: "1px solid rgba(255,255,255,0.25)" }}
                    >
                      <p className="text-xs" style={{ color: isChampagne ? "#8b1a2a" : "rgba(255,255,255,0.85)" }}>Música</p>
                      <p className="truncate text-sm font-semibold" style={{ color: isChampagne ? "#1e0d0d" : "#ffffff" }}>
                        {musicUrl
                          ? musicStartTimeTotal > 0
                            ? `YouTube · começa em ${formattedMusicStart}`
                            : "YouTube · do começo"
                          : "Toque para reproduzir"}
                      </p>
                      <div className="mt-2 flex items-end gap-1">
                        {[12, 20, 14, 24, 10, 18].map((h, i) => (
                          <span
                            key={i}
                            className="w-1.5 rounded-full animate-pulse"
                            style={{ height: `${h}px`, animationDelay: `${i * 0.1}s`, background: isChampagne ? "#8b1a2a" : "rgba(255,255,255,0.9)" }}
                          />
                        ))}
                      </div>
                    </div>

                    <div
                      className="rounded-2xl p-2"
                      style={isChampagne
                        ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                        : { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
                    >
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=116x116&data=${encodeURIComponent(`https://nossomomento.com.br/momento/${slug || "seu-slug"}`)}`} alt="QR Code do momento" className="h-[4.5rem] w-[4.5rem] rounded-lg" />
                    </div>
                  </div>

                    </>
                  )}

                  {/* Link final */}
                  <div
                    className="rounded-2xl p-3"
                    style={isChampagne
                      ? { background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,26,42,0.14)" }
                      : { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <p className="text-[11px]" style={{ color: isChampagne ? "#8b1a2a" : "rgba(255,235,215,0.8)" }}>Link final</p>
                    <p className="truncate text-sm font-semibold" style={{ color: isChampagne ? "#1e0d0d" : "#ffffff" }}>
                      nossomomento.com.br/momento/{slug || "seu-slug"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-3 left-0 right-0 z-30 px-4 md:hidden">
        {error && (
          <div className="mb-2 flex items-start gap-2 rounded-xl px-4 py-3" style={{ border: "1px solid rgba(220,38,38,0.35)", background: "rgba(220,38,38,0.07)" }}>
            <span className="mt-0.5 shrink-0">⚠️</span>
            <p className="text-sm font-medium" style={{ color: "#991b1b" }}>{error}</p>
          </div>
        )}
        <button
          form="create-form"
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#8b1a2a,#6a1525)", border: "1px solid rgba(139,26,42,0.35)", boxShadow: "0 8px 32px rgba(139,26,42,0.25)" }}
          disabled={loading || uploadingPhotos}
        >
          {loading ? "Criando..." : uploadingPhotos ? "Enviando mídias..." : "Continuar"}
        </button>
      </div>
    </main>
  );
}
