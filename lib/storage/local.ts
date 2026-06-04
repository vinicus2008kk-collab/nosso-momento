import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { ImageStorageAdapter, UploadImageInput } from "@/lib/storage/types";

function extensionFromFilename(filename: string, contentType: string) {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (fromName && ["mp4", "webm", "mov"].includes(fromName)) {
    return fromName;
  }
  if (contentType.includes("video/webm")) return "webm";
  if (contentType.includes("quicktime")) return "mov";
  if (contentType.includes("video/mp4")) return "mp4";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "jpg";
}

export const localImageStorage: ImageStorageAdapter = {
  async upload({ buffer, filename, contentType }: UploadImageInput) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = extensionFromFilename(filename, contentType);
    const storedName = `${randomUUID()}.${ext}`;
    await writeFile(path.join(uploadsDir, storedName), buffer);

    return `/uploads/${storedName}`;
  }
};
