import {
  MAX_PHOTOS_FREE,
  isValidMediaUrl,
  type PageMediaInput
} from "@/lib/romantic-page";
import { MUSIC_START_MAX_MINUTES, MUSIC_START_MAX_SECONDS } from "@/lib/music-start-time";
import { z } from "zod";

const MAX_MUSIC_START_SECONDS = MUSIC_START_MAX_MINUTES * 60 + MUSIC_START_MAX_SECONDS;

const legacyPhotoSchema = z
  .string()
  .min(1)
  .refine(isValidMediaUrl, {
    message: "Use mídia enviada pela galeria ou uma URL https válida."
  });

const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z
    .string()
    .min(1)
    .refine(isValidMediaUrl, {
      message: "Use mídia enviada pela galeria ou uma URL https válida."
    })
});

const pageMediaSchema = z.union([legacyPhotoSchema, mediaItemSchema]);

export const romanticPageSchema = z
  .object({
    creatorName: z.string().min(2, "Nome do criador obrigatório"),
    partnerName: z.string().min(2, "Nome do parceiro obrigatório"),
    coupleName: z.string().min(2, "Nome do casal obrigatório"),
    startDate: z.string().min(1, "Data obrigatória"),
    message: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
    photos: z.array(pageMediaSchema).min(1, "Adicione ao menos uma foto ou vídeo."),
    musicUrl: z.string().url().optional().or(z.literal("")),
    musicStartTime: z
      .union([z.number(), z.string()])
      .optional()
      .transform((value) => {
        if (value === undefined || value === "") return 0;
        const seconds = typeof value === "number" ? value : Number(value);
        if (Number.isNaN(seconds) || seconds < 0) return 0;
        return Math.min(Math.floor(seconds), MAX_MUSIC_START_SECONDS);
      }),
    theme: z.string().min(1),
    slug: z
      .string()
      .min(3)
      .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
    plan: z.enum(["FREE", "PREMIUM"])
  })
  .superRefine((value, ctx) => {
    if (value.plan === "FREE" && value.photos.length > MAX_PHOTOS_FREE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["photos"],
        message: `Clássico permite apenas ${MAX_PHOTOS_FREE} mídia.`
      });
    }
  });

export type RomanticPagePayload = z.infer<typeof romanticPageSchema> & {
  photos: PageMediaInput[];
};
