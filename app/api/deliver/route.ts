import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { buildPublicUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function sendEmail(to: string, surpriseUrl: string) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject: "Sua surpresa especial está pronta 💝",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#1e0d1a;border-radius:16px;color:#fff;">
        <h1 style="font-size:24px;margin-bottom:8px;">Sua surpresa está pronta! 💝</h1>
        <p style="color:rgba(255,255,255,0.8);margin-bottom:24px;">
          Alguém preparou algo especial para você. Acesse o link abaixo:
        </p>
        <a href="${surpriseUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#8b1a2a,#6a1525);color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;font-size:16px;">
          Ver minha surpresa →
        </a>
        <p style="margin-top:24px;font-size:12px;color:rgba(255,255,255,0.4);">
          Ou copie e cole: ${surpriseUrl}
        </p>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  try {
    const { pageId, method, contact } = await request.json();

    if (!pageId || !method || !contact) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const page = await prisma.romanticPage.findUnique({ where: { id: pageId } });

    if (!page) {
      return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
    }

    if (page.paymentStatus !== "APPROVED") {
      return NextResponse.json({ error: "Pagamento não confirmado." }, { status: 403 });
    }

    await prisma.romanticPage.update({
      where: { id: pageId },
      data: { deliveryMethod: method, deliveryContact: contact },
    });

    if (method === "email") {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return NextResponse.json(
          { error: "Envio de e-mail não configurado. Configure as variáveis SMTP no servidor." },
          { status: 503 }
        );
      }

      const surpriseUrl = buildPublicUrl(page.slug);
      await sendEmail(contact, surpriseUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Não foi possível processar a entrega.", details: String(error) },
      { status: 500 }
    );
  }
}
