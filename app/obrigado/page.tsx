import { redirect } from "next/navigation";

export default function ObrigadoPage({
  searchParams,
}: {
  searchParams: { s1?: string; src?: string; pageId?: string };
}) {
  const pageId = searchParams.s1 || searchParams.src || searchParams.pageId;

  if (!pageId) {
    return (
      <main className="romantic-gradient flex min-h-screen items-center justify-center px-4">
        <div className="glass-card mx-auto max-w-lg p-6 text-center">
          <p className="text-4xl">💝</p>
          <h1 className="mt-3 text-2xl font-bold text-white">
            Pagamento recebido
          </h1>
          <p className="mt-2 text-sm text-cream/80">
            Não conseguimos identificar automaticamente sua surpresa.
            Verifique seu e-mail ou WhatsApp informado na compra.
          </p>
        </div>
      </main>
    );
  }

  redirect(`/sucesso?pageId=${pageId}`);
}