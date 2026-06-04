import { randomUUID } from "crypto";
import type { ImageStorageAdapter, UploadImageInput } from "@/lib/storage/types";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "photos";

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase Storage não configurado.");
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey, bucket };
}

export const supabaseImageStorage: ImageStorageAdapter = {
  async upload({ buffer, filename, contentType }: UploadImageInput) {
    const { url, serviceRoleKey, bucket } = getSupabaseConfig();
    const objectPath = `romantic-pages/${randomUUID()}-${filename.replace(/\s+/g, "-")}`;

    const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": contentType,
        "x-upsert": "false"
      },
      body: buffer
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar imagem para o Supabase Storage.");
    }

    return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
  }
};
