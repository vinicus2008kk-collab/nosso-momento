import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "A simulação de pagamento não está disponível em produção." },
        { status: 403 }
      );
    }

    const { pageId } = await request.json();

    if (!pageId) {
      return NextResponse.json(
        { error: "Identificador da surpresa inválido." },
        { status: 400 }
      );
    }

    const page = await prisma.romanticPage.findUnique({
      where: { id: String(pageId) },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Surpresa não encontrada." },
        { status: 404 }
      );
    }

    await prisma.payment.updateMany({
      where: {
        romanticPageId: page.id,
      },
      data: {
        status: "APPROVED",
      },
    });

    const updatedPage = await prisma.romanticPage.update({
      where: {
        id: page.id,
      },
      data: {
        paymentStatus: "APPROVED",
        isPremium: page.plan === "PREMIUM",
      },
    });

    return NextResponse.json({
      success: true,
      pageId: updatedPage.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível concluir a simulação. Tente novamente.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}