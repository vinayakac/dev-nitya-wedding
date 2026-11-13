"use client";
// Structure inspired by the Varumo "Anand Karaj" template: cover → countdown → programme → location → album → family → RSVP → blessing.
import { useEffect, useRef, useState } from "react";
import { Gate, Petals, Toran, Mandala, Orn, ScrollFx, Diyas, Burst, Words, Lines, LotusIcon, RingsIcon, CursorSparkle, effectsCss } from "./effects";

const WEDDING = new Date("2026-11-22T08:50:00+05:30");
const MAP = "https://maps.app.goo.gl/mmfsfrjDuyYL9R9R8?g_st=ic";
const PHONES = ["9611589187", "9611050890"];
const PHOTOS = { hero: "/photos/hero-couple.jpg", bride: "/photos/bride.jpg", groom: "/photos/groom-new.jpg", album: ["/photos/couple-new-1.jpg", "/photos/couple-new-2.jpg"], more: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/photos/g${n}.jpg`) };
const HAMPI_BG = ["/hampi/virupaksha.jpg", "/hampi/chariot.jpg", "/hampi/lotus.jpg", "/hampi/ganesha.jpg"];
// Pre-wedding memories shown in the album (landscape shots get a focus point so the couple stays in the 3:4 frame)
const MEMORIES = Array.from({ length: 22 }, (_, i) => ({
  id: "mem-" + (i + 1), type: "image", url: `/memories/m${String(i + 1).padStart(2, "0")}.jpg`,
  pos: { 15: "28% 50%", 16: "18% 50%", 20: "38% 50%" }[i] || undefined,
}));
const TEASER = { src: "/teaser-prewedding.mp4", poster: "/teaser-prewedding-poster.jpg" };

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

function Reveal({ children, delay = 0, from = "u" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"rv " + from + (on ? " on" : "")} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

const Head = ({ kn, en, sub }) => (
  <Reveal><div className="head"><small>{en}</small><h2>{kn}</h2>{sub && <p>{sub}</p>}</div></Reveal>
);

export default function Page() {
  const c = useCountdown();
  const [media, setMedia] = useState(MEMORIES);
  const [open, setOpen] = useState(null);
  const [rsvp, setRsvp] = useState({ name: "", guests: "1", yes: true, msg: "" });
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(0);
  const [playing, setPlaying] = useState(false);

// const [media, setMedia] = useState([]);
// const [open, setOpen] = useState(null);
const [galleryError, setGalleryError] = useState("");

useEffect(() => {
  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load gallery");
      }

      setMedia([...(data.media || []), ...MEMORIES]);
    } catch (error) {
      console.error("Gallery loading error:", error);
      /* keep showing the built-in memories */
    }
  };

  fetchGallery();
}, []);

  // const addFiles = (e) => {
  //   const files = Array.from(e.target.files || []);
  
  //   const items = files.map((f) => ({
  //     id: crypto.randomUUID(),
  //     type: f.type.startsWith("video/") ? "video" : "image",
  //     url: URL.createObjectURL(f),
  //   }));
  
  //   setMedia((prev) => [...items, ...prev]);
  
  //   e.target.value = "";
  // };

  const wa = rsvp.yes
    ? `ನಮಸ್ಕಾರ, ನಾನು ${rsvp.name} (${rsvp.guests} ಜನ) ಮದುವೆಗೆ ಬರುತ್ತೇವೆ 🙏 ${rsvp.msg}`
    : `ನಮಸ್ಕಾರ, ನಾನು ${rsvp.name}. ಕ್ಷಮಿಸಿ, ಮದುವೆಗೆ ಬರಲಾಗುತ್ತಿಲ್ಲ. ಶುಭಾಶಯಗಳು 🙏 ${rsvp.msg}`;

  return (
    <main className={opened ? "opened" : "pre"}>
      <style dangerouslySetInnerHTML={{ __html: css + effectsCss }} />
      <noscript><style>{".gate{display:none}.pre .ct>*{opacity:1!important}.rv{opacity:1!important;transform:none!important}"}</style></noscript>
      <Gate onOpen={() => setOpened(true)} />
      <ScrollFx />
      <CursorSparkle />

      <header className="cover">
        <Toran />
        <Petals kind="hero" />
        <div className="bgs">{HAMPI_BG.map((s, i) => <i key={s} style={{ backgroundImage: `url(${s})`, animationDelay: i * 7 + "s" }} />)}</div>
        <div className="ct">
          <div className="archwrap"><Mandala /><div className="arch"><img src={PHOTOS.hero} alt="Devaraj Nayak and Nithyashree" /></div></div>
          <p className="inv">॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರ ಪ್ರಸನ್ನ ॥ ॥ ಶ್ರೀ ಶಾಂಭವಿದೇವಿ ಪ್ರಸನ್ನ ॥</p>
          <p className="eyebrow">ಚಿಂಚರಕಿ ನಾಯಕ ಬಂಧುಗಳ ವಿವಾಹ ಆಹ್ವಾನ · A Wedding</p>
          <h1><span className="shn">Devaraj Nayak</span> <i>&amp;</i> <span className="shn">Nithyashree</span></h1>
          <h2 className="knn">ದೇವರಾಜ ನಾಯಕ <i>&amp;</i> ನಿತ್ಯಶ್ರೀ</h2>
          <p className="when">Sunday · 22 November 2026</p>
          <p className="where">ನಮೋ ವಾಟಿಕ ಕಲ್ಯಾಣ ಮಂಟಪ, ಸಿಂಧನೂರು</p>
          <p className="days"><span id="cd-days">{c ? (c.over ? "ಶುಭ ವಿವಾಹ" : c.d) : ""}</span> {c && !c.over ? "days · ಮಾಂಗಲ್ಯಧಾರಣ" : ""}</p>
          <p className="bless">ಶುಭ ವಿವಾಹ · A blissful union</p>
          <a href="#programme" className="btn">ಕಾರ್ಯಕ್ರಮಗಳು ↓</a>
        </div>
      </header>

      <div className="band">
        <i className="stars" />
        <section className="sec cd">
          <Head kn="ಎಣಿಕೆ ಆರಂಭ" en="The countdown begins" />
          <div id="cd-grid" className="count">
            {c && !c.over && [["ದಿನ", "Days", c.d, 0], ["ಗಂಟೆ", "Hours", c.h, 24], ["ನಿಮಿಷ", "Minutes", c.m, 60], ["ಸೆಕೆಂಡ್", "Seconds", c.s, 60]].map(([kn, en, v, max]) => (
              <div key={en} className={"box " + en.toLowerCase()}>
                <b key={v}>{String(v).padStart(2, "0")}</b>
                <span>{kn} · {en}</span>
                <i style={{ width: max ? (v / max) * 100 + "%" : "100%", transition: v === 0 ? "none" : undefined }} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="sec">
        <Words className="kn invite" text="ಸ್ವಸ್ತಿ ವಿಜಯಾಭ್ಯುದಯ ಶ್ರೀ ಮನ್ನೃಪ ಶಾಲಿವಾಹನಶಕೆ 1948ನೇ ಪರಾಭವನಾಮ ಸಂವತ್ಸರ ಕಾರ್ತಿಕ ಶು.12 ಶನಿವಾರ ದಿನಾಂಕ 21-11-2026 ರಂದು ಶ್ರೀ ಗುರುದೇವತಾಕಾರ್ಯ ಹಾಗೂ ಕಾರ್ತಿಕ ಶು.13 ರವಿವಾರ ದಿನಾಂಕ 22-11-2026 ರಂದು ಬೆಳಗ್ಗೆ 08:50 ರಿಂದ 09:56 ನಿಮಿಷದವರೆಗೆ ಸಲ್ಲುವ ಧನಸ್ಸು ಲಗ್ನದ ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಮಾಂಗಲ್ಯಧಾರಣ ವ ಅಕ್ಷತಾರೋಪಣ." />
        <Orn />
      </section>

      <section id="programme" className="sec">
        <Head kn="ಕಾರ್ಯಕ್ರಮಗಳ ಕ್ರಮ" en="ವಿವಾಹ · The programme" sub="Each rite, each blessing." />
        <div className="prog">
          <Reveal from="l"><div className="ev"><LotusIcon /><em>01</em><small>21 NOV · Saturday</small><h3>ಗುರುದೇವತಾ ಕಾರ್ಯ</h3><p>ಕಾರ್ತಿಕ ಶು.12 · Kartika Shu. 12</p></div></Reveal>
          <Reveal from="r" delay={150}><div className="ev gold"><RingsIcon /><em>02</em><small>22 NOV · Sunday</small><h3>ವಿವಾಹ ಮುಹೂರ್ತ</h3><p>ಬೆಳಗ್ಗೆ 08:50 – 09:56 · ಮಾಂಗಲ್ಯಧಾರಣ ವ ಅಕ್ಷತಾರೋಪಣ</p></div></Reveal>
        </div>
      </section>

      <section className="sec">
        <Head kn="ದಾರಿ ತೋರಿಸಿ" en="Location" />
        <Reveal from="z">
          <div className="venue"><div className="pin"><i /><i /><i /><b /></div><h3>ನಮೋ ವಾಟಿಕ ಕಲ್ಯಾಣ ಮಂಟಪ</h3>
            <p className="kn">ರಾಜಮಹಲ್ ಹತ್ತಿರ, ಗಂಗಾವತಿ ರಸ್ತೆ, ಸಿಂಧನೂರು, ರಾಯಚೂರು ಜಿಲ್ಲೆ</p>
            <a className="btn" href={MAP} target="_blank" rel="noreferrer">📍 Get directions</a></div>
        </Reveal>
      </section>

      <section id="teaser" className="sec">
        <Head kn="ಮದುವೆ ಟೀಸರ್" en="Wedding teaser" />
        <Reveal from="z">
          <div className="cinema"><span className={"pbtn" + (playing ? " hide" : "")}><i /></span><video poster={TEASER.poster} controls playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}><source src={TEASER.src} type="video/mp4" /></video><span className="badge">1:06</span></div>
          <p className="hint">A journey to forever — our pre-wedding story</p>
        </Reveal>
      </section>


   


      <section className="sec">
        <Head kn="ನಾವು ಪ್ರೀತಿಸುವವರು" en="The people we love" />
        <div className="duo">
          <Reveal from="l"><div className="pcard"><div className="pho"><img className="portrait" src={PHOTOS.groom} alt="Devaraj Nayak" style={{ objectPosition: "50% 30%" }} /></div><small>ವರ · Groom</small><h3>ಚಿ॥ ದೇವರಾಜ ನಾಯಕ</h3><em>B.E. (EIE)</em>
            <p className="kn">ಶ್ರೀಮತಿ ಗೌರಮ್ಮ ಶ್ರೀ ಹನುಮಂತ ನಾಯಕ ಚಿಂಚರಕಿ, ಸಾ॥ ಪುಲದಿನ್ನಿ ಇವರ ಏಕೈಕ ಸುಪುತ್ರ</p></div></Reveal>
          <Reveal from="r" delay={150}><div className="pcard"><div className="pho"><img className="portrait" src={PHOTOS.bride} alt="Nithyashree" style={{ objectPosition: "50% 18%" }} /></div><small>ವಧು · Bride</small><h3>ಚಿ॥ಕುಂ॥ಸೌ॥ ನಿತ್ಯಶ್ರೀ</h3><em>B.E. Civil</em>
            <p className="kn">ಶ್ರೀಮತಿ ಅನುಸುಯಾ ಶ್ರೀ ರಾಮಲಿಂಗಪ್ಪ ಸಾ॥ ಯರಂಗಳ್ಳಿ, ತಾ॥ ಕುರುಗೋಡು, ಜಿ॥ ಬಳ್ಳಾರಿ ಇವರ ತೃತೀಯ ಸುಪುತ್ರಿ</p></div></Reveal>
        </div>
        <Orn />
        <Lines className="kn fam" lines={["ತಮ್ಮ ಆಗಮನಾಭಿಲಾಷಿಗಳು", "ಶ್ರೀಮತಿ ಹಂಪಮ್ಮ ಗಂ.ದಿ॥ ಲಚುಮಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ", "ಶ್ರೀಮತಿ ದ್ಯಾವಮ್ಮ ಶ್ರೀ ಚೌಡಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ", "ಶ್ರೀಮತಿ ದೊಡ್ಡನಾಗಮ್ಮ ಶ್ರೀ ಸಾಬಯ್ಯ ನಾಯಕ ಚಿಂಚರಕಿ", "ಶ್ರೀಮತಿ ಸಣ್ಣನಾಗಮ್ಮ ಶ್ರೀ ಯಂಕೋಬ ನಾಯಕ ಚಿಂಚರಕಿ", "ಶ್ರೀಮತಿ ಗೌರಮ್ಮ ಶ್ರೀ ಹನುಮಂತ ನಾಯಕ ಚಿಂಚರಕಿ", "ಸಾ॥ ಪುಲದಿನ್ನಿ, ತಾ॥ ಸಿಂಧನೂರು, ಜಿ॥ ರಾಯಚೂರು"]} />
      </section>

      <section id="rsvp" className="sec rs">
        <Head kn="ದಯವಿಟ್ಟು ತಿಳಿಸಿ" en="Kindly respond" sub="Will you join us?" />
        <Reveal>
          <div className="togwrap">
            <div className={"toggle" + (rsvp.yes ? "" : " no")}>
              <span className="pill" />
              <button className={rsvp.yes ? "on" : ""} onClick={() => { setRsvp({ ...rsvp, yes: true }); setBurst((n) => n + 1); }}>✓ Joyfully accept</button>
              <button className={!rsvp.yes ? "on" : ""} onClick={() => setRsvp({ ...rsvp, yes: false })}>✗ Regretfully decline</button>
            </div>
            <Burst n={burst} />
          </div>
          <div className="rsvp">
            <input placeholder="Your name / ನಿಮ್ಮ ಹೆಸರು" value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} />
            {rsvp.yes && <select value={rsvp.guests} onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n > 1 ? "guests" : "guest"}</option>)}</select>}
            <input className="wide" placeholder="Message (optional) / ಸಂದೇಶ" value={rsvp.msg} onChange={(e) => setRsvp({ ...rsvp, msg: e.target.value })} />
            <a className={"btn" + (rsvp.name.trim() ? " ready" : "")} target="_blank" rel="noreferrer" href={`https://wa.me/91${PHONES[0]}?text=${encodeURIComponent(wa)}`}>Send via WhatsApp</a>
          </div>
        </Reveal>
      </section>
      <section className="sec album">
  <Head
    kn="ನೆನಪುಗಳು"
    en="The album"
    sub="Our portraits, mounted in cream"
  />


  {galleryError && (
    <p style={{ color: "red", marginTop: 15 }}>
      {galleryError}
    </p>
  )}

  {media.length === 0 && (
    <p className="hint" style={{ marginTop: 30 }}>
      Memories will appear here soon.
    </p>
  )}

  <div className="gallery">
    {media.map((m, i) => (
      <div
        key={m.id}
        className="mat"
        style={{
          "--r": [-1.6, 1.2, -0.8, 1.8][i % 4] + "deg",
          "--i": Math.min(i, 10),
        }}
        onClick={() => setOpen(m)}
      >
        {m.type === "video" ? (
          <video src={m.url} muted playsInline />
        ) : (
          <img src={m.url} alt="Wedding memory" loading="lazy" style={m.pos ? { objectPosition: m.pos } : undefined} />
        )}

        {m.type === "video" && (
          <span className="play">▶</span>
        )}

      </div>
    ))}
  </div>
</section>
      <footer>
        <Petals kind="foot" />
        <Diyas />
        <p className="kn big">ಶುಭಮಸ್ತು</p>
        <p>May this union be blessed.</p>
        <p className="nm">Devaraj Nayak · Nithyashree</p>
        <p className="ph">ಮೊ: {PHONES.map((p) => <a key={p} href={"tel:" + p}> {p} </a>)}</p>
        <p className="small">ಎರಡು ಮನಸ್ಸುಗಳ ಮಧುರ ಸಂಗಮಕ್ಕೆ,<br />ಹೊಸ ಬಾಳಿನ ಸುಂದರ ಆರಂಭಕ್ಕೆ…</p>
        <p className="small">ಪ್ರೀತಿಯಿಂದ ಬಂದು… ಮನದುಂಬಿ ಹಾರೈಸಿ.</p>
        <p className="small">ನಿಮ್ಮ ಆಗಮನದಿಂದ ನಮ್ಮ ಸಂಭ್ರಮ ಹೆಚ್ಚಲಿ,<br />ನಿಮ್ಮ ಆಶೀರ್ವಾದದಿಂದ ನಮ್ಮ ಬಾಳು ಬೆಳಗಲಿ.<br />ನಿಮ್ಮ ಪ್ರೀತಿ ಮತ್ತು ಹಾರೈಕೆಗಳೊಂದಿಗೆ<br />ಈ ಶುಭ ಕ್ಷಣವನ್ನು ಇನ್ನಷ್ಟು ಸ್ಮರಣೀಯವಾಗಿಸೋಣ.</p>
        <p className="small">ತಪ್ಪದೇ ಬಂದು ನಮ್ಮನ್ನು ಹರಸಿ.</p>
      </footer>

      {open && (<div className="lb" onClick={() => setOpen(null)}>{open.type === "video" ? <video src={open.url} controls autoPlay /> : <img src={open.url} alt="" />}</div>)}
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Noto+Sans+Kannada:wght@400;600;800&display=swap');
:root{--b:#bc4330;--d:#7a2418;--g:#c9a227;--cr:#fbf3e4;--ink:#3a1a12}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--cr);color:var(--ink);font-family:'Noto Sans Kannada',sans-serif}
main{overflow-x:hidden}.kn{line-height:1.9}
.cover{position:relative;min-height:100svh;display:grid;place-items:center;text-align:center;color:#fff;padding:70px 20px 90px;overflow:hidden;isolation:isolate}
.bgs{position:absolute;inset:0;z-index:-2;background:#2a0a06}.bgs i{position:absolute;inset:0;background-size:cover;background-position:50% 50%;opacity:0;animation:slide 28s linear infinite}
@keyframes slide{0%{opacity:0;transform:scale(1)}6%{opacity:1}25%{opacity:1}32%{opacity:0;transform:scale(1.13)}100%{opacity:0}}
.arch{width:min(210px,52vw);aspect-ratio:3/4;margin:0 auto;border-radius:999px 999px 18px 18px;overflow:hidden;border:4px solid #f3c75a;box-shadow:0 18px 44px #000a,0 0 0 8px #ffffff40}
.arch img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block}
.cover:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(#4a130ccc,#7a241880 45%,#2a0a06ee)}
@keyframes zoom{to{transform:scale(1.12)}}
@keyframes up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.inv{color:#ffe3a3;font-size:.85rem;margin:0 0 18px}.eyebrow{letter-spacing:.14em;font-size:.85rem;margin:0}
.cover h1{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(2.6rem,10vw,6rem);margin:.25em 0 0;line-height:1.05}
.cover i{color:#f3c75a;font-weight:500}
.knn{font-size:clamp(1.5rem,5.5vw,2.6rem);margin:.1em 0 .6em;color:#ffd9c9;font-weight:800}
.when{font-family:'Playfair Display',serif;font-size:1.3rem;letter-spacing:.12em;margin:.3em 0 0}.where{margin:.2em 0 1em;opacity:.92}
.days{font-weight:700;color:#f3c75a;margin:.4em 0}.bless{letter-spacing:.2em;font-size:.8rem;opacity:.85;margin:0 0 22px}
.btn{display:inline-block;background:var(--b);color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;border:0;cursor:pointer;font:inherit;font-weight:600;transition:.3s}
.btn:hover{background:var(--d);transform:translateY(-2px)}.cover .btn{background:#fff;color:var(--d)}
.btn.ghost{background:transparent;color:var(--b);border:2px solid var(--b)}.btn.ghost:hover{background:var(--b);color:#fff}
.sec{max-width:940px;margin:0 auto;padding:64px 20px;text-align:center}
.head{margin-bottom:28px}.head small{display:block;color:var(--g);letter-spacing:.22em;text-transform:uppercase;font-size:.78rem;font-weight:600}
.head h2{font-size:clamp(1.6rem,5vw,2.3rem);color:var(--b);margin:.2em 0}.head h2:after{content:"";display:block;width:70px;height:3px;background:var(--g);margin:12px auto 0}
.head p{color:#8a5a4a;margin:.6em 0 0;font-style:italic}
.invite{font-size:1.05rem;color:#5a2a1e;max-width:760px;margin:0 auto}
.count{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}.box{background:#fffaf0;border:1px solid #e6cf9a;border-radius:6px;padding:16px 20px;min-width:110px;box-shadow:0 8px 22px #7a241822}
.box b{display:block;font-family:'Playfair Display',serif;font-size:2.4rem;color:var(--b)}.box span{font-size:.75rem;color:#8a6a5a}
.prog{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;text-align:left}
.ev{position:relative;background:#fffaf0;border:1px solid #e6cf9a;border-radius:6px;padding:28px 26px;box-shadow:0 10px 28px #7a241822;height:100%}
.ev em{position:absolute;right:20px;top:8px;font:700 3rem 'Playfair Display',serif;color:#bc433026;font-style:normal}
.ev small{color:var(--g);font-weight:600;letter-spacing:.12em}.ev h3{margin:.4em 0;font-size:1.4rem;color:var(--b)}.ev p{margin:0;color:#6a4a3e}
.ev.gold{background:linear-gradient(135deg,#fff3d0,#ffe3d6)}
.venue h3{font-size:1.5rem;color:var(--b);margin:0 0 .2em}
.cinema{position:relative;border-radius:8px;overflow:hidden;border:6px solid #fffaf0;box-shadow:0 20px 50px #7a241855;background:#000;max-width:820px;margin:0 auto 18px}
.cinema video{display:block;width:100%;aspect-ratio:16/9}.badge{position:absolute;top:12px;right:12px;background:#000a;color:#fff;padding:3px 10px;border-radius:99px;font-size:.8rem}
.hint{color:#9a7a6a}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:22px;margin-top:30px}
.mat{position:relative;background:#fffaf0;padding:10px 10px 30px;box-shadow:0 8px 20px #7a241833;cursor:pointer;transform:rotate(var(--r));transition:.35s}
.mat:hover{transform:rotate(0) scale(1.04);z-index:2}.mat img,.mat video{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 25%}
.play{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:2rem;text-shadow:0 2px 8px #000}
.mat {
  position: relative;
}

.mat .x {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: #7a2418;
  color: white;
  font-size: 21px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: auto;
  opacity: 1;
  transition: background 0.2s, transform 0.2s;
}

.mat .x:hover {
  background: #bc4330;
  transform: scale(1.12);
}
.duo{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.pcard{background:#fffaf0;border:1px solid #e6cf9a;border-radius:6px;padding:28px;box-shadow:0 10px 28px #7a241822;height:100%}
.portrait{width:160px;height:160px;border-radius:50%;object-fit:cover;border:4px solid var(--g);margin-bottom:12px}
.pcard small{display:block;color:var(--g);font-weight:600;letter-spacing:.1em}.pcard h3{font-size:1.5rem;margin:.3em 0;color:var(--b)}.pcard em{color:#8a6a5a}
.fam{margin-top:34px;color:#b01818;font-weight:600}
.toggle{display:inline-flex;border:2px solid var(--b);border-radius:999px;overflow:hidden;margin-bottom:20px}
.toggle button{border:0;background:transparent;padding:10px 22px;font:inherit;font-weight:600;color:var(--b);cursor:pointer}.toggle button.on{background:var(--b);color:#fff}
.rsvp{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.rsvp input,.rsvp select{padding:12px 16px;border:1px solid #d9b87a;border-radius:8px;font:inherit;background:#fffaf0}.rsvp .wide{flex:1 1 100%;max-width:520px}
footer{background:linear-gradient(#7a2418ee,#3a0e08f2),url(/hampi/virupaksha.jpg) 50% 40%/cover;color:#ffeed0;text-align:center;padding:56px 20px}footer .big{font-size:2rem;margin:0;color:#f3c75a;font-weight:800}
footer .nm{font-family:'Playfair Display',serif;font-size:1.4rem;letter-spacing:.1em}footer a{color:#ffd980}footer .small{opacity:.8;margin-top:22px}
.rv{opacity:0;transform:translateY(34px);transition:all .9s ease}.rv.on{opacity:1;transform:none}
.lb{position:fixed;inset:0;background:#000d;z-index:100;display:grid;place-items:center;padding:20px}.lb img,.lb video{max-width:100%;max-height:90vh;border-radius:6px}
`;