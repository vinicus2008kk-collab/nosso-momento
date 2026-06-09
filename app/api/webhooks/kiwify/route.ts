import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type KiwifyPayload = {
  event?: string;
  event_type?: string;
  webhook_event_type?: string;
  type?: string;
  status?: string;
  pageId?: string;
  page_id?: string;
  metadata?: {
    pageId?: string;
    page_id?: string;
  };
  checkout_data?: {
    pageId?: string;
    page_id?: string;
  };
  order?: {
    pageId?: string;
    product_name?: string;
    customer_email?: string;
  };
  data?: {
    pageId?: string;
    page_id?: string;
    product_name?: string;
    customer_email?: string;
  };
  Product?: {
    product_name?: string;
  };
  product?: {
    name?: string;
  };
  product_name?: string;
  Customer?: {
    email?: string;
  };
  customer?: {
    email?: string;
  };
  buyer?: {
    email?: string;
  };
  email?: string;
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
    body.pageId ||
    body.page_id ||
    body.metadata?.pageId ||
    body.metadata?.page_id ||
    body.checkout_data?.pageId ||
    body.checkout_data?.page_id ||
    body.order?.pageId ||
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
  if (productName.includes("clássico")) return "CLASSIC";
  if (productName.includes("classico")) return "CLASSIC";

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

    let page = null;

    if (pageId) {
      page = await prisma.romanticPage.findUnique({
        where: { id: String(pageId) },
      });
    }

    if (!page) {
      page = await prisma.romanticPage.findFirst({
        where: {
          paymentStatus: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (!page) {
      return NextResponse.json({
        received: true,
        warning: "Nenhuma surpresa pendente encontrada para liberar.",
      });
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