import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * POST — authenticated. Validate file type (pdf/jpg/png) + max 5MB. Return presigned URL or mock for dev.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fileName, fileType, fileSize } = body as {
      fileName?: string;
      fileType?: string;
      fileSize?: number;
    };

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "fileName required" }, { status: 400 });
    }
    if (!fileType || !ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: pdf, jpg, png" },
        { status: 400 }
      );
    }
    if (fileSize != null && fileSize > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 }
      );
    }

    const hasS3 =
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET;

    if (hasS3) {
      // In production you would use @aws-sdk/client-s3 getSignedUrl
      const prefix = `uploads/${session.user.id}/${Date.now()}-`;
      const fileKey = prefix + fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uploadUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}?signature=presigned`;
      return NextResponse.json({ uploadUrl, fileKey });
    }

    // Mock for development
    const fileKey = `uploads/${session.user.id}/${Date.now()}-${fileName}`;
    const uploadUrl = `/api/uploads/mock?key=${encodeURIComponent(fileKey)}`;
    return NextResponse.json({ uploadUrl, fileKey });
  } catch {
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
