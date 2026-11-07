"use client";
// Private-style page at /upload — add or remove album photos and videos.
// The main invitation page only displays the album; it has no upload controls.
import { useEffect, useState } from "react";

export default function UploadPage() {
  const [media, setMedia] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []))
      .catch(() => setErr("Unable to load the album."));
  }, []);

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/gallery", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMedia((prev) => [...data.uploaded, ...prev]);
      setMsg(`${data.uploaded.length} file(s) added to the album.`);
    } catch (x) {
      setErr(x.message || "Unable to upload files.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const remove = async (m) => {
    if (!confirm("Remove this from the album?")) return;
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: m.filename }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMedia((prev) => prev.filter((x) => x.id !== m.id));
    } catch (x) {
      setErr(x.message || "Unable to delete.");
    }
  };

  return (
    <main className="up">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <h1>Add photos &amp; videos</h1>
      <p className="sub">ನೆನಪುಗಳನ್ನು ಸೇರಿಸಿ · Files appear in the album on the invitation page.</p>

      <label className={"btn" + (busy ? " dis" : "")}>
        {busy ? "Uploading…" : "＋ Choose photos / videos"}
        <input type="file" accept="image/*,video/*" multiple hidden disabled={busy} onChange={onFiles} />
      </label>
      {msg && <p className="ok">{msg}</p>}
      {err && <p className="er">{err}</p>}

      <div className="grid">
        {media.map((m) => (
          <div key={m.id} className="it">
            {m.type === "video" ? <video src={m.url} muted playsInline controls /> : <img src={m.url} alt="" />}
            <button type="button" onClick={() => remove(m)} aria-label="Delete">×</button>
          </div>
        ))}
      </div>
      {media.length === 0 && <p className="sub">Nothing uploaded yet.</p>}
      <a className="back" href="/">← Back to invitation</a>
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Noto+Sans+Kannada:wght@400;600&display=swap');
body{background:#fbf3e4;color:#3a1a12;font-family:'Noto Sans Kannada',sans-serif}
.up{max-width:900px;margin:0 auto;padding:48px 20px;text-align:center}
.up h1{font-family:'Playfair Display',serif;color:#bc4330;margin:0 0 6px}
.sub{color:#8a5a4a;margin:0 0 24px}
.btn{display:inline-block;background:#bc4330;color:#fff;padding:13px 30px;border-radius:999px;cursor:pointer;font-weight:600;transition:.3s}
.btn:hover{background:#7a2418;transform:translateY(-2px)}.btn.dis{opacity:.6;pointer-events:none}
.ok{color:#2c7a3f}.er{color:#b01818}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px;margin:30px 0}
.it{position:relative;background:#fffaf0;padding:8px;box-shadow:0 6px 16px #7a241833}
.it img,.it video{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}
.it button{position:absolute;top:12px;right:12px;width:30px;height:30px;border:0;border-radius:50%;background:#7a2418;color:#fff;font-size:20px;cursor:pointer}
.it button:hover{background:#bc4330}
.back{color:#bc4330;text-decoration:none;font-weight:600}
`;
