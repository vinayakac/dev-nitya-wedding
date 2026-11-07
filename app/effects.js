"use client";
// Animated effects for the invitation: opening gate, marigold toran, falling petals,
// spinning mandala, drawing ornaments, diyas, scroll progress and an RSVP petal burst.
// Everything is pure React + CSS (no extra packages) and respects prefers-reduced-motion.
import { useEffect, useRef, useState } from "react";

/* ───────── Opening gate: two temple doors that part to reveal the invitation ───────── */
export function Gate({ onOpen }) {
  const [st, setSt] = useState("closed"); // closed → opening → gone
  const started = useRef(false);

  const open = () => {
    if (started.current) return;
    started.current = true;
    setSt("opening");
    setTimeout(onOpen, 450);
    setTimeout(() => setSt("gone"), 1900);
  };

  useEffect(() => {
    const skip =
      window.scrollY > 40 ||
      window.location.hash ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) {
      started.current = true;
      setSt("gone");
      onOpen();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(open, 1900);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (st === "gone") document.body.style.overflow = "";
  }, [st]);

  if (st === "gone") return null;
  return (
    <div className={"gate " + st} onClick={open} aria-hidden="true">
      <i className="door l" />
      <i className="door r" />
      <div className="seal">
        <div className="sealin">
          <span className="sr" />
          <b>ಶ್ರೀ</b>
          <small>ವಿವಾಹ ಆಹ್ವಾನ</small>
          <em>ದೇವರಾಜ &amp; ನಿತ್ಯಶ್ರೀ</em>
        </div>
      </div>
    </div>
  );
}

/* ───────── Falling marigold petals + twinkling glints ───────── */
export function Petals({ kind = "hero" }) {
  const ref = useRef(null);
  const [state, setState] = useState({ petals: [], sparks: [], fh: 800 });

  useEffect(() => {
    const r = (a, b) => a + Math.random() * (b - a);
    const narrow = window.innerWidth < 640;
    const n = kind === "hero" ? (narrow ? 14 : 24) : narrow ? 8 : 14;
    const petals = Array.from({ length: n }, (_, i) => ({
      id: i, left: r(0, 100), size: r(9, 19), dur: r(10, 19), delay: r(-19, 0), sway: r(26, 80), spin: r(200, 560), hue: i % 3,
    }));
    const sparks =
      kind === "hero"
        ? Array.from({ length: narrow ? 10 : 18 }, (_, i) => ({
            id: i, left: r(2, 98), top: r(4, 92), size: r(5, 11), dur: r(2.6, 5.2), delay: r(-5, 0),
          }))
        : [];
    const fh = ref.current?.parentElement?.offsetHeight || 800;
    setState({ petals, sparks, fh });
  }, [kind]);

  return (
    <div ref={ref} className={"petals " + kind} aria-hidden="true" style={{ "--fh": state.fh + "px" }}>
      {state.sparks.map((s) => (
        <span key={"s" + s.id} className="sp" style={{ left: s.left + "%", top: s.top + "%", "--s": s.size + "px", "--dur": s.dur + "s", "--dl": s.delay + "s" }} />
      ))}
      {state.petals.map((p) => (
        <span key={p.id} className="pt" style={{ left: p.left + "%", "--s": p.size + "px", "--dur": p.dur + "s", "--dl": p.delay + "s", "--sw": p.sway + "px", "--sp": p.spin + "deg" }}>
          <i className={"c" + p.hue} />
        </span>
      ))}
    </div>
  );
}

/* ───────── Swaying marigold toran hanging across the top of the hero ───────── */
export function Toran() {
  const N = 17;
  return (
    <div className="toran" aria-hidden="true">
      <div className="rope" />
      <div className="strands">
        {Array.from({ length: N }, (_, i) => {
          const mid = 1 - Math.abs(i - (N - 1) / 2) / ((N - 1) / 2); // 0 at the edges → 1 in the centre
          const h = Math.round((30 + (i % 2 ? 15 : 0) + mid * 30) / 15) * 15;
          return (
            <span key={i} className="st" style={{ "--h": h + "px", "--d": ((i * 0.31) % 2.4) + "s", "--a": (i % 2 ? 2.4 : -2.4) + "deg" }}>
              <u />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Slowly counter-rotating mandala behind the couple's portrait ───────── */
export function Mandala() {
  const ring = (n, cy, rx, ry) =>
    Array.from({ length: n }, (_, i) => <ellipse key={i} cx="0" cy={cy} rx={rx} ry={ry} transform={`rotate(${(360 / n) * i})`} />);
  return (
    <svg className="mandala" viewBox="-100 -100 200 200" aria-hidden="true">
      <g className="m1" fill="none" stroke="#f3c75a" strokeWidth=".7">
        <circle r="97" strokeDasharray="1 3.2" />
        <circle r="91" />
        {ring(24, -79, 4.2, 10)}
      </g>
      <g className="m2" fill="#f3c75a1c" stroke="#ffe3a3" strokeWidth=".6">
        {ring(12, -65, 8, 17)}
        <circle r="49" fill="none" strokeDasharray="6 4" />
      </g>
    </svg>
  );
}

/* ───────── Ornamental divider that draws itself and blooms when scrolled into view ───────── */
export function Orn() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"orn" + (on ? " on" : "")} aria-hidden="true">
      <svg viewBox="0 0 260 30">
        <path className="ln" d="M108 15H8" />
        <path className="ln" d="M152 15H252" />
        <circle className="dt" cx="116" cy="15" r="1.8" />
        <circle className="dt" cx="144" cy="15" r="1.8" />
        <g transform="translate(130 15)">
          <g className="fl">
            {[0, 45, 90, 135].map((a) => (
              <ellipse key={a} rx="4" ry="12" transform={`rotate(${a})`} />
            ))}
            <circle className="core" r="3.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ───────── Row of flickering diyas for the footer ───────── */
export function Diyas() {
  return (
    <div className="diyas" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="diya" style={{ "--f": i * 0.37 + "s" }}>
          <i />
        </span>
      ))}
    </div>
  );
}

/* ───────── Petal burst that answers the "Joyfully accept" tap ───────── */
export function Burst({ n }) {
  if (!n) return null;
  return (
    <div key={n} className="burst" aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        const d = 64 + (i % 3) * 34;
        return <span key={i} className={"b" + (i % 3)} style={{ "--dx": Math.cos(a) * d + "px", "--dy": Math.sin(a) * d * 0.8 - 26 + "px", "--rot": i * 47 + "deg" }} />;
      })}
    </div>
  );
}

/* ───────── Gold scroll-progress line + hero parallax ───────── */
export function ScrollFx() {
  const bar = useRef(null);
  useEffect(() => {
    const cover = document.querySelector(".cover");
    let raf = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (cover && y < cover.offsetHeight * 1.2) {
        cover.style.setProperty("--py", Math.min(y * 0.22, cover.offsetHeight * 0.16) + "px");
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="sbar" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}

/* ───────── Words fade in one by one (blur → sharp) ───────── */
export function Words({ text, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <p ref={ref} className={"wd " + className + (on ? " on" : "")}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span style={{ "--w": Math.min(i, 80) }}>{w}</span>{" "}
        </span>
      ))}
    </p>
  );
}

/* ───────── Lines glide in one after another ───────── */
export function Lines({ lines, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <p ref={ref} className={"lns " + className + (on ? " on" : "")}>
      {lines.map((t, i) => (
        <span key={i} className={i % 2 ? "ln2 odd" : "ln2"} style={{ "--k": i }}>{t}</span>
      ))}
    </p>
  );
}

/* ───────── Programme icons that bloom / draw when revealed ───────── */
export function LotusIcon() {
  return (
    <svg className="evi" viewBox="0 0 48 48" aria-hidden="true">
      {[-64, -32, 0, 32, 64].map((a, k) => (
        <g key={a} transform={`rotate(${a} 24 40)`}>
          <ellipse className="pt2" style={{ "--k": Math.abs(k - 2) === 0 ? 3 : 2 - Math.abs(k - 2) }} cx="24" cy="26" rx="5.5" ry="14" />
        </g>
      ))}
      <path d="M12 42h24" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function RingsIcon() {
  return (
    <svg className="evi" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="rg" cx="18" cy="29" r="11" />
      <circle className="rg b" cx="30" cy="29" r="11" />
      <polygon className="gem" points="24,3 28,9 24,15 20,9" />
    </svg>
  );
}

/* ───────── Gold sparkle trail that follows the mouse (desktop only) ───────── */
export function CursorSparkle() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    const mv = (e) => {
      const t = performance.now();
      if (t - last < 45 || !ref.current) return;
      last = t;
      const el = document.createElement("i");
      el.className = "cs";
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.setProperty("--dx", Math.random() * 30 - 15 + "px");
      el.style.setProperty("--s", 5 + Math.random() * 7 + "px");
      ref.current.appendChild(el);
      setTimeout(() => el.remove(), 900);
    };
    window.addEventListener("pointermove", mv);
    return () => window.removeEventListener("pointermove", mv);
  }, []);
  return <div ref={ref} className="cursor-sp" aria-hidden="true" />;
}

/* ───────── CSS (appended after the base stylesheet, so it wins on equal specificity) ───────── */
const heroDelays = Array.from({ length: 9 }, (_, i) => `.opened .ct>:nth-child(${i + 2}){animation-delay:${(0.7 + i * 0.12).toFixed(2)}s}`).join("");

export const effectsCss = `
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shine{from{background-position:100% 0}to{background-position:0 0}}

/* —— opening gate —— */
.gate{position:fixed;inset:0;z-index:200;display:grid;place-items:center;overflow:hidden;cursor:pointer}
.gate .door{position:absolute;top:0;bottom:0;width:50.5%;background:radial-gradient(circle,#c9a22740 0 2px,transparent 3px) 0 0/26px 26px,linear-gradient(#6b1c11,#3a0e08);transition:transform 1.35s cubic-bezier(.75,0,.2,1)}
.gate .l{left:0;border-right:3px solid #c9a227;box-shadow:inset -22px 0 46px #000a}
.gate .r{right:0;border-left:3px solid #c9a227;box-shadow:inset 22px 0 46px #000a}
.gate.opening .l{transform:translateX(-101%)}.gate.opening .r{transform:translateX(101%)}
.seal{position:relative;z-index:2;width:min(250px,64vw);aspect-ratio:1;transition:transform 1s cubic-bezier(.6,0,.3,1),opacity .8s}
.gate.opening .seal{transform:scale(1.55);opacity:0}
.sealin{position:relative;width:100%;height:100%;border-radius:50%;display:grid;place-content:center;text-align:center;color:#ffe3a3;background:radial-gradient(circle,#8a2a1c 0,#4a130c 72%);border:3px solid #f3c75a;box-shadow:0 0 0 8px #3a0e08,0 0 0 10px #c9a227,0 0 60px #f3c75a55;animation:sealIn 1.1s .1s cubic-bezier(.2,.9,.3,1.25) both,sealGlow 2.6s 1.2s ease-in-out infinite}
.sealin .sr{position:absolute;inset:10px;border:2px dashed #f3c75a99;border-radius:50%;animation:spin 16s linear infinite}
.sealin b{font-size:clamp(2.8rem,14vw,3.8rem);line-height:1.2;color:#f3c75a;text-shadow:0 0 22px #f3c75aaa}
.sealin small{font-size:.9rem;opacity:.9;margin-top:2px}.sealin em{font-style:normal;font-size:.85rem;margin-top:6px;color:#ffd9c9}
@keyframes sealIn{from{opacity:0;transform:scale(.4) rotate(-40deg)}to{opacity:1;transform:none}}
@keyframes sealGlow{0%,100%{box-shadow:0 0 0 8px #3a0e08,0 0 0 10px #c9a227,0 0 40px #f3c75a44}50%{box-shadow:0 0 0 8px #3a0e08,0 0 0 10px #c9a227,0 0 90px #f3c75acc}}

/* —— scroll progress —— */
.sbar{position:fixed;top:0;left:0;right:0;height:3px;z-index:150;pointer-events:none}
.sbar i{display:block;height:100%;transform:scaleX(0);transform-origin:0 50%;background:linear-gradient(90deg,#c9a227,#ffe08a,#bc4330)}

/* —— hero —— */
.cover{padding-top:140px}
.bgs{inset:-18% 0 0;transform:translate3d(0,var(--py,0px),0);will-change:transform}
.cover:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:20px;z-index:2;background:radial-gradient(circle at 14px 20px,var(--cr) 0 13px,transparent 13.5px) 0 0/28px 20px repeat-x}
.ct{position:relative;z-index:2}
.pre .ct>*{animation:none;opacity:0}
.opened .ct>*{animation:up 1s both}
${heroDelays}
.archwrap{position:relative;width:min(210px,52vw);margin:0 auto 18px}
.archwrap .arch{margin:0 auto;width:100%}
.archwrap:before{content:"";position:absolute;inset:-34%;z-index:-1;background:radial-gradient(circle,#f3c75a55,transparent 62%);animation:halo 4.5s ease-in-out infinite}
.mandala{position:absolute;left:50%;top:50%;width:190%;aspect-ratio:1;transform:translate(-50%,-50%);z-index:-1;opacity:.75;pointer-events:none}
.mandala .m1{animation:spin 70s linear infinite}.mandala .m2{animation:spin 45s linear infinite reverse}
.opened .ct>.archwrap{animation:archIn 1.6s cubic-bezier(.2,.8,.2,1) both}
@keyframes archIn{from{opacity:0;transform:scale(.55) translateY(30px);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes halo{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.06)}}
.shn{display:inline-block;background:linear-gradient(100deg,#fff 0,#fff 35%,#ffd86a 47%,#fff6d0 50%,#ffd86a 53%,#fff 65%,#fff 100%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.opened .shn{animation:shine 7s 3s linear infinite}
.cover h1 i,.knn i{display:inline-block;animation:beat 2.4s ease-in-out infinite}
.opened .cover .ct>h1{animation:trackin 1.8s .95s cubic-bezier(.2,.8,.2,1) both}
@keyframes trackin{from{opacity:0;letter-spacing:.12em;filter:blur(8px);transform:translateY(14px)}to{opacity:1;letter-spacing:0;filter:blur(0);transform:none}}
@keyframes beat{0%,100%{transform:scale(1)}14%{transform:scale(1.28)}28%{transform:scale(1)}42%{transform:scale(1.16)}56%{transform:scale(1)}}
.opened .cover .btn{box-shadow:0 0 0 0 #ffffff88;animation:up 1s 1.7s both,ring 2.6s 3s ease-out infinite}
@keyframes ring{0%{box-shadow:0 0 0 0 #ffffff77}70%,100%{box-shadow:0 0 0 16px #ffffff00}}

/* —— petals and glints —— */
.petals{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
.pt{position:absolute;top:0;width:var(--s);height:var(--s);animation:fall var(--dur) var(--dl) linear infinite;will-change:transform}
.pt i{display:block;width:100%;height:100%;border-radius:150% 0 150% 0;animation:sway calc(var(--dur) / 3.4) ease-in-out infinite alternate;box-shadow:inset -2px -2px 4px #0003}
.pt i.c0{background:linear-gradient(135deg,#ffd24d,#f28a12)}.pt i.c1{background:linear-gradient(135deg,#ffb347,#e2571b)}.pt i.c2{background:linear-gradient(135deg,#ff9bb0,#d63a5e)}
@keyframes fall{from{transform:translateY(-8%)}to{transform:translateY(calc(var(--fh) + 30px))}}
@keyframes sway{from{transform:translateX(calc(var(--sw) * -1)) rotate(0deg)}to{transform:translateX(var(--sw)) rotate(var(--sp))}}
.sp{position:absolute;width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(circle,#fff 0 22%,#ffe9a666 40%,transparent 68%);animation:twinkle var(--dur) var(--dl) ease-in-out infinite}
.sp:before,.sp:after{content:"";position:absolute;left:50%;top:50%;background:#fff;border-radius:2px;transform:translate(-50%,-50%)}
.sp:before{width:240%;height:1.5px}.sp:after{width:1.5px;height:240%}
@keyframes twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.petals.foot{z-index:0}

/* —— toran —— */
.toran{position:absolute;top:0;left:0;right:0;z-index:3;pointer-events:none}
.rope{height:18px;background:radial-gradient(circle,#ffbd1f 0 5px,#e8730c 5.5px 7px,transparent 7.5px) 0 0/18px 18px repeat-x;filter:drop-shadow(0 3px 3px #0007)}
.strands{display:flex;justify-content:space-between;padding:0 6px;margin-top:-3px}
.st{position:relative;display:block;width:14px;height:var(--h);transform-origin:50% 0;animation:swing 3.4s var(--d) ease-in-out infinite alternate;background:radial-gradient(circle at 50% 7.5px,#ffc02e 0 5px,#ea7a10 5.5px 6.6px,transparent 7px) 0 0/14px 15px repeat-y;filter:drop-shadow(0 2px 2px #0006)}
.st u{position:absolute;left:50%;bottom:-15px;width:13px;height:16px;margin-left:-6.5px;background:linear-gradient(90deg,#c9a227,#ffe9a0 45%,#b98418);border-radius:50% 50% 2px 2px/75% 75% 2px 2px}
.st u:after{content:"";position:absolute;left:50%;bottom:-3px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:#ffe9a0}
@keyframes swing{from{transform:rotate(var(--a))}to{transform:rotate(calc(var(--a) * -1))}}

/* —— scallops, buttons, headings —— */
.btn{position:relative;overflow:hidden}
.btn:after{content:"";position:absolute;top:0;left:-80%;width:45%;height:100%;background:linear-gradient(100deg,transparent,#ffffff77,transparent);transform:skewX(-20deg);animation:btnShine 4s 2.5s ease-in-out infinite;pointer-events:none}
@keyframes btnShine{0%,55%{left:-80%}100%{left:150%}}
.rv{opacity:0;transform:translateY(34px);transition:opacity .9s ease,transform 1s cubic-bezier(.2,.7,.2,1)}
.rv.l{transform:translateX(-64px)}.rv.r{transform:translateX(64px)}.rv.z{transform:scale(.86)}
.rv.on{opacity:1;transform:none}
.rv .head h2:after{width:0;transition:width 1.1s .55s ease}
.rv.on .head h2:after{width:70px}
.rv .head small{opacity:0;transform:translateY(-8px);transition:all .8s .2s ease}
.rv.on .head small{opacity:1;transform:none}

/* —— ornament divider —— */
.orn{padding:6px 0 0}
.orn svg{width:min(260px,70%);height:auto;overflow:visible}
.orn .ln{fill:none;stroke:#c9a227;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;transition:stroke-dashoffset 1.3s .5s ease}
.orn.on .ln{stroke-dashoffset:0}
.orn .dt{fill:#c9a227;opacity:0;transition:opacity .6s 1.4s}.orn.on .dt{opacity:1}
.orn .fl{transform-box:fill-box;transform-origin:center;transform:scale(0) rotate(-120deg);transition:transform 1.1s cubic-bezier(.3,1.4,.4,1)}
.orn.on .fl{transform:none;animation:spin 26s 1.2s linear infinite}
.orn .fl ellipse{fill:#f3c75a40;stroke:#c9a227;stroke-width:1}.orn .core{fill:#bc4330}

/* —— countdown band —— */
.band{position:relative;background:radial-gradient(ellipse at 50% 0,#a8402b 0,transparent 62%),linear-gradient(#5a170e,#34100a);color:#ffeed0;margin-top:26px;overflow:hidden}
.band:before,.band:after{content:"";position:absolute;left:0;right:0;height:20px;z-index:2}
.band:before{top:-1px;background:radial-gradient(circle at 14px 0,var(--cr) 0 13px,transparent 13.5px) 0 0/28px 20px repeat-x}
.band:after{bottom:-1px;background:radial-gradient(circle at 14px 20px,var(--cr) 0 13px,transparent 13.5px) 0 0/28px 20px repeat-x}
.band .stars{position:absolute;inset:0;background-image:radial-gradient(#ffe3a3 1px,transparent 1.6px),radial-gradient(#fff 1px,transparent 1.6px);background-size:90px 90px,140px 140px;background-position:0 0,45px 60px;animation:starfield 5s ease-in-out infinite alternate}
@keyframes starfield{from{opacity:.15}to{opacity:.5}}
.band .sec{position:relative;z-index:1;padding:78px 20px 84px}
.band .head h2{color:#f3c75a}.band .head small{color:#ffd9a0}
.band .box{position:relative;overflow:hidden;perspective:300px;background:#ffffff12;border:1px solid #f3c75a88;color:#ffeed0;box-shadow:0 10px 30px #0006,inset 0 0 24px #f3c75a14;backdrop-filter:blur(3px)}
.band .box b{color:#ffe08a;text-shadow:0 0 20px #f3c75a88}.band .box span{color:#ffd9c9}
.box b{animation:tick .6s cubic-bezier(.3,1.3,.5,1)}
@keyframes tick{from{opacity:0;transform:translateY(-45%) rotateX(80deg)}to{opacity:1;transform:none}}
.box i{position:absolute;left:0;bottom:0;height:3px;background:linear-gradient(90deg,#c9a227,#ffe08a);transition:width 1s linear}
.box.seconds{animation:pulse 1s ease-in-out infinite}
@keyframes pulse{0%,100%{box-shadow:0 10px 30px #0006,inset 0 0 24px #f3c75a14}50%{box-shadow:0 10px 30px #0006,0 0 28px #f3c75a55,inset 0 0 24px #f3c75a30}}

/* —— programme, venue, teaser, people —— */
.ev{overflow:hidden;transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s}
.ev:hover{transform:translateY(-7px);box-shadow:0 20px 40px #7a241838}
.ev:before{content:"";position:absolute;left:0;top:0;height:3px;width:100%;background:linear-gradient(90deg,#c9a227,#ffe08a,#c9a227);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s .5s ease}
.rv.on .ev:before{transform:scaleX(1)}
.ev.gold:after{content:"";position:absolute;top:0;left:-70%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#ffffffaa,transparent);transform:skewX(-20deg);animation:sweep 5.5s 1.5s ease-in-out infinite;pointer-events:none}
@keyframes sweep{0%,50%{left:-70%}100%{left:160%}}
.venue{display:inline-block;max-width:600px;padding:30px 34px 34px;background:#fffaf0;border:1px solid #e6cf9a;border-radius:6px;box-shadow:0 12px 32px #7a241822}
.venue h3{margin-top:0}
.pin{position:relative;width:48px;height:48px;margin:0 auto 12px}
.pin i{position:absolute;inset:0;border-radius:50%;border:2px solid var(--b);opacity:0;animation:ripple 2.6s ease-out infinite}
.pin i:nth-child(2){animation-delay:.85s}.pin i:nth-child(3){animation-delay:1.7s}
.pin b{position:absolute;left:50%;top:50%;width:20px;height:20px;margin:-12px 0 0 -10px;background:var(--b);border-radius:50% 50% 50% 0;transform:rotate(-45deg);animation:pinHop 1.6s ease-in-out infinite}
.pin b:after{content:"";position:absolute;inset:6px;border-radius:50%;background:#fffaf0}
@keyframes ripple{from{transform:scale(.3);opacity:.75}to{transform:scale(1.5);opacity:0}}
@keyframes pinHop{0%,100%{transform:rotate(-45deg) translate(0,0)}50%{transform:rotate(-45deg) translate(5px,-5px)}}
.cinema{padding:6px;border:0;background:#fffaf0}
.cinema:before{content:"";position:absolute;inset:-60%;background:conic-gradient(from 0deg,transparent 0 62%,#c9a227 80%,#fff0b8 88%,transparent 100%);animation:spin 7s linear infinite}
.cinema video,.cinema .badge{position:relative;z-index:1}.cinema .badge{position:absolute;z-index:2}
.cinema video{border-radius:3px}
.pho{position:relative;width:176px;height:176px;margin:0 auto 14px}
.pho:before{content:"";position:absolute;inset:-9px;border-radius:50%;border:2px dashed #c9a227;animation:spin 20s linear infinite}
.pho:after{content:"";position:absolute;inset:-2px;border-radius:50%;box-shadow:0 0 0 0 #c9a22766;animation:ringPulse 3.4s ease-out infinite}
.pho .portrait{width:100%;height:100%;margin:0;display:block;transition:transform .6s ease}
.pcard:hover .portrait{transform:scale(1.06)}
@keyframes ringPulse{0%{box-shadow:0 0 0 0 #c9a22777}80%,100%{box-shadow:0 0 0 22px #c9a22700}}
.pcard{transition:transform .5s cubic-bezier(.2,.7,.2,1),box-shadow .5s}
.pcard:hover{transform:translateY(-6px);box-shadow:0 20px 40px #7a241838}
.duo .rv .pcard{animation:floaty 7s ease-in-out infinite}.duo .rv.r .pcard{animation-delay:-3.5s}
@keyframes floaty{0%,100%{translate:0 0}50%{translate:0 -7px}}

/* —— RSVP —— */
.togwrap{position:relative;display:inline-block;margin-bottom:20px}
.togwrap .toggle{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;margin-bottom:0}
.toggle .pill{position:absolute;top:0;bottom:0;left:0;width:50%;background:var(--b);transition:transform .5s cubic-bezier(.6,0,.2,1)}
.toggle.no .pill{transform:translateX(100%)}
.toggle button{position:relative;z-index:1;transition:color .35s}.toggle button.on{background:transparent;color:#fff}
.burst{position:absolute;left:25%;top:50%;pointer-events:none;z-index:5}
.burst span{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:150% 0 150% 0;animation:bst 1.3s cubic-bezier(.2,.7,.3,1) forwards}
.burst .b0{background:#ffb81c}.burst .b1{background:#e8730c}.burst .b2{background:#d63a5e}
@keyframes bst{from{opacity:1;transform:translate(0,0) scale(.3) rotate(0)}65%{opacity:1}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.25) rotate(var(--rot))}}
.rsvp input,.rsvp select{transition:border-color .25s,box-shadow .25s}
.rsvp input:focus,.rsvp select:focus{outline:none;border-color:var(--g);box-shadow:0 0 0 4px #c9a22733}

/* —— gallery + lightbox —— */
.mat{animation:pop .8s calc(var(--i, 0) * 90ms) cubic-bezier(.2,.7,.2,1) backwards;overflow:hidden}
.mat:after{content:"";position:absolute;top:0;left:-80%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#ffffff66,transparent);transform:skewX(-20deg);pointer-events:none}
.mat:hover:after{left:140%;transition:left .9s ease}
@keyframes pop{from{opacity:0;transform:translateY(34px) rotate(calc(var(--r) * 3)) scale(.88)}}
.lb{animation:fadeIn .3s ease}.lb img,.lb video{animation:zoomIn .45s cubic-bezier(.2,.8,.2,1)}
@keyframes fadeIn{from{opacity:0}}@keyframes zoomIn{from{opacity:0;transform:scale(.85)}}

/* —— footer —— */
footer{position:relative;overflow:hidden}
footer>*:not(.petals){position:relative;z-index:1}
footer .big{background:linear-gradient(100deg,#f3c75a 0,#f3c75a 35%,#fff3c4 50%,#f3c75a 65%,#f3c75a 100%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:shine 5s linear infinite}
.diyas{display:flex;justify-content:center;align-items:flex-end;gap:clamp(14px,5vw,36px);margin-bottom:26px;padding-top:30px}
.diya{position:relative;width:46px;height:20px;background:linear-gradient(#f6d77a,#b98418 85%);border-radius:4px 4px 46px 46px/4px 4px 20px 20px;box-shadow:0 8px 16px #0007}
.diya:nth-child(3){transform:scale(1.25);margin:0 4px}
.diya:before{content:"";position:absolute;left:0;right:0;top:-3px;height:6px;background:#e8bf4b;border-radius:50%}
.diya i{position:absolute;left:50%;bottom:15px;width:11px;height:25px;margin-left:-5.5px;background:radial-gradient(ellipse at 50% 85%,#fff8d6 0 20%,#ffd35a 46%,#ff8a1f 80%,transparent);border-radius:50% 50% 50% 50%/65% 65% 35% 35%;transform-origin:50% 100%;animation:flicker 1.1s var(--f) ease-in-out infinite alternate;box-shadow:0 0 22px 8px #ffa83a66,0 0 64px 22px #ff8a1f30}
@keyframes flicker{0%{transform:scale(1,1) skewX(0)}30%{transform:scale(.92,1.1) skewX(-3deg)}60%{transform:scale(1.06,.94) skewX(2deg)}100%{transform:scale(.96,1.12) skewX(-1deg)}}


/* —— more section animations —— */
.head h2{background:linear-gradient(100deg,#bc4330 0,#bc4330 38%,#e8a52a 50%,#bc4330 62%,#bc4330 100%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shine 6s linear infinite}
.band .head h2{background:none;-webkit-text-fill-color:#f3c75a;animation:none}
.wd span span{display:inline-block;opacity:0;filter:blur(6px);transform:translateY(10px);transition:opacity .8s calc(var(--w) * 38ms),filter .8s calc(var(--w) * 38ms),transform .8s calc(var(--w) * 38ms)}
.wd.on span span{opacity:1;filter:none;transform:none}
.lns .ln2{display:block;opacity:0;transform:translateX(-26px);transition:opacity .8s calc(var(--k) * 160ms),transform .9s calc(var(--k) * 160ms) cubic-bezier(.2,.7,.2,1)}
.lns .ln2.odd{transform:translateX(26px)}
.lns.on .ln2{opacity:1;transform:none}
.evi{width:50px;height:50px;display:block;margin-bottom:6px;overflow:visible}
.evi .pt2{fill:#f3c75a55;stroke:#c9a227;stroke-width:1.2;transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s calc(.5s + var(--k) * .14s) cubic-bezier(.3,1.5,.4,1)}
.rv.on .evi .pt2{transform:scale(1)}
.evi .rg{fill:none;stroke:#c9a227;stroke-width:2.4;stroke-dasharray:70;stroke-dashoffset:70;transition:stroke-dashoffset 1.5s .5s ease}
.evi .rg.b{stroke:#bc4330;transition-delay:.9s}
.rv.on .evi .rg{stroke-dashoffset:0}
.evi .gem{fill:#f3c75a;transform-box:fill-box;transform-origin:center;animation:gem 2.4s ease-in-out infinite}
@keyframes gem{0%,100%{transform:scale(.8);opacity:.7}50%{transform:scale(1.2) rotate(12deg);opacity:1}}
.venue{position:relative}
.venue:before,.venue:after{content:"";position:absolute;width:0;height:0;border:0 solid #c9a227;transition:width .8s .6s,height .8s .6s}
.venue:before{top:8px;left:8px;border-top-width:2px;border-left-width:2px}
.venue:after{bottom:8px;right:8px;border-bottom-width:2px;border-right-width:2px}
.rv.on .venue:before,.rv.on .venue:after{width:36px;height:36px}
.venue .btn,.rsvp .btn.ready{animation:ringB 2.4s 1.5s ease-out infinite}
@keyframes ringB{0%{box-shadow:0 0 0 0 #bc433066}70%,100%{box-shadow:0 0 0 14px #bc433000}}
.rsvp .btn{transition:.3s,opacity .4s}.rsvp .btn:not(.ready){opacity:.7}
.pbtn{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px;border-radius:50%;background:#bc4330d9;display:grid;place-items:center;z-index:2;pointer-events:none;transition:opacity .4s,transform .4s}
.pbtn:before{content:"";border-left:18px solid #fff;border-top:11px solid transparent;border-bottom:11px solid transparent;margin-left:5px}
.pbtn i{position:absolute;inset:0;border-radius:50%;border:2px solid #f3c75a;animation:ripple 2.2s ease-out infinite}
.pbtn.hide{opacity:0;transform:scale(1.5)}
.mat{animation:pop .8s calc(var(--i, 0) * 90ms) cubic-bezier(.2,.7,.2,1) backwards,hang 6s calc(var(--i, 0) * -1.3s) ease-in-out infinite alternate}
.mat:hover{animation-play-state:running,paused}
@keyframes hang{from{rotate:-.9deg}to{rotate:.9deg}}
.cursor-sp{position:fixed;inset:0;pointer-events:none;z-index:120}
.cs{position:absolute;width:var(--s);height:var(--s);margin:-3px;border-radius:50%;background:radial-gradient(circle,#fff 0 25%,#f3c75a 55%,transparent 72%);animation:csf .9s ease-out forwards}
@keyframes csf{to{opacity:0;transform:translate(var(--dx),24px) scale(.2)}}

/* —— accessibility: stop motion for people who ask for it —— */
@media (prefers-reduced-motion:reduce){
  *,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;animation-delay:0s!important}
  .petals,.toran .st,.gate,.cursor-sp{display:none}
  .bgs i{animation:none}.bgs i:first-child{opacity:1}
  .pre .ct>*{opacity:1}
  .rv,.rv.l,.rv.r,.rv.z{opacity:1;transform:none}
}
`;
