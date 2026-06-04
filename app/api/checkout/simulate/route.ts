import { isMercadoPagoConfigured } from "@/lib/mercado-pago-config";
import { approvePremiumPage } from "@/lib/premium";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (isMercadoPagoConfigured()) {
      return NextResponse.json(
        { error: "A simulação de pagamento não está disponível neste ambiente." },
        { status: 403 }
      );
    }

    const { pageId } = await request.json();
    if (!pageId) {
      return NextResponse.json({ error: "Identificador da surpresa inválido." }, { status: 400 });
    }

    const page = await approvePremiumPage(pageId);
    if (!page) {
      return NextResponse.json({ error: "Surpresa não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, pageId: page.id });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível concluir a simulação. Tente novamente." },
      { status: 500 }
    );
  }
}
