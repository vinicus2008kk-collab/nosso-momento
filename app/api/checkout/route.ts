import { isMercadoPagoConfigured } from "@/lib/mercado-pago-config";
import { prisma } from "@/lib/prisma";
import { buildPublicUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PLAN_CONFIG: Record<string, { price: number; title: string }> = {
  CLASSIC: { price: 9.99, title: "Nosso Momento Clássico" },
  PREMIUM: { price: 19.99, title: "Nosso Momento Premium" },
};

export async function POST(request: Request) {
  try {
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        { error: "Pagamento online indisponível no momento." },
        { status: 503 }
      );
    }

    const { preferenceClient } = await import("@/lib/mercadoPago");
    const { pageId } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: "pageId obrigatório." }, { status: 400 });
    }

    const page = await prisma.romanticPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
    }

    const planKey = page.plan === "PREMIUM" ? "PREMIUM" : "CLASSIC";
    const { price, title } = PLAN_CONFIG[planKey];

    const appUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: page.id,
            title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: price,
          },
        ],

        external_reference: page.id,

        back_urls: {
          success: `${appUrl}/sucesso?pageId=${page.id}`,
          pending: `${appUrl}/checkout?pageId=${page.id}&status=pending`,
          failure: `${appUrl}/checkout?pageId=${page.id}&status=failed`,
        },

        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        auto_return: "approved",

        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 1,
        },
      },
    });

    await prisma.payment.create({
      data: {
        romanticPageId: page.id,
        status: "PENDING",
        amount: price,
      },
    });

    return NextResponse.json({
      initPoint: preference.init_point,
      publicUrl: buildPublicUrl(page.slug),
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}