import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type KiwifyPayload = {
  event?: string;
  event_type?: string;
  webhook_event_type?: string;
  type?: string;
  status?: string;

  s1?: string;
  s2?: string;
  s3?: string;
  src?: string;

  pageId?: string;
  page_id?: string;

  metadata?: {
    pageId?: string;
    page_id?: string;
    s1?: string;
    src?: string;
  };

  checkout_data?: {
    pageId?: string;
    page_id?: string;
    s1?: string;
    src?: string;
  };

  tracking?: {
    s1?: string;
    src?: string;
  };

  order?: {
    pageId?: string;
    product_name?: string;
    customer_email?: string;
    s1?: string;
    src?: string;
  };

  data?: {
    pageId?: string;
    page_id?: string;
    product_name?: string;
    customer_email?: string;
    s1?: string;
    src?: string;
  };

  Product?: {
    product_name?: string;
  };

  product?: {
    name?: string;
  };

  product_name?: string;
};

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getEventName(body: KiwifyPayload) {
  return normalizeText(
    body.event ||
      body.event_type ||
      body.webhook_event_type ||
      body.type ||
      body.status
  );
}

function getProductName(body: KiwifyPayload) {
  return normalizeText(
    body.Product?.product_name ||
      body.product?.name ||
      body.product_name ||
      body.order?.product_name ||
      body.data?.product_name
  );
}

function getPageId(body: KiwifyPayload) {
  return (
    body.s1 ||
    body.src ||
    body.pageId ||
    body.page_id ||
    body.metadata?.s1 ||
    body.metadata?.src ||
    body.metadata?.pageId ||
    body.metadata?.page_id ||
    body.checkout_data?.s1 ||
    body.checkout_data?.src ||
    body.checkout_data?.pageId ||
    body.checkout_data?.page_id ||
    body.tracking?.s1 ||
    body.tracking?.src ||
    body.order?.s1 ||
    body.order?.src ||
    body.order?.pageId ||
    body.data?.s1 ||
    body.data?.src ||
    body.data?.pageId ||
    body.data?.page_id ||
    null
  );
}

function isApprovedEvent(body: KiwifyPayload) {
  const eventName = getEventName(body);

  return (
    eventName.includes("compra aprovada") ||
    eventName.includes("purchase_approved") ||
    eventName.includes("order_approved") ||
    eventName.includes("paid") ||
    eventName.includes("approved")
  );
}

function detectPlan(body: KiwifyPayload) {
  const productName = getProductName(body);

  if (productName.includes("premium")) return "PREMIUM";
  if (productName.includes("clássico")) return "FREE";
  if (productName.includes("classico")) return "FREE";
  if (productName.includes("classic")) return "FREE";

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as KiwifyPayload;

    if (!isApprovedEvent(body)) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const pageId = getPageId(body);
    const plan = detectPlan(body);

    if (!pageId) {
      return NextResponse.json(
        {
          received: true,
          error: "Webhook aprovado recebido, mas sem pageId/s1/src.",
        },
        { status: 400 }
      );
    }

    const page = await prisma.romanticPage.findUnique({
      where: { id: String(pageId) },
    });

    if (!page) {
      return NextResponse.json(
        {
          received: true,
          error: "Surpresa não encontrada para este pageId.",
          pageId,
        },
        { status: 404 }
      );
    }

    const finalPlan = plan ?? page.plan;

    await prisma.payment.updateMany({
      where: {
        romanticPageId: page.id,
      },
      data: {
        status: "APPROVED",
      },
    });

    await prisma.romanticPage.update({
      where: {
        id: page.id,
      },
      data: {
        paymentStatus: "APPROVED",
        plan: finalPlan,
        isPremium: finalPlan === "PREMIUM",
      },
    });

    return NextResponse.json({
      received: true,
      approved: true,
      pageId: page.id,
      plan: finalPlan,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar webhook da Kiwify.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}