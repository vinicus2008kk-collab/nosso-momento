import { MAX_PHOTOS_FREE } from "@/lib/romantic-page";
import { uploadImageToStorage } from "@/lib/storage";
import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;
const MAX_PREMIUM_FILES_PER_REQUEST = 30;

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const ALLOWED_VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isVideoFile(file: File) {
  if (file.type.startsWith("video/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? ALLOWED_VIDEO_EXTENSIONS.has(ext) : false;
}

function getMediaType(file: File): "image" | "video" | null {
  if (isImageFile(file)) return "image";
  if (isVideoFile(file)) return "video";
  return null;
}

function videoContentType(file: File): string {
  if (file.type && ALLOWED_VIDEO_TYPES.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "video/webm";
  if (ext === "mov") return "video/quicktime";
  return "video/mp4";
}

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const plan = formData.get("plan");
    const files = formData.getAll("photos").filter((entry): entry is File => entry instanceof File);

    if (plan !== "FREE" && plan !== "PREMIUM") {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ error: "Selecione ao menos uma foto ou vídeo." }, { status: 400 });
    }

    if (plan === "FREE" && files.length > MAX_PHOTOS_FREE) {
      return NextResponse.json(
        { error: "Clássico permite apenas 1 mídia." },
        { status: 400 }
      );
    }

    if (plan === "PREMIUM" && files.length > MAX_PREMIUM_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Envie no máximo ${MAX_PREMIUM_FILES_PER_REQUEST} arquivos por vez.` },
        { status: 400 }
      );
    }

    const items: { type: "image" | "video"; url: string }[] = [];

    for (const file of files) {
      const mediaType = getMediaType(file);

      if (!mediaType) {
        return NextResponse.json(
          { error: "Use imagens (JPG, PNG, WebP) ou vídeos (MP4, WebM, MOV)." },
          { status: 400 }
        );
      }

      const maxSize = mediaType === "video" ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error:
              mediaType === "video"
                ? "Um dos vídeos é muito grande. Use arquivos de até 50 MB."
                : "Uma das imagens é muito grande. Use fotos de até 8 MB."
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType =
        mediaType === "video" ? videoContentType(file) : file.type || "image/jpeg";

      const url = await uploadImageToStorage({
        buffer,
        filename: file.name || (mediaType === "video" ? "video.mp4" : "foto.jpg"),
        contentType
      });

      items.push({ type: mediaType, url });
    }

    const urls = items.map((item) => item.url);

    return NextResponse.json({ items, urls });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível enviar as mídias.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
