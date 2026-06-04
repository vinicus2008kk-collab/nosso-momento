import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type MercadoPagoPayment = {
  id: number;
  status: "approved" | "pending" | "rejected" | string;
  external_reference?: string;
  transaction_amount?: number;
};

function mapStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = body?.data?.id;
    const eventType = body?.type;

    if (!paymentId || eventType !== "payment") {
      return NextResponse.json({ received: true });
    }

    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Token Mercado Pago ausente." }, { status: 500 });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao consultar pagamento." }, { status: 502 });
    }

    const payment = (await response.json()) as MercadoPagoPayment;
    const pageId = payment.external_reference;

    if (!pageId) return NextResponse.json({ received: true });

    const mappedStatus = mapStatus(payment.status);

    await prisma.payment.updateMany({
      where: { romanticPageId: pageId },
      data: {
        mercadoPagoPaymentId: String(payment.id),
        status: mappedStatus,
        amount: payment.transaction_amount ?? 0
      }
    });

    await prisma.romanticPage.update({
      where: { id: pageId },
      data: {
        paymentStatus: mappedStatus,
        isPremium: mappedStatus === "APPROVED",
        plan: mappedStatus === "APPROVED" ? "PREMIUM" : "FREE"
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar webhook.", details: String(error) },
      { status: 500 }
    );
  }
}
