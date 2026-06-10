import { PaymentStatusWatcher } from "@/components/payment-status-watcher";
import { SuccessDelivery } from "@/components/success-delivery";
import { prisma } from "@/lib/prisma";
import { buildPublicUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const page = await prisma.romanticPage.findUnique({
    where: { id: pageId },
  });

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
        <PaymentStatusWatcher />

        <div className="glass-card mx-auto w-full max-w-lg rounded-3xl p-8 text-center">
          <p className="text-5xl">⏳</p>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Aguardando confirmação
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-cream/80">
            Seu pagamento está sendo processado. Assim que a Kiwify confirmar,
            esta tela mudará automaticamente para sua surpresa.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          </div>

          <p className="mt-4 text-xs text-cream/50">
            Não precisa atualizar a página.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="romantic-gradient min-h-screen px-4 py-10">
      <div className="glass-card mx-auto max-w-lg rounded-3xl p-6">
        <div className="text-center">
          <p className="text-5xl">💝</p>

          <p className="mt-4 text-sm font-semibold text-pink-300">
            Pagamento aprovado!
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Sua surpresa está pronta!
          </h1>

          <p className="mt-2 text-sm text-cream/80">
            Agora você pode copiar o link, baixar o QR Code ou receber por
            WhatsApp/e-mail.
          </p>
        </div>

        <SuccessDelivery pageId={pageId} surpriseUrl={surpriseUrl} />
      </div>
    </main>
  );
}