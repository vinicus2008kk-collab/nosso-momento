"use client";

import { HeartBackground } from "@/components/heart-background";
import { MusicStartTimeFields } from "@/components/music-start-time-fields";
import { PrimaryButton } from "@/components/ui";
import { combineMusicStartTime, formatMusicStartTime } from "@/lib/music-start-time";
import { MAX_PHOTOS_FREE, inferMediaTypeFromUrl, isValidMediaUrl, type PageMediaItem } from "@/lib/romantic-page";
import { getYouTubeVideoId } from "@/lib/youtube";
import { uploadPhotosToStorage } from "@/lib/upload-photos-client";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "FREE" | "PREMIUM";

const themePreviewConfig: Record<string, string> = {
  classic: "from-[#190a21] via-[#2d1b4e] to-[#0d0b14]",
  wine:    "from-[#22020c] via-[#5a0f2b] to-[#120008]",
  rose:    "from-[#ffb6d5] via-[#ff7eb6] to-[#7b2049]",
  night:   "from-[#030712] via-[#1e1b4b] to-[#000000]",
};

const themeLabel: Record<string, string> = {
  classic: "Clássico",
  wine: "Vinho",
  rose: "Rosa Dream",
  night: "Noite Estrelada",
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
  const [plan, setPlan] = useState<Plan>("FREE");
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
  const previewMedia = useMemo(
    () =>
      validMedia.length
        ? validMedia
        : [
            { type: "image" as const, url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=700&q=80" },
            { type: "image" as const, url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80" },
            { type: "image" as const, url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=700&q=80" }
          ],
    [validMedia]
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (plan === "FREE") {
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
      const selected = plan === "FREE" ? files.slice(0, MAX_PHOTOS_FREE) : files;
      const items = await uploadPhotosToStorage(selected, plan);
      setMediaItems((current) => (plan === "FREE" ? items : [...current, ...items]));
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
      if (plan === "FREE") return [item];
      if (current.some((entry) => entry.url === url)) return current;
      return [...current, item];
    });
    setMediaUrlInput("");
  }

  const canPickFromGallery = plan === "PREMIUM" || mediaItems.length < MAX_PHOTOS_FREE;

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
    if (musicUrl.trim() && !getYouTubeVideoId(musicUrl.trim())) {
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
      musicUrl: formData.get("musicUrl") || "",
      musicStartTime: musicStartTimeTotal,
      theme: formData.get("theme"),
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

    if (plan === "PREMIUM") {
      router.push(`/checkout?pageId=${data.id}`);
      return;
    }

    router.push(`/sucesso?pageId=${data.id}`);
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

  return (
    <main className="romantic-gradient relative min-h-screen overflow-hidden px-4 pb-28 pt-6 md:pb-10">
      <HeartBackground />
      <div className="romantic-glow romantic-glow-left" />
      <div className="romantic-glow romantic-glow-right" />

      <div className="relative mx-auto mb-4 grid w-full max-w-6xl gap-2 rounded-2xl border border-white/20 bg-black/20 p-3 text-center text-cream/90 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:grid-cols-3 sm:text-left">
        <p className="text-sm">⏳ Dia dos Namorados em <strong className="text-white">{valentineDays} dias</strong> e <strong className="text-white">{valentineHours}h</strong></p>
        <p className="text-sm">🔒 Checkout seguro e dados protegidos</p>
        <p className="text-sm">💘 Mais de 10.000 surpresas criadas</p>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-[1.04fr_0.96fr]">
        <form id="create-form" onSubmit={onSubmit} className="glass-card form-shell space-y-4 p-4 sm:p-6">
          <h1 className="text-center text-4xl font-black leading-tight text-white md:text-left">
            Crie um momento que vira lembrança eterna
          </h1>

          <p className="text-center text-base text-cream/85 md:text-left">
            Interface premium para você montar sua página romântica em poucos minutos.
          </p>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Seu nome</span>
            <div className="relative">
              <span className="input-icon">👤</span>
              <input name="creatorName" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} required placeholder="Seu nome" className="input-modern input-with-icon" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Pessoa amada</span>
            <div className="relative">
              <span className="input-icon">💖</span>
              <input name="partnerName" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} required placeholder="Nome da pessoa amada" className="input-modern input-with-icon" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Nome do casal</span>
            <div className="relative">
              <span className="input-icon">✨</span>
              <input name="coupleName" value={coupleName} onChange={(e) => { setCoupleName(e.target.value); if (!slugEditedManually) setSlug(generateSlug(e.target.value)); }} required placeholder="Ex: Ana e Lucas" className="input-modern input-with-icon" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Data de início</span>
            <div className="relative">
              <span className="input-icon">📅</span>
              <input name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required type="date" className="input-modern input-with-icon" />
            </div>
          </label>

          <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-cream/90">
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
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleGenerateLetter}
              disabled={generatingLetter}
              className="w-full rounded-full border border-[#d4af37]/45 bg-gradient-to-r from-[#7b2049] via-[#5a1f58] to-[#2a152b] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(212,175,55,0.2)] transition hover:brightness-110 disabled:opacity-60"
            >
              {generatingLetter ? "Gerando carta..." : "Gerar carta com IA ✨"}
            </button>

            {letterError && <p className="text-sm text-red-300">{letterError}</p>}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-cream/90">Mensagem romântica</span>
              <div className="relative">
                <span className="input-icon">💌</span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Escreva algo inesquecível ou gere com IA acima..."
                  className="input-modern input-with-icon min-h-32"
                />
              </div>
              <p className="mt-1 text-xs text-cream/60">
                Você pode editar a carta depois de gerar.
              </p>
            </label>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-sm text-cream/90">
              Fotos e vídeos do casal ({validMedia.length}
              {plan === "FREE" ? `/${MAX_PHOTOS_FREE}` : ""})
            </p>

            <label
              className={`flex w-full cursor-pointer items-center justify-center rounded-xl border px-4 py-4 text-sm font-semibold text-cream transition ${
                canPickFromGallery && !uploadingPhotos
                  ? "border-[#d4af37]/40 bg-[#d4af37]/10 hover:bg-[#d4af37]/20"
                  : "cursor-not-allowed border-white/15 bg-white/5 opacity-60"
              }`}
            >
              <span className="text-center">
                {uploadingPhotos
                  ? "Enviando mídias..."
                  : plan === "FREE"
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
              <p className="text-xs text-cream/65">
                No celular, você pode selecionar várias fotos e vídeos de uma vez na galeria.
              </p>
            )}

            {mediaItems.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {mediaItems.map((item, index) => (
                  <div key={`${item.url}-${index}`} className="relative overflow-hidden rounded-xl border border-white/15">
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
                />
              </div>
              <button
                type="button"
                onClick={addMediaUrl}
                disabled={uploadingPhotos}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-cream transition hover:bg-white/20 disabled:opacity-60"
              >
                Adicionar URL
              </button>
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Link da música no YouTube</span>
            <div className="relative">
              <span className="input-icon">🎵</span>
              <input name="musicUrl" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="input-modern input-with-icon" />
            </div>
          </label>

          <MusicStartTimeFields
            minutes={musicStartMinutes}
            seconds={musicStartSeconds}
            onMinutesChange={setMusicStartMinutes}
            onSecondsChange={setMusicStartSeconds}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Tema visual</span>
            <div className="relative">
              <span className="input-icon">🎨</span>
              <select name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="input-modern input-with-icon bg-[#2b2030] text-white">
                <option className="bg-white text-black" value="classic">Clássico</option>
                <option className="bg-white text-black" value="wine">Vinho</option>
                <option className="bg-white text-black" value="rose">Rosa Dream</option>
                <option className="bg-white text-black" value="night">Noite Estrelada</option>
              </select>
              <div className={`mt-3 rounded-2xl border border-white/25 p-4 text-center bg-gradient-to-br transition-all duration-500 ${themePreviewConfig[theme] ?? themePreviewConfig.classic}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                  Preview do tema
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {themeLabel[theme] ?? "Clássico"}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Assim ficará a aparência principal da surpresa.
                </p>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-cream/90">Slug personalizado</span>
            <div className="relative">
              <span className="input-icon">🔗</span>
              <input name="slug" value={slug} onChange={(e) => { setSlugEditedManually(true); setSlug(e.target.value); }} required placeholder="ana-e-lucas" className="input-modern input-with-icon" />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setPlan("FREE")} className={`rounded-2xl p-3 text-base font-semibold transition ${plan === "FREE" ? "bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] text-white shadow-[0_0_24px_rgba(212,175,55,0.2)] border border-[#d4af37]/35" : "bg-white/10 text-cream hover:bg-white/20"}`}>
              Plano Grátis
            </button>

            <button type="button" onClick={() => setPlan("PREMIUM")} className={`rounded-2xl p-3 text-base font-semibold transition ${plan === "PREMIUM" ? "bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] text-white shadow-[0_0_24px_rgba(212,175,55,0.2)] border border-[#d4af37]/35" : "bg-white/10 text-cream hover:bg-white/20"}`}>
              Plano Premium
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-500/20 px-4 py-3">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <p className="text-sm font-medium text-white">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploadingPhotos}
            className="hidden w-full items-center justify-center rounded-full border border-[#d4af37]/45 bg-gradient-to-r from-[#7b2049] via-[#5a1f58] to-[#2a152b] py-4 text-lg font-semibold text-white shadow-[0_0_35px_rgba(212,175,55,0.3)] transition hover:brightness-110 disabled:opacity-70 md:inline-flex"
          >
            {loading ? "Criando..." : uploadingPhotos ? "Aguarde o envio das mídias..." : "Continuar"}
          </button>
        </form>

        <aside className="glass-card form-shell h-fit p-4 sm:p-5 md:sticky md:top-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/70">Preview ao vivo</p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-cream/80">
              {themeLabel[theme] ?? "Clássico"}
            </span>
          </div>
          <p className="mt-1 text-sm text-cream/85">Atualiza automaticamente enquanto voce digita.</p>

          <div className="mt-3 flex justify-center">
            <div className="phone-mockup iphone-shell w-full max-w-[22rem]">
              <div className="phone-notch" />

              <div className={`phone-mockup-screen iphone-screen relative overflow-hidden bg-gradient-to-br transition-all duration-500 ${themePreviewConfig[theme] ?? themePreviewConfig.classic}`}>
                <div className="screen-reflection" />

                <div className="relative z-10 space-y-3">
                  <div className="rounded-2xl border border-white/25 bg-white/10 p-3 backdrop-blur-md">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-cream/80">Nosso Momento</p>
                    <h2 className="mt-1 text-2xl font-black text-white">{coupleName || "Seu casal aqui"}</h2>
                    <p className="mt-1 text-xs text-cream/85">
                      {creatorName || "Voce"} + {partnerName || "Amor"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {previewMedia.map((item, index) =>
                      item.type === "video" ? (
                        <div key={index} className="relative h-16 w-full overflow-hidden rounded-xl border border-white/25">
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
                          className="h-16 w-full rounded-xl border border-white/25 object-cover"
                        />
                      )
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-black/25 p-3">
                    <p className="text-xs text-cream/80">Tempo juntos</p>
                    <p className="text-lg font-bold text-white">
                      {startDateObj ? `${loveYears} anos, ${loveMonths} meses e ${loveRemainderDays} dias` : "Defina a data para ativar o contador"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-white/10 p-3">
                    <p className="line-clamp-3 text-sm text-cream/95">
                      {message || "Sua mensagem romântica aparecerá aqui em tempo real."}
                    </p>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="rounded-2xl border border-white/25 bg-gradient-to-r from-[#6a234b] to-[#4a1f4f] p-3">
                      <p className="text-xs text-white/85">Música</p>
                      <p className="truncate text-sm font-semibold text-white">
                        {musicUrl
                          ? musicStartTimeTotal > 0
                            ? `YouTube · começa em ${formattedMusicStart}`
                            : "YouTube · do começo"
                          : "Toque para reproduzir"}
                      </p>

                      <div className="mt-2 flex items-end gap-1">
                        {[12, 20, 14, 24, 10, 18].map((h, i) => (
                          <span key={i} className="w-1.5 rounded-full bg-white/90 animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/25 bg-white/15 p-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=116x116&data=${encodeURIComponent(`https://nossomomento.com.br/momento/${slug || "seu-slug"}`)}`} alt="QR Code do momento" className="h-[4.5rem] w-[4.5rem] rounded-lg" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-black/20 p-3">
                    <p className="text-[11px] text-cream/80">Link final</p>
                    <p className="truncate text-sm font-semibold text-white">
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
          <div className="mb-2 flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-500/20 px-4 py-3">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <p className="text-sm font-medium text-white">{error}</p>
          </div>
        )}
        <button
          form="create-form"
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full border border-[#d4af37]/45 bg-gradient-to-r from-[#7b2049] via-[#5a1f58] to-[#2a152b] py-4 text-lg font-semibold text-white shadow-[0_0_35px_rgba(212,175,55,0.3)] transition hover:brightness-110 disabled:opacity-70"
          disabled={loading || uploadingPhotos}
        >
          {loading ? "Criando..." : uploadingPhotos ? "Enviando mídias..." : "Continuar"}
        </button>
      </div>
    </main>
  );
}