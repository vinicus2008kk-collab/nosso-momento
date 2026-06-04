import { CheckoutClient } from "@/components/checkout-client";
import { isMercadoPagoConfigured } from "@/lib/mercado-pago-config";

export default function CheckoutPage({
  searchParams
}: {
  searchParams: { pageId?: string; status?: string };
}) {
  return (
    <CheckoutClient
      testMode={!isMercadoPagoConfigured()}
      pageId={searchParams.pageId ?? null}
      status={searchParams.status ?? null}
    />
  );
}
