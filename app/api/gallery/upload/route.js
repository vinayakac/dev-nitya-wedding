import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Issues short-lived tokens so the BROWSER uploads straight to Vercel Blob
// (bypasses Vercel's 4.5 MB function body limit). Needs BLOB_READ_WRITE_TOKEN.
export async function POST(request) {
  try {
    const body = await request.json();
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
          "video/mp4", "video/webm", "video/quicktime",
        ],
        maximumSizeInBytes: 50 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    console.error("Blob token error:", error);
    return NextResponse.json({ error: error.message || "Upload token failed" }, { status: 400 });
  }
}
