import { cloudinaryImageStorage } from "@/lib/storage/cloudinary";
import { localImageStorage } from "@/lib/storage/local";
import { supabaseImageStorage } from "@/lib/storage/supabase";
import type { ImageStorageAdapter, ImageStorageProvider } from "@/lib/storage/types";

export function resolveImageStorageProvider(): ImageStorageProvider {
  const configured = process.env.IMAGE_STORAGE_PROVIDER?.toLowerCase();

  if (configured === "cloudinary" || configured === "supabase" || configured === "local") {
    return configured;
  }

  if (process.env.CLOUDINARY_CLOUD_NAME) return "cloudinary";
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  return "local";
}

export function getImageStorage(): ImageStorageAdapter {
  const provider = resolveImageStorageProvider();

  if (provider === "cloudinary") return cloudinaryImageStorage;
  if (provider === "supabase") return supabaseImageStorage;
  return localImageStorage;
}

export async function uploadImageToStorage(input: {
  buffer: Buffer;
  filename: string;
  contentType: string;
}): Promise<string> {
  return getImageStorage().upload(input);
}
