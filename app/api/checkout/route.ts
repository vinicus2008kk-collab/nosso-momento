import { isMercadoPagoConfigured } from "@/lib/mercado-pago-config";
import { prisma } from "@/lib/prisma";
import { buildPublicUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PREMIUM_PRICE = 19.9;

export async function POST(request: Request) {
  try {
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        { error: "Pagamento online indisponível no momento. Use o modo teste para continuar." },
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const externalReference = page.id;

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: page.id,
            title: "Nosso Momento Premium",
            quantity: 1,
            currency_id: "BRL",
            unit_price: PREMIUM_PRICE,
          },
        ],
        external_reference: externalReference,
        back_urls: {
          success: `${appUrl}/sucesso?pageId=${page.id}`,
          pending: `${appUrl}/checkout?pageId=${page.id}&status=pending`,
          failure: `${appUrl}/checkout?pageId=${page.id}&status=failed`,
        },
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        auto_return: "approved",
      },
    });

    await prisma.payment.create({
      data: {
        romanticPageId: page.id,
        status: "PENDING",
        amount: PREMIUM_PRICE,
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