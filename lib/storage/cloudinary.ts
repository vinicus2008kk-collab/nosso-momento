import { createHash } from "crypto";
import type { ImageStorageAdapter, UploadImageInput } from "@/lib/storage/types";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary não configurado.");
  }

  return { cloudName, apiKey, apiSecret };
}

export const cloudinaryImageStorage: ImageStorageAdapter = {
  async upload({ buffer, filename, contentType }: UploadImageInput) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const folder = process.env.CLOUDINARY_FOLDER ?? "nosso-momento";

    const formData = new FormData();
    const fileBytes = new Uint8Array(buffer);

    formData.append("file", new Blob([fileBytes], { type: contentType }), filename);

    if (uploadPreset) {
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", folder);
    } else {
      const timestamp = Math.round(Date.now() / 1000).toString();
      const params = `folder=${folder}&timestamp=${timestamp}`;
      const signature = createHash("sha1")
        .update(`${params}${apiSecret}`)
        .digest("hex");

      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
    }

    const resourceType = contentType.startsWith("video/") ? "video" : "image";
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Falha ao enviar ${resourceType} para o Cloudinary.`);
    }

    const data = (await response.json()) as { secure_url?: string };
    if (!data.secure_url) {
      throw new Error(`Cloudinary não retornou URL do ${resourceType}.`);
    }

    return data.secure_url;
  },
};