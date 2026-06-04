export type ImageStorageProvider = "local" | "cloudinary" | "supabase";

export type UploadImageInput = {
  buffer: Buffer;
  filename: string;
  contentType: string;
};

export type ImageStorageAdapter = {
  upload(input: UploadImageInput): Promise<string>;
};
