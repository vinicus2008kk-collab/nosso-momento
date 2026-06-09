import { CheckoutClient } from "@/components/checkout-client";
import { isMercadoPagoConfigured } from "@/lib/mercado-pago-config";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { pageId?: string; status?: string };
}) {
  const pageId = searchParams.pageId ?? null;

  let plan = "CLASSIC";
  if (pageId) {
    const page = await prisma.romanticPage.findUnique({ where: { id: pageId } });
    plan = page?.plan ?? "CLASSIC";
  }

  return (
    <CheckoutClient
      testMode={!isMercadoPagoConfigured()}
      pageId={pageId}
      status={searchParams.status ?? null}
      plan={plan}
    />
  );
}
