import { generateLetter } from "@/lib/generate-letter";
import { NextResponse } from "next/server";
import { z } from "zod";

const MAX_MOMENTS_LENGTH = 2000;

const bodySchema = z.object({
  creatorName: z.string().trim().min(2, "Informe seu nome."),
  partnerName: z.string().trim().min(2, "Informe o nome da pessoa amada."),
  coupleName: z.string().trim().min(2, "Informe o nome do casal."),
  importantMoments: z
    .string()
    .trim()
    .min(20, "Descreva os momentos com pelo menos 20 caracteres.")
    .max(MAX_MOMENTS_LENGTH, "O texto dos momentos é muito longo.")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    const { letter, source } = await generateLetter(parsed.data);

    return NextResponse.json({ letter, source });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível gerar a carta agora." },
      { status: 500 }
    );
  }
}
