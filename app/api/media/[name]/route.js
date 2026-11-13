import { NextResponse } from "next/server";
import { stat, open } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
const TYPES = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

// Streams an uploaded file, with Range support so videos can seek/play on phones.
export async function GET(request, { params }) {
  const name = params.name;
  const ext = path.extname(name || "").toLowerCase();
  if (!name || path.basename(name) !== name || !TYPES[ext]) {
    return new NextResponse("Not found", { status: 404 });
  }
  const file = path.join(DIR, name);
  let size;
  try { size = (await stat(file)).size; } catch { return new NextResponse("Not found", { status: 404 }); }

  const headers = {
    "Content-Type": TYPES[ext],
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  const range = request.headers.get("range");
  let start = 0, end = size - 1, status = 200;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      if (m[1] !== "") start = parseInt(m[1], 10);
      if (m[2] !== "") end = Math.min(parseInt(m[2], 10), size - 1);
      if (m[1] === "" && m[2] !== "") { start = Math.max(size - parseInt(m[2], 10), 0); end = size - 1; }
      if (start > end || start >= size) {
        return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    }
  }
  const length = end - start + 1;
  headers["Content-Length"] = String(length);

  const fh = await open(file, "r");
  const buf = Buffer.alloc(length);
  await fh.read(buf, 0, length, start);
  await fh.close();
  return new NextResponse(buf, { status, headers });
}
