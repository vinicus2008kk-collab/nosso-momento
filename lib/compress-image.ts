export async function fileToCompressedDataUrl(
  file: File,
  maxWidth = 700,
  quality = 0.55
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Não foi possível processar a imagem.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}

export async function fileToCompressedFile(file: File): Promise<File> {
  const dataUrl = await fileToCompressedDataUrl(file);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const safeName = file.name.replace(/\.[^.]+$/, "") || "foto";

  return new File([blob], `${safeName}.jpg`, { type: "image/jpeg" });
}