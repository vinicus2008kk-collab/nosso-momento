import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  message: z.string().min(10).optional(),
  musicUrl: z.string().url().or(z.literal("")).optional(),
  musicStartTime: z
    .union([z.number(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === "") return undefined;
      const seconds = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(seconds) || seconds < 0) return 0;
      return Math.floor(seconds);
    }),
  theme: z.string().min(1).optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const updated = await prisma.romanticPage.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        musicUrl:
          parsed.data.musicUrl === undefined
            ? undefined
            : parsed.data.musicUrl || null
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar página.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const page = await prisma.romanticPage.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
  return NextResponse.json(page);
}
