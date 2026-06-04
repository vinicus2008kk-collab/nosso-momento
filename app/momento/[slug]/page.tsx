import { HeartBackground } from "@/components/heart-background";
import { MusicPlayer } from "@/components/music-player";
import { PhotoCarousel } from "@/components/photo-carousel";
import { RelationshipTimer } from "@/components/relationship-timer";
import { SurpriseButton } from "@/components/surprise-button";
import { TypingLetter } from "@/components/typing-letter";
import { prisma } from "@/lib/prisma";
import { parsePageMedia } from "@/lib/romantic-page";
import { getYouTubeVideoId } from "@/lib/youtube";
import { notFound } from "next/navigation";

const themeStyles = {
  classic: {
    main: "romantic-gradient",
    card: "glass-card",
    title: "text-white",
    text: "text-cream/70"
  },
  wine: {
    main: "bg-gradient-to-br from-[#22020c] via-[#5a0f2b] to-[#120008]",
    card: "border border-white/15 bg-black/35 backdrop-blur-xl shadow-[0_0_45px_rgba(120,0,40,0.45)]",
    title: "text-white",
    text: "text-rose-100/75"
  },
  rose: {
    main: "bg-gradient-to-br from-[#ffb6d5] via-[#ff7eb6] to-[#7b2049]",
    card: "border border-white/35 bg-white/25 backdrop-blur-xl shadow-[0_0_45px_rgba(255,126,182,0.45)]",
    title: "text-white",
    text: "text-white/80"
  },
  night: {
    main: "bg-gradient-to-br from-[#030712] via-[#1e1b4b] to-[#000000]",
    card: "border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_0_45px_rgba(79,70,229,0.35)]",
    title: "text-white",
    text: "text-indigo-100/75"
  }
};

export default async function PublicMomentPage({
  params
}: {
  params: { slug: string };
}) {
  const page = await prisma.romanticPage.findUnique({
    where: { slug: params.slug }
  });

  if (!page) notFound();

  const selectedTheme =
    themeStyles[(page.theme ?? "classic") as keyof typeof themeStyles] ??
    themeStyles.classic;

  const media = parsePageMedia(page.photos);
  const youtubeVideoId = page.musicUrl ? getYouTubeVideoId(page.musicUrl) : null;
  const musicStartTime = page.musicStartTime ?? 0;

  return (
    <main className={`${selectedTheme.main} relative min-h-screen overflow-hidden px-4 py-10`}>
      {page.isPremium && <HeartBackground />}

      <div className="relative z-10 mx-auto max-w-2xl space-y-4">
        <header className={`${selectedTheme.card} p-5 text-center`}>
          <h1 className={`text-3xl font-bold ${selectedTheme.title}`}>
            {page.coupleName}
          </h1>

          {!page.isPremium && (
            <p className={`mt-2 text-xs ${selectedTheme.text}`}>
              Criado no Nosso Momento
            </p>
          )}
        </header>

        <div className={selectedTheme.card}>
          <TypingLetter text={page.message} />
        </div>

        <div className={selectedTheme.card}>
          <RelationshipTimer startDate={page.startDate.toISOString()} />
        </div>

        {media.length > 0 && (
          <section className={`${selectedTheme.card} p-4`}>
            <h2 className={`mb-3 text-lg font-semibold ${selectedTheme.title}`}>
              Nossas fotos e vídeos
            </h2>
            <PhotoCarousel media={media} premium={page.isPremium} />
          </section>
        )}

        {page.isPremium && youtubeVideoId && (
          <MusicPlayer videoId={youtubeVideoId} startSeconds={musicStartTime} />
        )}

        {page.isPremium && <SurpriseButton />}
      </div>
    </main>
  );
}