import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const KIWIFY_CHECKOUTS = {
  CLASSIC: "https://pay.kiwify.com.br/gBkA3ER",
  PREMIUM: "https://pay.kiwify.com.br/hfX4vfN",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { pageId?: string };
}) {
  const pageId = searchParams.pageId;

  if (!pageId) {
    redirect("/criar");
  }

  const page = await prisma.romanticPage.findUnique({
    where: { id: pageId },
  });

  if (!page) {
    redirect("/criar");
  }

  const baseCheckoutUrl =
    page.plan === "PREMIUM"
      ? KIWIFY_CHECKOUTS.PREMIUM
      : KIWIFY_CHECKOUTS.CLASSIC;

  const checkoutUrl = new URL(baseCheckoutUrl);

  checkoutUrl.searchParams.set("s1", page.id);
  checkoutUrl.searchParams.set("src", page.id);
  checkoutUrl.searchParams.set("utm_source", "surpresadeamor");
  checkoutUrl.searchParams.set("utm_medium", "checkout");
  checkoutUrl.searchParams.set("utm_campaign", page.plan === "PREMIUM" ? "premium" : "classic");

  redirect(checkoutUrl.toString());
}