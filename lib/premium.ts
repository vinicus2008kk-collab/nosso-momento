import { prisma } from "@/lib/prisma";

export async function approvePremiumPage(pageId: string) {
  const page = await prisma.romanticPage.findUnique({ where: { id: pageId } });
  if (!page) return null;

  await prisma.payment.updateMany({
    where: { romanticPageId: pageId },
    data: { status: "APPROVED" }
  });

  return prisma.romanticPage.update({
    where: { id: pageId },
    data: {
      isPremium: true,
      paymentStatus: "APPROVED",
      plan: "PREMIUM"
    }
  });
}
