import { SuccessDelivery } from "@/components/success-delivery";
import { prisma } from "@/lib/prisma";
import { buildPublicUrl } from "@/lib/utils";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { pageId?: string };
}) {
  const pageId = searchParams.pageId;

  if (!pageId) {
    return (
      <main className="romantic-gradient flex min-h-screen items-center justify-center px-4">
        <p className="text-white">Página não encontrada.</p>
      </main>
    );
  }

  const page = await prisma.romanticPage.findUnique({ where: { id: pageId } });

  if (!page) {
    return (
      <main className="romantic-gradient flex min-h-screen items-center justify-center px-4">
        <p className="text-white">Página não encontrada.</p>
      </main>
    );
  }

  const surpriseUrl = buildPublicUrl(page.slug);

  if (page.paymentStatus !== "APPROVED") {
    return (
      <main className="romantic-gradient flex min-h-screen items-center justify-center px-4">
        <div className="glass-card mx-auto w-full max-w-lg p-6 text-center">
          <p className="text-4xl">⏳</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Aguardando confirmação</h1>
          <p className="mt-2 text-sm text-cream/80">
            Seu pagamento está sendo processado. Esta página atualiza automaticamente após a
            confirmação do pagamento.
          </p>
          <meta httpEquiv="refresh" content="5" />
        </div>
      </main>
    );
  }

  return (
    <main className="romantic-gradient min-h-screen px-4 py-10">
      <div className="glass-card mx-auto max-w-lg p-6">
        <div className="text-center">
          <p className="text-5xl">💝</p>
          <h1 className="mt-3 text-2xl font-bold text-white">
            Pagamento aprovado!
          </h1>
          <p className="mt-2 text-base text-cream/90">
            Como você quer receber sua surpresa?
          </p>
        </div>

        <SuccessDelivery pageId={pageId} surpriseUrl={surpriseUrl} />
        {process.env.NODE_ENV !== "production" && (
  <form
    action={async () => {
      "use server";

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
    }}
  >
    <button
      type="submit"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-yellow-500 px-4 py-2 text-xs font-bold text-black shadow-lg"
    >
      🛠 Simular pagamento aprovado
    </button>
  </form>
)}
      </div>
    </main>
  );
}
