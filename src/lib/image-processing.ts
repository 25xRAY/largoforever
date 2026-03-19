import sharp from "sharp";

export interface ProcessedImageUrls {
  /** Max dimension 1200px WebP */
  fullUrl: string;
  /** 400px cover WebP */
  thumbnailUrl: string;
  /** 100px cover WebP */
  avatarUrl: string;
}

/**
 * Resize/compress an upload: full ≤1200px, 400px thumb, 100px avatar — all WebP.
 * Returns data URLs suitable for development when S3 is not configured.
 */
export async function processUploadedImage(
  buffer: Buffer,
  _baseKey: string
): Promise<ProcessedImageUrls> {
  const fullBuf = await sharp(buffer)
    .rotate()
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const thumbBuf = await sharp(buffer)
    .rotate()
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();

  const avatarBuf = await sharp(buffer)
    .rotate()
    .resize(100, 100, { fit: "cover" })
    .webp({ quality: 75 })
    .toBuffer();

  const toDataUrl = (b: Buffer) => `data:image/webp;base64,${b.toString("base64")}`;

  return {
    fullUrl: toDataUrl(fullBuf),
    thumbnailUrl: toDataUrl(thumbBuf),
    avatarUrl: toDataUrl(avatarBuf),
  };
}
