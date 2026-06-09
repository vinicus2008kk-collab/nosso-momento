import { prisma } from "@/lib/prisma";
import { serializePageMedia } from "@/lib/romantic-page";
import { romanticPageSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = romanticPageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    let finalSlug = payload.slug;
    const base = payload.slug;
    let counter = 2;
    while (await prisma.romanticPage.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${base}-${counter}`;
      counter++;
    }

    const photosJson = serializePageMedia(payload.photos, payload.plan);
    const savedPhotosCount = JSON.parse(photosJson).length;

    const page = await prisma.romanticPage.create({
      data: {
        creatorName: payload.creatorName,
        partnerName: payload.partnerName,
        coupleName: payload.coupleName,
        startDate: new Date(payload.startDate),
        message: payload.message,
        photos: photosJson,
        musicUrl: payload.plan === "PREMIUM" ? payload.musicUrl || null : null,
        musicStartTime: payload.plan === "PREMIUM" ? payload.musicStartTime ?? 0 : 0,
        theme: payload.theme,
        slug: finalSlug,
        plan: payload.plan,
        isPremium: false,
        paymentStatus: "PENDING"
      }
    });

    return NextResponse.json({ ...page, savedPhotosCount }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao criar a página.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const pages = await prisma.romanticPage.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return NextResponse.json(pages);
}
