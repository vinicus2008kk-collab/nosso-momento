import { redirect } from "next/navigation";

export default function ObrigadoPage({
  searchParams,
}: {
  searchParams: {
    s1?: string;
    src?: string;
    pageId?: string;
  };
}) {
  const pageId =
    searchParams.s1 ||
    searchParams.src ||
    searchParams.pageId ||
    null;

  if (pageId) {
    redirect(`/sucesso?pageId=${pageId}`);
  }

  return (
    <main className="romantic-gradient flex min-h-screen items-center justify-center px-4">
      <div className="glass-card mx-auto w-full max-w-lg rounded-3xl p-8 text-center">
        <div className="text-6xl">💝</div>

        <h1 className="mt-4 text-3xl font-bold text-white">
          Pagamento recebido!
        </h1>

        <p className="mt-3 text-base text-cream/80">
          Estamos preparando sua surpresa.
        </p>

        <p className="mt-2 text-sm text-cream/60">
          Você será direcionado automaticamente em alguns instantes.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </div>

        <div className="mt-8">
          <a
            href="/criar"
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}