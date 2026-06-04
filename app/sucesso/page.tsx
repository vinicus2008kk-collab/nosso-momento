import { SuccessActions } from "@/components/success-actions";
import { prisma } from "@/lib/prisma";
import { buildPublicUrl } from "@/lib/utils";
import Image from "next/image";

export default async function SuccessPage({
  searchParams
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

  const publicUrl = buildPublicUrl(page.slug);
  const qrUrl = `/api/qr/${page.slug}`;

  return (
    <main className="romantic-gradient min-h-screen px-4 py-10">
      <div className="glass-card mx-auto max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-white">Sua surpresa está pronta!</h1>

        <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.15em] text-cream/60">Seu link exclusivo</p>
          <p className="mt-1 break-all text-base font-semibold text-white">{publicUrl}</p>
          <p className="mt-1 text-xs text-cream/50">slug: {page.slug}</p>
        </div>

        {page.paymentStatus !== "APPROVED" && (
          <p className="mt-2 rounded-lg bg-yellow-500/20 p-2 text-sm text-yellow-100">
            Pagamento {page.paymentStatus === "PENDING" ? "pendente" : "não aprovado"}.
            Recursos premium serão liberados após aprovação.
          </p>
        )}

        <div className="mt-6 w-fit rounded-xl bg-white p-3">
          <Image src={qrUrl} alt="QR Code da página" width={220} height={220} />
        </div>

        <SuccessActions publicUrl={publicUrl} slug={page.slug} />

        <p className="mt-6 text-sm text-cream/90">
          Mostre este QR Code para seu amor. Ao escanear, a pessoa verá sua surpresa
          romântica personalizada.
        </p>
      </div>
    </main>
  );
}
