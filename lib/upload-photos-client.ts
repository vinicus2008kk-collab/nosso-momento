import { fileToCompressedFile } from "@/lib/compress-image";
import type { PageMediaItem } from "@/lib/romantic-page";

type UploadPlan = "FREE" | "PREMIUM";

function isVideoFile(file: File) {
  if (file.type.startsWith("video/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "mp4" || ext === "webm" || ext === "mov";
}

export async function uploadPhotosToStorage(
  files: File[],
  plan: UploadPlan
): Promise<PageMediaItem[]> {
  const formData = new FormData();
  formData.append("plan", plan);

  for (const file of files) {
    if (isVideoFile(file)) {
      formData.append("photos", file);
    } else {
      const compressed = await fileToCompressedFile(file);
      formData.append("photos", compressed);
    }
  }

  const response = await fetch("/api/uploads/photos", {
    method: "POST",
    body: formData
  });

  const data = (await response.json()) as {
    items?: PageMediaItem[];
    urls?: string[];
    error?: string;
  };

  if (!response.ok || !data.items?.length) {
    throw new Error(data.error ?? "Não foi possível enviar as mídias.");
  }

  return data.items;
}
