import { NextResponse } from "next/server";
import { mkdir, readdir, writeFile, unlink, stat } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { list as blobList, del as blobDel } from "@vercel/blob";

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN; // set automatically when a Blob store is connected on Vercel

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// New uploads live OUTSIDE /public (files added to /public after `next build`
// are NOT served by `next start`, which is why uploads used to 404).
// They are served by /api/media/[name]. Set UPLOAD_DIR to a persistent disk path in production.
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
const LEGACY_DIR = path.join(process.cwd(), "public", "uploads"); // older uploads, still listed
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per file

const MIME_EXT = {
  "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/pjpeg": ".jpg", "image/png": ".png",
  "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif",
  "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov",
};
const OK_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".mp4", ".webm", ".mov"];
const VIDEO_EXT = [".mp4", ".webm", ".mov", ".m4v"];

const extOf = (n) => path.extname(n || "").toLowerCase();

function pickExtension(file) {
  // Some phones/browsers send an empty or odd MIME type, so fall back to the file name.
  const fromMime = MIME_EXT[(file.type || "").toLowerCase()];
  if (fromMime) return fromMime;
  const e = extOf(file.name);
  if (OK_EXT.includes(e)) return e === ".jpeg" ? ".jpg" : e;
  return null;
}

async function list(dir, urlOf) {
  let names = [];
  try { names = await readdir(dir); } catch { return []; }
  return Promise.all(
    names.filter((n) => OK_EXT.includes(extOf(n))).map(async (name) => {
      const s = await stat(path.join(dir, name));
      return {
        id: name, filename: name,
        type: VIDEO_EXT.includes(extOf(name)) ? "video" : "image",
        url: urlOf(name), createdAt: s.mtimeMs,
      };
    })
  );
}

export async function GET() {
  try {
    let fromBlob = [];
    let blobError = null;
    if (USE_BLOB) {
      try {
        let cursor;
        do {
          const r = await blobList({ prefix: "gallery/", cursor, limit: 1000 });
          fromBlob.push(...r.blobs.map((b) => ({
            id: b.url, filename: b.pathname, url: b.url, blobUrl: b.url,
            type: VIDEO_EXT.includes(extOf(b.pathname)) ? "video" : "image",
            createdAt: new Date(b.uploadedAt).getTime(),
          })));
          cursor = r.hasMore ? r.cursor : undefined;
        } while (cursor);
      } catch (e) { console.error("Blob list error:", e); blobError = "Could not read cloud storage"; }
    } else {
      await mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});
    }
    const [a, b] = await Promise.all([
      USE_BLOB ? [] : list(UPLOAD_DIR, (n) => `/api/media/${encodeURIComponent(n)}`),
      list(LEGACY_DIR, (n) => `/uploads/${encodeURIComponent(n)}`),
    ]);
    const media = [...fromBlob, ...a, ...b].sort((x, y) => y.createdAt - x.createdAt);
    return NextResponse.json({ media, mode: USE_BLOB ? "blob" : "disk", warning: blobError }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Unable to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!USE_BLOB && process.env.VERCEL) {
      return NextResponse.json(
        { error: "Cloud storage isn't connected yet. In Vercel: Storage → Create → Blob (Public) → connect to this project, then redeploy." },
        { status: 500 }
      );
    }
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (e) {
      console.error("Upload dir not writable:", UPLOAD_DIR, e);
      return NextResponse.json(
        { error: "The server can't save files here (read-only hosting). Set UPLOAD_DIR to a writable disk, or use cloud storage." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files");
    if (!files.length) return NextResponse.json({ error: "No files selected" }, { status: 400 });

    const uploaded = [];
    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      const extension = pickExtension(file);
      if (!extension) {
        const looksHeic = /hei[cf]/i.test(file.type || "") || /\.hei[cf]$/i.test(file.name || "");
        return NextResponse.json(
          { error: looksHeic
              ? `${file.name}: HEIC photos aren't supported. Share it as JPG (iPhone: Camera → Formats → Most Compatible).`
              : `${file.name || "File"}: unsupported type${file.type ? " (" + file.type + ")" : ""}. Use JPG, PNG, WebP, MP4 or MOV.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `${file.name} is over the 50 MB limit` }, { status: 400 });
      }

      const filename = `${Date.now()}-${randomUUID()}${extension}`;
      await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));
      uploaded.push({
        id: filename, filename,
        type: VIDEO_EXT.includes(extension) ? "video" : "image",
        url: `/api/media/${encodeURIComponent(filename)}`,
      });
    }
    return NextResponse.json({ uploaded });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Unable to upload files (server error)" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { filename, url } = await request.json();
    if (USE_BLOB && typeof url === "string" && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url)) {
      await blobDel(url);
      return NextResponse.json({ success: true });
    }
    if (typeof filename !== "string" || path.basename(filename) !== filename || !OK_EXT.includes(extOf(filename))) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }
    try {
      await unlink(path.join(UPLOAD_DIR, filename));
    } catch {
      await unlink(path.join(LEGACY_DIR, filename));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Unable to delete file" }, { status: 500 });
  }
}
