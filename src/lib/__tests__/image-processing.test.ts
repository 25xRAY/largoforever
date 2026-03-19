import sharp from "sharp";
import { processUploadedImage } from "@/lib/image-processing";

describe("processUploadedImage", () => {
  it("returns data URLs for full, thumb, and avatar", async () => {
    const png = await sharp({
      create: {
        width: 80,
        height: 80,
        channels: 3,
        background: { r: 0, g: 59, b: 122 },
      },
    })
      .png()
      .toBuffer();

    const out = await processUploadedImage(png, "test-key");
    expect(out.fullUrl).toMatch(/^data:image\/webp;base64,/);
    expect(out.thumbnailUrl).toMatch(/^data:image\/webp;base64,/);
    expect(out.avatarUrl).toMatch(/^data:image\/webp;base64,/);
  });
});
