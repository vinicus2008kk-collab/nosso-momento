import { KiwifyCheckoutClient } from "@/components/kiwify-checkout-client";
import { prisma } from "@/lib/prisma";const KIWIFY_CHECKOUTS = {
import { redirect } from "next/navigation";

const KIWIFY_CHECKOUTS = {
  CLASSIC: "https://pay.kiwify.com.br/gYLOU8o",
  PREMIUM: "https://pay.kiwify.com.br/Jg2HGut",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { pageId?: string };
}) {
  const pageId = searchParams.pageId;

  if (!pageId) redirect("/criar");

  const page = await prisma.romanticPage.findUnique({
    where: { id: pageId },
  });

  if (!page) redirect("/criar");

  const baseCheckoutUrl =
    page.plan === "PREMIUM" ? KIWIFY_CHECKOUTS.PREMIUM : KIWIFY_CHECKOUTS.CLASSIC;

  const checkoutUrl = new URL(baseCheckoutUrl);
  checkoutUrl.searchParams.set("s1", page.id);
  checkoutUrl.searchParams.set("src", page.id);
  checkoutUrl.searchParams.set("utm_source", "surpresadeamor");
  checkoutUrl.searchParams.set("utm_medium", "checkout");
  checkoutUrl.searchParams.set("utm_campaign", page.plan === "PREMIUM" ? "premium" : "classic");

  return (
    <KiwifyCheckoutClient
      pageId={page.id}
      plan={page.plan}
      checkoutUrl={checkoutUrl.toString()}
    />
  );
}