
import { NextResponse } from "next/server";
import { mkdir, readdir, writeFile, unlink, stat } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per file

const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

// Fetch all uploaded photos and videos
export async function GET() {
  try {
    await ensureUploadDir();

    const files = await readdir(UPLOAD_DIR);

    const media = await Promise.all(
      files
        .filter((name) => Object.values(ALLOWED_TYPES).includes(path.extname(name).toLowerCase()))
        .map(async (name) => {
          const fileStat = await stat(path.join(UPLOAD_DIR, name));

          return {
            id: name,
            filename: name,
            type: [".mp4", ".webm", ".mov"].includes(
              path.extname(name).toLowerCase()
            )
              ? "video"
              : "image",
            url: `/uploads/${encodeURIComponent(name)}`,
            createdAt: fileStat.mtimeMs,
          };
        })
    );

    media.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch gallery" },
      { status: 500 }
    );
  }
}

// Upload photos and videos
export async function POST(request) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        { error: "No files selected" },
        { status: 400 }
      );
    }

    const uploaded = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      const extension = ALLOWED_TYPES[file.type];

      if (!extension) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} exceeds the 50 MB limit` },
          { status: 400 }
        );
      }

      const filename = `${Date.now()}-${randomUUID()}${extension}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(filepath, buffer);

      uploaded.push({
        id: filename,
        filename,
        type: file.type.startsWith("video/") ? "video" : "image",
        url: `/uploads/${encodeURIComponent(filename)}`,
      });
    }

    return NextResponse.json({ uploaded });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: "Unable to upload files" },
      { status: 500 }
    );
  }
}

// Permanently delete an uploaded photo or video
export async function DELETE(request) {
  try {
    await ensureUploadDir();

    const { filename } = await request.json();

    if (
      typeof filename !== "string" ||
      path.basename(filename) !== filename ||
      !Object.values(ALLOWED_TYPES).includes(path.extname(filename).toLowerCase())
    ) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const filepath = path.join(UPLOAD_DIR, filename);

    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);

    return NextResponse.json(
      { error: "Unable to delete file" },
      { status: 500 }
    );
  }
}
