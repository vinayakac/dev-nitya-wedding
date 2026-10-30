"use client";
// Next.js (App Router): save as app/page.js  — works as-is, no extra packages.
import { useEffect, useRef, useState } from "react";

const WEDDING = new Date("2026-11-22T08:50:00+05:30"); // change if muhurta time differs
const MAP = "https://www.google.com/maps/search/?api=1&query=Namo+Vatika+Kalyana+Mantapa+Sindhanur";
const PHONES = ["9611589187", "9611050890"];

function useCountdown() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, WEDDING - new Date()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60, over: left === 0 };
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"rv" + (on ? " on" : "")} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

const PHOTOS = { bride: "/photos/bride.jpg", couple: "/photos/couple.jpg", groom: "/photos/groom.jpg",
  more: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/photos/g${n}.jpg`) };

const TEASER = { src: "/teaser.mp4", poster: "/teaser-poster.jpg" };

export default function Page() {
  const c = useCountdown();
  const [media, setMedia] = useState([
    { id: "p1", type: "image", url: PHOTOS.couple },
    { id: "p2", type: "image", url: PHOTOS.bride },
    { id: "p3", type: "image", url: PHOTOS.groom },
    ...PHOTOS.more.map((url, i) => ({ id: "m" + i, type: "image", url })),
  ]);
  const [open, setOpen] = useState(null);
  const [rsvp, setRsvp] = useState({ name: "", guests: "1" });

  const addFiles = (e) => {
    const items = [...e.target.files].map((f) => ({
      id: crypto.randomUUID(),
      type: f.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(f),
    }));
    setMedia((m) => [...items, ...m]);
    e.target.value = "";
  };

  const petals = Array.from({ length: 18 }, (_, i) => i);

  return (
    <main>
      <style>{css}</style>

      {c && (
        <div className="banner">
          {c.over ? "💐 ಶುಭ ವಿವಾಹ — ಶುಭಾಶಯಗಳು! 💐" : `💍 ಮದುವೆಗೆ ಇನ್ನು ${c.d} ದಿನ ${c.h} ಗಂಟೆ ಬಾಕಿ · ${c.d} days to go 💍`}
        </div>
      )}

      <section className="hero">
        {petals.map((i) => (
          <span key={i} className="petal" style={{ left: (i * 37) % 100 + "%", animationDelay: (i % 9) * 0.9 + "s", animationDuration: 9 + (i % 5) * 2 + "s" }}>🌸</span>
        ))}
        <p className="small">॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರ ಪ್ರಸನ್ನ ॥ ॥ ಶ್ರೀ ಶಾಂಭವಿದೇವಿ ಪ್ರಸನ್ನ ॥</p>
        <p className="kn">ಚಿಂಚರಕಿ ನಾಯಕ ಬಂಧುಗಳ ವಿವಾಹ ಆಹ್ವಾನ ಪತ್ರಿಕೆ</p>
        <div className="arch"><img src={PHOTOS.couple} alt="Devaraja and Nithyashree" /></div>
        <h1 className="names">Devaraja <i>&amp;</i> Nithyashree</h1>
        <h2 className="kn big">ದೇವರಾಜ <i>&amp;</i> ನಿತ್ಯಶ್ರೀ</h2>
        <p className="date">22 · 11 · 2026 — Sunday</p>
        <a href="#invite" className="btn">ಆಮಂತ್ರಣ ನೋಡಿ ↓</a>
        <a href="#teaser" className="btn ghost">▶ Watch Teaser</a>
      </section>

      {c && !c.over && (
        <section className="count">
          {[["ದಿನ", "Days", c.d], ["ಗಂಟೆ", "Hours", c.h], ["ನಿಮಿಷ", "Minutes", c.m], ["ಸೆಕೆಂಡ್", "Seconds", c.s]].map(([kn, en, v]) => (
            <div key={en} className="box"><b>{String(v).padStart(2, "0")}</b><span>{kn} · {en}</span></div>
          ))}
        </section>
      )}

      <section id="teaser" className="sec">
        <Reveal>
          <h3>ಮದುವೆ ಟೀಸರ್ · Wedding Teaser</h3>
          <div className="cinema">
            <video src={TEASER.src} poster={TEASER.poster} controls playsInline preload="metadata" />
            <span className="badge">1:27</span>
          </div>
          <p className="hint">A journey to forever — Bride · Groom · Mehndi · Haldi · Family Blessings</p>
        </Reveal>
      </section>

      <section id="invite" className="sec">
        <Reveal>
          <h3>ಸಪ್ರೇಮ ವಂದನೆಗಳು</h3>
          <p className="kn">
            ಸ್ವಸ್ತಿ ವಿಜಯಾಭ್ಯುದಯ ಶ್ರೀ ಮನ್ನೃಪ ಶಾಲಿವಾಹನಶಕೆ 1948ನೇ ಪರಾಭವನಾಮ ಸಂವತ್ಸರ ಕಾರ್ತಿಕ ಶು.12 ಶನಿವಾರ ದಿನಾಂಕ 21-11-2026 ರಂದು ಶ್ರೀ ಗುರುದೇವತಾಕಾರ್ಯ ಹಾಗೂ
            ಕಾರ್ತಿಕ ಶು.13 ರವಿವಾರ ದಿನಾಂಕ 22-11-2026 ರಂದು ಬೆಳಗ್ಗೆ 08:50 ರಿಂದ 09:56 ನಿಮಿಷದವರೆಗೆ ಸಲ್ಲುವ ಧನಸ್ಸು ಲಗ್ನದ ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಮಾಂಗಲ್ಯಧಾರಣ ವ ಅಕ್ಷತಾರೋಪಣ.
          </p>
        </Reveal>
      </section>

      <section className="sec couple">
        <Reveal><div className="card"><img className="portrait" src={PHOTOS.groom} alt="Devaraja" style={{ objectPosition: "50% 30%" }} /><small>ವರ · Groom</small><h4>ಚಿ॥ ದೇವರಾಜ</h4><em>B.E. (EIE)</em>
          <p className="kn">ಶ್ರೀಮತಿ ಗೌರಮ್ಮ ಶ್ರೀ ಹನುಮಂತ ನಾಯಕ ಚಿಂಚರಕಿ, ಸಾ॥ ಪುಲದಿನ್ನಿ ಇವರ ಏಕೈಕ ಸುಪುತ್ರ</p></div></Reveal>
        <div className="heart">♥</div>
        <Reveal delay={150}><div className="card"><img className="portrait" src={PHOTOS.bride} alt="Nithyashree" style={{ objectPosition: "50% 18%" }} /><small>ವಧು · Bride</small><h4>ಚಿ॥ಕುಂ॥ಸೌ॥ ನಿತ್ಯಶ್ರೀ</h4><em>B.E. Civil</em>
          <p className="kn">ಶ್ರೀಮತಿ ಅನುಸುಯಾ ಶ್ರೀ ರಾಮಲಿಂಗಪ್ಪ ಸಾ॥ ಯರಂಗಳ್ಳಿ, ತಾ॥ ಕುರುಗೋಡು, ಜಿ॥ ಬಳ್ಳಾರಿ ಇವರ ತೃತೀಯ ಸುಪುತ್ರಿ</p></div></Reveal>
      </section>

      <section className="sec">
        <Reveal><h3>ಕಾರ್ಯಕ್ರಮಗಳು · Events</h3></Reveal>
        <div className="grid2">
          <Reveal><div className="card"><small>21-11-2026 · ಶನಿವಾರ</small><h4>ಗುರುದೇವತಾ ಕಾರ್ಯ</h4><p>Kartika Shu. 12</p></div></Reveal>
          <Reveal delay={120}><div className="card gold"><small>22-11-2026 · ರವಿವಾರ</small><h4>ವಿವಾಹ ಮುಹೂರ್ತ</h4><p>ಬೆಳಗ್ಗೆ 08:50 – 09:56</p></div></Reveal>
        </div>
        <Reveal delay={100}>
          <div className="card venue">
            <small>ವಿವಾಹ ಸ್ಥಳ · Venue</small>
            <h4>ನಮೋ ವಾಟಿಕ ಕಲ್ಯಾಣ ಮಂಟಪ</h4>
            <p className="kn">ರಾಜಮಹಲ್ ಹತ್ತಿರ, ಗಂಗಾವತಿ ರಸ್ತೆ, ಸಿಂಧನೂರು, ರಾಯಚೂರು ಜಿಲ್ಲೆ</p>
            <a className="btn" href={MAP} target="_blank" rel="noreferrer">📍 ದಾರಿ ತೋರಿಸಿ · Open in Maps</a>
          </div>
        </Reveal>
      </section>

      <section className="sec">
        <Reveal><h3>ನೆನಪುಗಳು · Photos &amp; Videos</h3>
          <label className="btn upload">＋ Add photos / videos
            <input type="file" accept="image/*,video/*" multiple hidden onChange={addFiles} />
          </label>
        </Reveal>
        <div className="gallery">
          {media.length === 0 && <p className="hint">Add your pre-wedding photos &amp; videos here ✨</p>}
          {media.map((m) => (
            <div key={m.id} className="tile" onClick={() => setOpen(m)}>
              {m.type === "video" ? <video src={m.url} muted playsInline /> : <img src={m.url} alt="" />}
              {m.type === "video" && <span className="play">▶</span>}
              <button className="x" onClick={(e) => { e.stopPropagation(); setMedia((a) => a.filter((i) => i.id !== m.id)); }}>×</button>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <h3>ತಮ್ಮ ಆಗಮನಾಭಿಲಾಷಿಗಳು</h3>
          <p className="kn fam">ಶ್ರೀಮತಿ ಹಂಪಮ್ಮ ಗಂ.ದಿ॥ ಲಚುಮಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ<br />ಶ್ರೀಮತಿ ದ್ಯಾವಮ್ಮ ಶ್ರೀ ಚೌಡಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ<br />ಶ್ರೀಮತಿ ದೊಡ್ಡನಾಗಮ್ಮ ಶ್ರೀ ಸಾಬಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ<br />ಶ್ರೀಮತಿ ಸಣ್ಣನಾಗಮ್ಮ ಶ್ರೀ ಯಂಕೋಬ ನಾಯಕ ಚಿಂಚರಕಿ<br />ಶ್ರೀಮತಿ ಗೌರಮ್ಮ ಶ್ರೀ ಹನುಮಂತ ನಾಯಕ ಚಿಂಚರಕಿ<br />ಸಾ॥ ಪುಲದಿನ್ನಿ, ತಾ॥ ಸಿಂಧನೂರು, ಜಿ॥ ರಾಯಚೂರು</p>
          <div className="rsvp">
            <input placeholder="Your name / ನಿಮ್ಮ ಹೆಸರು" value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} />
            <select value={rsvp.guests} onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
            </select>
            <a className="btn" target="_blank" rel="noreferrer"
              href={`https://wa.me/91${PHONES[0]}?text=${encodeURIComponent(`ನಮಸ್ಕಾರ, ನಾನು ${rsvp.name} (${rsvp.guests} ಜನ) ಮದುವೆಗೆ ಬರುತ್ತೇವೆ 🙏`)}`}>
              ✅ I'll attend (WhatsApp)
            </a>
          </div>
          <p className="hint">ಮೊ: {PHONES.map((p) => <a key={p} href={"tel:" + p}> {p} </a>)}</p>
        </Reveal>
      </section>

      <footer>ಪ್ರೀತಿಯಿಂದ ಬಂದು... ಮನದುಂಬಿ ಹಾರೈಸಿ 🙏</footer>

      {open && (
        <div className="lb" onClick={() => setOpen(null)}>
          {open.type === "video" ? <video src={open.url} controls autoPlay /> : <img src={open.url} alt="" />}
        </div>
      )}
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Noto+Sans+Kannada:wght@400;600;800&display=swap');
:root{--m:#8b1538;--g:#c9a227;--c:#fff8ec;--p:#e0357a}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--c);color:#3b1020;font-family:'Noto Sans Kannada',sans-serif}
main{overflow-x:hidden}
.kn{font-family:'Noto Sans Kannada',sans-serif;line-height:1.9}
.banner{position:sticky;top:0;z-index:50;text-align:center;padding:10px 12px;color:#fff;font-weight:600;font-size:.95rem;
 background:linear-gradient(90deg,var(--m),var(--p),var(--g),var(--p),var(--m));background-size:300% 100%;animation:sh 8s linear infinite}
@keyframes sh{to{background-position:300% 0}}
.hero{position:relative;min-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px;
 background:radial-gradient(circle at 50% 20%,#ffe9b8,#ffd1dc 55%,#f9b5c8)}
.hero>*{position:relative;z-index:2;animation:up 1s both}
.small{font-size:.85rem;color:var(--m)}
.names{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,9vw,5.5rem);margin:.3em 0 0;color:var(--m);animation-delay:.2s}
.names i,.big i{color:var(--g)}
.big{font-size:clamp(1.6rem,6vw,3rem);margin:0;color:var(--p);font-weight:800;animation-delay:.4s}
.date{letter-spacing:.3em;font-weight:600;margin:1.2em 0;animation-delay:.6s}
@keyframes up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
.petal{position:absolute;top:-40px;z-index:1;font-size:1.4rem;animation:fall linear infinite;opacity:.8}
@keyframes fall{to{transform:translateY(105vh) rotate(360deg) translateX(40px)}}
.btn{display:inline-block;background:var(--m);color:#fff;padding:12px 26px;border-radius:999px;text-decoration:none;border:0;cursor:pointer;font:inherit;font-weight:600;
 box-shadow:0 8px 20px #8b153855;transition:.3s}
.btn:hover{transform:translateY(-3px) scale(1.04);background:var(--p)}
.count{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:-50px auto 0;position:relative;z-index:5;padding:0 12px}
.box{background:#fff;border:2px solid var(--g);border-radius:18px;padding:16px 20px;min-width:110px;text-align:center;box-shadow:0 10px 30px #0002}
.box b{display:block;font-family:'Playfair Display',serif;font-size:2.4rem;color:var(--m)}
.box span{font-size:.75rem;color:#777}
.sec{max-width:900px;margin:0 auto;padding:70px 20px;text-align:center}
h3{font-family:'Noto Sans Kannada';font-size:1.7rem;color:var(--m);margin-bottom:.6em}
h3:after{content:"";display:block;width:80px;height:3px;margin:10px auto;background:var(--g)}
.card{background:#fff;border-radius:22px;padding:28px;box-shadow:0 12px 35px #8b153822;border:1px solid #f0d9a8;flex:1}
.card small{color:var(--g);font-weight:600;letter-spacing:.1em}
.card h4{font-size:1.6rem;margin:.3em 0;color:var(--p)}.card em{color:#666}
.card.gold{background:linear-gradient(135deg,#fff3c9,#ffe0e8)}
.couple{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.heart{font-size:2.4rem;color:var(--p);animation:beat 1.2s infinite}
@keyframes beat{50%{transform:scale(1.35)}}
.grid2{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:18px}
.venue{margin-top:6px}
.rv{opacity:0;transform:translateY(40px);transition:all .9s ease}.rv.on{opacity:1;transform:none}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:26px}
.tile{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 6px 18px #0003;animation:up .6s both}
.tile img,.tile video{width:100%;height:100%;object-fit:cover;transition:.4s}.tile:hover img,.tile:hover video{transform:scale(1.1)}
.play{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:2rem;text-shadow:0 2px 8px #000}
.x{position:absolute;top:6px;right:6px;border:0;border-radius:50%;width:26px;height:26px;background:#000a;color:#fff;cursor:pointer}
.gallery{grid-auto-rows:190px}.tile:nth-child(4n+1){grid-row:span 2}
.hint{color:#999;grid-column:1/-1}
.fam{color:#c01818;font-weight:600}
.rsvp{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:24px 0}
.rsvp input,.rsvp select{padding:12px 16px;border:1px solid var(--g);border-radius:12px;font:inherit}
.lb{position:fixed;inset:0;background:#000d;z-index:100;display:grid;place-items:center;padding:20px}
.lb img,.lb video{max-width:100%;max-height:90vh;border-radius:12px}
.arch{width:min(300px,70vw);aspect-ratio:3/4;border-radius:999px 999px 24px 24px;overflow:hidden;border:5px solid var(--g);box-shadow:0 20px 50px #8b153877,0 0 0 10px #ffffff88;margin:18px 0 6px;animation:up 1s .3s both,float 6s ease-in-out 1.3s infinite}
.arch img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
@keyframes float{50%{transform:translateY(-10px)}}
.portrait{width:170px;height:170px;border-radius:50%;object-fit:cover;border:4px solid var(--g);box-shadow:0 8px 24px #8b153855,0 0 0 8px #fff3c9;margin-bottom:14px}
.tile img{object-position:50% 25%}
.btn.ghost{background:transparent;color:var(--m);border:2px solid var(--m);margin-left:10px;box-shadow:none}
.btn.ghost:hover{background:var(--m);color:#fff}
.cinema{position:relative;border-radius:20px;overflow:hidden;border:4px solid var(--g);box-shadow:0 25px 60px #8b153866,0 0 0 10px #fff3c9;background:#000;max-width:860px;margin:30px auto 24px}
.cinema video{display:block;width:100%;aspect-ratio:16/9;background:#000}
.badge{position:absolute;top:12px;right:12px;background:#000a;color:#fff;padding:3px 10px;border-radius:99px;font-size:.8rem;pointer-events:none}
footer{text-align:center;padding:40px;background:var(--m);color:#fff}
`;
