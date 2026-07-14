/* ============================================================ *
 *  Augmented Signals — MOTHERSHIP ARRIVAL v2 "Close Encounter"
 *  A massive gunmetal saucer descends with blaring horn blasts,
 *  grey aliens materialize inside the tractor beam, the hero
 *  title is abducted letter-by-letter, and the ship warps out.
 *  All audio synthesized live with the Web Audio API — no files.
 *  Runs once per session, skippable, respects reduced-motion.
 *
 *  Rollback: revert the commits that added this file + its
 *  <script> tag in index.html. Nothing else is touched.
 * ============================================================ */
(() => {
  "use strict";

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PLAYED  = sessionStorage.getItem("ms-played") === "1";
  const SOUND_PREF = localStorage.getItem("ms-sound") !== "off"; // default on

  /* ── injected styles ─────────────────────────────────────── */
  const css = `
  #ms-canvas{position:fixed;inset:0;z-index:9990;pointer-events:none;}
  #ms-dim{position:fixed;inset:0;z-index:9989;pointer-events:none;
    background:radial-gradient(ellipse at 50% 26%, rgba(8,14,16,.3), rgba(0,0,3,.82) 78%);
    opacity:0;transition:opacity 1s ease;}
  #ms-dim.on{opacity:1;}
  #ms-ship{position:fixed;left:0;top:0;z-index:9993;pointer-events:none;will-change:transform;
    filter:drop-shadow(0 18px 32px rgba(0,0,0,.65)) drop-shadow(0 0 40px rgba(140,255,190,.12));}
  .ms-alien{position:fixed;left:0;top:0;z-index:9991;pointer-events:none;will-change:transform,opacity;opacity:0;
    filter:drop-shadow(0 0 14px rgba(150,255,200,.35));}
  #ms-flash{position:fixed;inset:0;z-index:9995;pointer-events:none;background:#eafff2;opacity:0;}
  #ms-flash.zap{animation:msFlash .38s ease-out;}
  @keyframes msFlash{0%{opacity:.8}100%{opacity:0}}
  body.ms-shake{animation:msShake .5s linear;}
  @keyframes msShake{
    0%,100%{transform:translate(0,0)}15%{transform:translate(-6px,4px)}
    35%{transform:translate(5px,-5px)}55%{transform:translate(-4px,-3px)}
    75%{transform:translate(4px,4px)}90%{transform:translate(-2px,1px)}}
  body.ms-rumble{animation:msRumble .18s linear infinite;}
  @keyframes msRumble{
    0%,100%{transform:translate(0,0)}25%{transform:translate(-1px,1px)}
    50%{transform:translate(1px,-1px)}75%{transform:translate(-1px,-1px)}}
  #ms-skip{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:9999;
    font-family:"Share Tech Mono",monospace;font-size:.75rem;letter-spacing:.28em;
    color:#6f86b8;background:rgba(10,14,28,.65);border:1px solid rgba(0,240,255,.25);
    padding:8px 22px;cursor:pointer;transition:.2s;backdrop-filter:blur(4px);}
  #ms-skip:hover{color:#00f0ff;border-color:#00f0ff;text-shadow:0 0 10px rgba(0,240,255,.7);}
  #ms-sound{position:fixed;bottom:18px;right:18px;z-index:9999;
    font-family:"Share Tech Mono",monospace;font-size:.68rem;letter-spacing:.22em;
    color:#6f86b8;background:rgba(10,14,28,.65);border:1px solid rgba(0,240,255,.2);
    padding:6px 14px;cursor:pointer;transition:.2s;backdrop-filter:blur(4px);}
  #ms-sound:hover{color:#00f0ff;border-color:#00f0ff;}
  #ms-sound.on{color:#00f0ff;border-color:rgba(0,240,255,.55);text-shadow:0 0 8px rgba(0,240,255,.6);}
  .ms-letter{display:inline-block;will-change:transform,opacity;white-space:pre;}
  .ms-letter.up{transition:transform 1.05s cubic-bezier(.5,-0.28,.74,.05),opacity 1.05s ease-in;}
  h1.ms-reappear{animation:msReappear .55s steps(3);}
  @keyframes msReappear{
    0%{clip-path:inset(0 0 60% 0);transform:translate(-6px,0) skewX(8deg);}
    33%{clip-path:inset(40% 0 0 0);transform:translate(6px,0) skewX(-6deg);}
    66%{clip-path:inset(20% 0 30% 0);transform:translate(-3px,0);}
    100%{clip-path:inset(0);transform:none;}}
  .ms-beacon{animation:msBeacon 1.9s ease-in-out infinite;}
  @keyframes msBeacon{0%,100%{opacity:.25}50%{opacity:1}}
  .ms-port-glow{animation:msPort 2.4s ease-in-out infinite;}
  @keyframes msPort{0%,100%{opacity:.65}50%{opacity:1}}
  @media (prefers-reduced-motion: reduce){
    #ms-canvas,#ms-ship,#ms-dim,#ms-flash,#ms-skip,.ms-alien{display:none!important;}}
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── mothership SVG — realistic gunmetal saucer ──────────── */
  const SHIP_W = 460, SHIP_H = 200;
  const shipSVG = `
  <svg width="${SHIP_W}" height="${SHIP_H}" viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="msHull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4a5058"/><stop offset="35%" stop-color="#2b2f36"/>
        <stop offset="70%" stop-color="#16181d"/><stop offset="100%" stop-color="#0a0b0e"/>
      </linearGradient>
      <linearGradient id="msTopDisc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5c636c"/><stop offset="100%" stop-color="#23262c"/>
      </linearGradient>
      <radialGradient id="msDome" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#3d454e"/><stop offset="55%" stop-color="#1a1e24"/>
        <stop offset="100%" stop-color="#0b0d10"/>
      </radialGradient>
      <radialGradient id="msDomeGlow" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stop-color="#9fffc8" stop-opacity=".33"/>
        <stop offset="100%" stop-color="#9fffc8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="msPort" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f2fff7"/><stop offset="45%" stop-color="#a8ffce"/>
        <stop offset="100%" stop-color="#a8ffce" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="msHaze" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7fffb8" stop-opacity=".09"/>
        <stop offset="100%" stop-color="#7fffb8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="msRimLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8b939e" stop-opacity=".8"/>
        <stop offset="100%" stop-color="#8b939e" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- atmospheric haze -->
    <ellipse cx="230" cy="105" rx="228" ry="90" fill="url(#msHaze)"/>
    <!-- dome -->
    <ellipse cx="230" cy="62" rx="70" ry="42" fill="url(#msDome)" stroke="#000" stroke-width="1"/>
    <ellipse cx="230" cy="66" rx="62" ry="34" fill="url(#msDomeGlow)"/>
    <ellipse cx="212" cy="42" rx="26" ry="12" fill="#6a737d" opacity=".28"/>
    <!-- red beacon -->
    <circle class="ms-beacon" cx="230" cy="22" r="4" fill="#ff3b30"/>
    <circle class="ms-beacon" cx="230" cy="22" r="9" fill="#ff3b30" opacity=".22"/>
    <!-- main hull -->
    <ellipse cx="230" cy="105" rx="222" ry="46" fill="url(#msHull)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="230" cy="88" rx="150" ry="26" fill="url(#msTopDisc)"/>
    <!-- top rim highlight -->
    <path d="M 10,103 A 222,46 0 0 1 450,103" fill="none" stroke="url(#msRimLight)" stroke-width="2.5"/>
    <!-- panel lines -->
    <ellipse cx="230" cy="105" rx="196" ry="38" fill="none" stroke="rgba(255,255,255,.055)" stroke-width="1"/>
    <ellipse cx="230" cy="108" rx="160" ry="30" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="1"/>
    <ellipse cx="230" cy="112" rx="120" ry="22" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="1.2"/>
    <g id="msPanelSeams" stroke="rgba(0,0,0,.4)" stroke-width="1"></g>
    <!-- under-hull -->
    <ellipse cx="230" cy="126" rx="130" ry="22" fill="#0c0e11" stroke="#000" stroke-width="1"/>
    <ellipse cx="230" cy="132" rx="86" ry="14" fill="#08090b"/>
    <!-- running lights -->
    <g id="msLights"></g>
    <!-- tractor port -->
    <ellipse cx="230" cy="140" rx="46" ry="11" fill="#050607" stroke="#1c2b24" stroke-width="1"/>
    <ellipse class="ms-port-glow" cx="230" cy="140" rx="36" ry="8" fill="url(#msPort)"/>
  </svg>`;

  /* ── grey alien SVG (idx keeps gradient ids unique) ──────── */
  const ALIEN_W = 90, ALIEN_H = 150;
  const alienSVG = (idx) => `
  <svg width="${ALIEN_W}" height="${ALIEN_H}" viewBox="0 0 90 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="alSkin${idx}" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#b8bfc4"/><stop offset="55%" stop-color="#8e979e"/>
        <stop offset="100%" stop-color="#5c656d"/>
      </radialGradient>
      <linearGradient id="alBody${idx}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#99a1a8"/><stop offset="100%" stop-color="#4e565e"/>
      </linearGradient>
      <radialGradient id="alEye${idx}" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#2a2f33"/><stop offset="45%" stop-color="#0b0d0f"/>
        <stop offset="100%" stop-color="#000"/>
      </radialGradient>
      <linearGradient id="alUnder${idx}" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#a5ffd0" stop-opacity=".38"/>
        <stop offset="100%" stop-color="#a5ffd0" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- legs -->
    <path d="M38,96 C36,112 35,128 34,142 L39,142 C41,127 42,113 43,100 Z" fill="url(#alBody${idx})"/>
    <path d="M52,96 C54,112 55,128 56,142 L51,142 C49,127 48,113 47,100 Z" fill="url(#alBody${idx})"/>
    <!-- arms: long, thin, 3-finger hands -->
    <path d="M33,72 C26,80 21,92 19,104 C18.4,107 18,110 18.6,112 L21.6,111.4 C22,108 22.6,104 24,99 C27,90 31,82 36,76 Z" fill="url(#alBody${idx})"/>
    <path d="M57,72 C64,80 69,92 71,104 C71.6,107 72,110 71.4,112 L68.4,111.4 C68,108 67.4,104 66,99 C63,90 59,82 54,76 Z" fill="url(#alBody${idx})"/>
    <path d="M18,111 l-3,6 M20,112 l-1,7 M22,112 l2,6" stroke="#6b747c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M72,111 l3,6 M70,112 l1,7 M68,112 l-2,6" stroke="#6b747c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- torso -->
    <path d="M36,66 C34,76 33,86 36,97 C39,102 51,102 54,97 C57,86 56,76 54,66 C48,62 42,62 36,66 Z" fill="url(#alBody${idx})"/>
    <!-- neck -->
    <path d="M42,54 C42,60 42,64 41,67 L49,67 C48,64 48,60 48,54 Z" fill="url(#alSkin${idx})"/>
    <!-- head: big cranium, tapered chin -->
    <path d="M45,2 C64,2 76,15 76,31 C76,47 62,60 45,62 C28,60 14,47 14,31 C14,15 26,2 45,2 Z" fill="url(#alSkin${idx})"/>
    <!-- big black almond eyes -->
    <path d="M22,30 C27,24 38,25 41,32 C42,37 38,41 32,40 C26,39 21,35 22,30 Z" fill="url(#alEye${idx})"/>
    <path d="M68,30 C63,24 52,25 49,32 C48,37 52,41 58,40 C64,39 69,35 68,30 Z" fill="url(#alEye${idx})"/>
    <path d="M26,29 C28,27.6 31,27.8 33,29" stroke="rgba(255,255,255,.5)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M64,29 C62,27.6 59,27.8 57,29" stroke="rgba(255,255,255,.5)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <!-- nostrils + mouth -->
    <circle cx="43" cy="47" r=".9" fill="#3c4349"/><circle cx="47" cy="47" r=".9" fill="#3c4349"/>
    <path d="M41,54 C44,55.2 46,55.2 49,54" stroke="#454d54" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <!-- eerie beam under-lighting -->
    <path d="M45,62 C28,60 14,47 14,31 L14,40 C18,52 30,61 45,62 Z" fill="url(#alUnder${idx})"/>
    <ellipse cx="45" cy="128" rx="26" ry="16" fill="url(#alUnder${idx})"/>
  </svg>`;

  /* ── synthesized audio engine ────────────────────────────── */
  function makeAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 10; comp.knee.value = 18;
    master.connect(comp); comp.connect(ctx.destination);
    const live = new Set();
    const g = (v) => { const n = ctx.createGain(); n.gain.value = v; return n; };

    /* big synthetic hall — convolver with decaying noise impulse */
    const verb = ctx.createConvolver();
    {
      const sec = 3.2, rate = ctx.sampleRate;
      const buf = ctx.createBuffer(2, rate * sec, rate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.6);
      }
      verb.buffer = buf;
    }
    const verbGain = g(0.55); verb.connect(verbGain); verbGain.connect(master);

    /* distortion curve for the horn */
    const shaper = ctx.createWaveShaper();
    {
      const c = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) {
        const x = (i / 511.5) - 1;
        c[i] = Math.tanh(2.6 * x);
      }
      shaper.curve = c; shaper.oversample = "2x";
    }
    const shaperOut = g(1); shaper.connect(shaperOut);
    shaperOut.connect(master); shaperOut.connect(verb);

    /* THE HORN — massive detuned brass BWAAAH */
    function horn(base, dur, vol) {
      base = base || 46.2; dur = dur || 3.0; vol = vol || 1;
      const t = ctx.currentTime;
      const out = g(0.0001);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 1.1;
      lp.frequency.setValueAtTime(160, t);
      lp.frequency.exponentialRampToValueAtTime(1400, t + dur * 0.28);
      lp.frequency.exponentialRampToValueAtTime(240, t + dur);
      const mults = [0.5, 1, 1.002, 0.998, 1.5, 2.003];
      mults.forEach((m, i) => {
        const o = ctx.createOscillator(); o.type = "sawtooth";
        const f = base * m;
        o.frequency.setValueAtTime(f * 0.93, t);
        o.frequency.linearRampToValueAtTime(f, t + 0.42);            // brass swell up
        o.frequency.linearRampToValueAtTime(f * 0.985, t + dur);     // sag at tail
        const og = g(i === 0 ? 0.5 : (m >= 2 ? 0.12 : 0.3));
        o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + 0.1);
      });
      lp.connect(out); out.connect(shaper);
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.9 * vol, t + 0.3);
      out.gain.setValueAtTime(0.9 * vol, t + dur * 0.6);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }

    /* continuous low rumble (looped filtered noise) */
    function rumbleStart() {
      const sec = 2.5, rate = ctx.sampleRate;
      const buf = ctx.createBuffer(1, rate * sec, rate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) {           // brown-ish noise
        last = (last + (Math.random() * 2 - 1) * 0.04) * 0.985;
        d[i] = last * 14;
      }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 78;
      const out = g(0);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.19;
      const lfoAmt = g(0.16); lfo.connect(lfoAmt); lfoAmt.connect(out.gain);
      src.connect(lp); lp.connect(out); out.connect(master);
      src.start(); lfo.start(); live.add(src); live.add(lfo);
      out.gain.setTargetAtTime(0.5, ctx.currentTime, 1.2);
      return out;
    }

    /* eerie tractor-beam shimmer */
    function shimmerStart() {
      const out = g(0);
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 174;
      const vib = ctx.createOscillator(); vib.frequency.value = 4.7;
      const vibAmt = g(9); vib.connect(vibAmt); vibAmt.connect(o.frequency);
      const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 176.4; // slow beating
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 760; bp.Q.value = 2.6;
      const trem = ctx.createOscillator(); trem.frequency.value = 7.3;
      const tremAmt = g(0.3); const tg = g(0.6);
      trem.connect(tremAmt); tremAmt.connect(tg.gain);
      const hi = ctx.createOscillator(); hi.type = "sine"; hi.frequency.value = 1244;
      const hg = g(0.035); hi.connect(hg); hg.connect(out);
      o.connect(bp); o2.connect(bp); bp.connect(tg); tg.connect(out);
      out.connect(master); out.connect(verb);
      [o, o2, vib, trem, hi].forEach(n => { n.start(); live.add(n); });
      out.gain.setTargetAtTime(0.22, ctx.currentTime, 0.5);
      return out;
    }
    function noiseBuf(sec) {
      const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return b;
    }
    function zap() {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = "square";
      o.frequency.setValueAtTime(1400, t); o.frequency.exponentialRampToValueAtTime(160, t + 0.22);
      const og = g(0.001); og.gain.setValueAtTime(0.32, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(0.2);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1800;
      const ng = g(0.001); ng.gain.setValueAtTime(0.22, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(og); og.connect(master); n.connect(hp); hp.connect(ng); ng.connect(master); ng.connect(verb);
      o.start(t); o.stop(t + 0.3); n.start(t);
    }
    function whoosh() {
      const t = ctx.currentTime;
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(1.4);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(280, t);
      bp.frequency.exponentialRampToValueAtTime(5200, t + 0.55);
      bp.frequency.exponentialRampToValueAtTime(700, t + 1.3);
      const ng = g(0.001);
      ng.gain.setValueAtTime(0.001, t);
      ng.gain.exponentialRampToValueAtTime(0.7, t + 0.4);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 1.35);
      n.connect(bp); bp.connect(ng); ng.connect(master); ng.connect(verb);
      n.start(t);
    }
    return {
      ctx, master, horn, rumbleStart, shimmerStart, zap, whoosh,
      fadeIn()  { master.gain.setTargetAtTime(0.26, ctx.currentTime, 0.6); },
      fadeOut(sec) { master.gain.setTargetAtTime(0, ctx.currentTime, sec || 2.5); },
      kill(after) {
        setTimeout(() => { live.forEach(n => { try { n.stop(); } catch (e) {} }); ctx.close().catch(() => {}); },
          (after || 0) * 1000);
      },
    };
  }

  /* ── sound toggle button (shown while the scene exists) ──── */
  let soundOn = SOUND_PREF;
  const soundBtn = document.createElement("button");
  soundBtn.id = "ms-sound";
  soundBtn.setAttribute("aria-label", "Toggle sound effects");
  const paintBtn = () => {
    soundBtn.textContent = soundOn ? "♪ SFX ON" : "♪ SFX OFF";
    soundBtn.classList.toggle("on", soundOn);
  };
  paintBtn();

  /* ── flybys: a distant saucer crosses the sky now and then ── */
  function scheduleFlyby() {
    if (REDUCED) return;
    const delay = 40000 + Math.random() * 50000;
    setTimeout(() => {
      const el = document.createElement("div");
      el.innerHTML = shipSVG;
      el.style.cssText = "position:fixed;z-index:5;pointer-events:none;opacity:.45;filter:blur(.4px) drop-shadow(0 0 8px rgba(160,255,200,.3));";
      const scale = 0.09 + Math.random() * 0.07;
      const y = 40 + Math.random() * (innerHeight * 0.25);
      const ltr = Math.random() > 0.5;
      el.style.top = y + "px";
      el.style.left = ltr ? -SHIP_W + "px" : innerWidth + "px";
      el.style.transform = `scale(${scale}) ${ltr ? "" : "scaleX(-1)"}`;
      el.style.transition = "left 7s linear";
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.left = ltr ? innerWidth + "px" : -SHIP_W + "px";
      }));
      setTimeout(() => el.remove(), 7500);
      scheduleFlyby();
    }, delay);
  }

  /* ── main abduction sequence ─────────────────────────────── */
  function runSequence() {
    const title = document.querySelector(".hero h1.glitch");
    if (!title) return;

    /* overlay DOM */
    const dim = document.createElement("div"); dim.id = "ms-dim";
    const canvas = document.createElement("canvas"); canvas.id = "ms-canvas";
    const ship = document.createElement("div"); ship.id = "ms-ship"; ship.innerHTML = shipSVG;
    const flash = document.createElement("div"); flash.id = "ms-flash";
    const skip = document.createElement("button"); skip.id = "ms-skip"; skip.textContent = "SKIP TRANSMISSION ▸";
    document.body.append(dim, canvas, ship, flash, skip);
    if (!soundBtn.isConnected) document.body.appendChild(soundBtn);

    /* radial panel seams on the hull */
    const seams = ship.querySelector("#msPanelSeams");
    for (let i = 0; i < 10; i++) {
      const a = (i / 9) * Math.PI;
      const x1 = 230 - Math.cos(a) * 150, y1 = 88 + Math.sin(a) * 26;
      const x2 = 230 - Math.cos(a) * 218, y2 = 105 + Math.sin(a) * 44;
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1);
      l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      seams.appendChild(l);
    }
    /* running lights: warm-white chase + red/green nav tips */
    const lightsG = ship.querySelector("#msLights");
    const N_LIGHTS = 13;
    for (let i = 0; i < N_LIGHTS; i++) {
      const a = (i / (N_LIGHTS - 1)) * Math.PI;
      const cx = 230 - Math.cos(a) * 208, cy = 110 + Math.sin(a) * 38;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", 3.2);
      const col = i === 0 ? "#ff5148" : i === N_LIGHTS - 1 ? "#59ff7e" : "#ffe9c2";
      c.setAttribute("fill", col);
      c.style.animation = `msBeacon 1.5s ease-in-out ${i * 0.115}s infinite`;
      lightsG.appendChild(c);
    }

    const ctx2d = canvas.getContext("2d");
    let W, H, dpr;
    function sizeCanvas() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    }
    sizeCanvas();
    addEventListener("resize", sizeCanvas);

    /* split title into letters (restored at the end) */
    const origHTML = title.innerHTML;
    const origData = title.getAttribute("data-text");
    const text = title.textContent;
    title.setAttribute("data-text", "");
    title.innerHTML = text.split("").map(ch =>
      `<span class="ms-letter">${ch === " " ? " " : ch}</span>`).join("");
    const letters = [...title.querySelectorAll(".ms-letter")];

    /* timeline (ms) */
    const T = {
      descendStart: 400, descendEnd: 3100,
      hornA: 1000,
      beamOn: 3400, alienIn: 3750,
      abductStart: 4500, abductStagger: 85, abductDur: 1050,
      hornB: 5200,
      aliensUp: 5900, beamOff: 6900,
      depart: 7150, departEnd: 7800, restore: 7900, end: 8700,
    };
    let start = null, phase = 0, done = false;
    let hornBFired = false;
    const TIME_SCALE = location.hash === "#msdebug" ? 0.25 : 1; // slow-mo for testing
    const particles = [];
    const shipScale = Math.min(1, innerWidth / 640);
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInCubic = t => t * t * t;
    const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    /* audio */
    let audio = null, rumbleG = null, shimmerG = null;
    let audioWanted = soundOn && !REDUCED;
    function bootAudio() {
      if (!audioWanted || audio) return;
      audio = makeAudio();
    }
    function audioLive() { return audio && audio.ctx.state === "running" && audioWanted; }
    function startBeds() {
      if (!audioLive()) return;
      audio.fadeIn();
      if (!rumbleG) rumbleG = audio.rumbleStart();
      if (phase >= 2 && !shimmerG) shimmerG = audio.shimmerStart();
    }
    function unlockAudio() {
      if (!audio || !audioWanted) return;
      if (audio.ctx.state === "suspended") {
        audio.ctx.resume().then(() => {
          startBeds();
          /* late unlock mid-scene: still give them a horn */
          if (phase >= 1 && phase < 4) audio.horn(46.2, 2.4, 0.8);
        });
      } else startBeds();
    }
    const unlockEvents = ["pointerdown", "keydown", "touchend", "wheel"];
    const unlockOnce = () => { unlockAudio(); unlockEvents.forEach(e => removeEventListener(e, unlockOnce)); };
    unlockEvents.forEach(e => addEventListener(e, unlockOnce, { passive: true }));
    bootAudio();
    unlockAudio(); // works immediately if the browser allows it

    soundBtn.onclick = () => {
      soundOn = !soundOn;
      localStorage.setItem("ms-sound", soundOn ? "on" : "off");
      paintBtn();
      audioWanted = soundOn;
      if (soundOn) { bootAudio(); unlockAudio(); if (audio) audio.fadeIn(); }
      else if (audio) audio.fadeOut(0.15);
    };

    /* grey aliens in the beam */
    const alienDefs = [
      { fx: -0.5, size: 0.86, tIn: T.alienIn,       bob: 0    },
      { fx:  0.04, size: 1.02, tIn: T.alienIn + 260, bob: 2.1 },
      { fx:  0.52, size: 0.78, tIn: T.alienIn + 520, bob: 4.4 },
    ];
    const aliens = alienDefs.map((d, i) => {
      const el = document.createElement("div");
      el.className = "ms-alien";
      el.innerHTML = alienSVG(i);
      document.body.appendChild(el);
      return Object.assign({ el }, d);
    });

    function shipPos(elapsed) {
      const r = title.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const hoverY = Math.max(60, r.top - 215 * shipScale);
      let x = cx, y, sc = shipScale, alpha = 1;
      if (elapsed < T.descendStart) { y = -SHIP_H * 2; }
      else if (elapsed < T.descendEnd) {
        const t = easeOutCubic((elapsed - T.descendStart) / (T.descendEnd - T.descendStart));
        y = -SHIP_H + (hoverY + SHIP_H) * t;
        x = cx + Math.sin(t * Math.PI * 1.8) * 46 * (1 - t);
      } else if (elapsed < T.depart) {
        y = hoverY + Math.sin(elapsed / 520) * 6;
        x = cx + Math.sin(elapsed / 780) * 8;
      } else {
        const t = easeInCubic(Math.min(1, (elapsed - T.depart) / (T.departEnd - T.depart)));
        y = hoverY - (hoverY + SHIP_H * 3) * t;
        x = cx + t * innerWidth * 0.16;
        sc = shipScale * (1 - t * 0.4);
        alpha = 1 - t * 0.9;
      }
      return { x, y, cx, r, alpha, sc };
    }

    function beamGeom(p) {
      const topY = p.y + 140 * p.sc;
      const botY = p.r.bottom + 16;
      const topW = 74 * p.sc, botW = Math.max(p.r.width * 0.8, 220);
      return { topY, botY, topW, botW, cx: p.x };
    }

    function drawBeam(p, elapsed, strength) {
      const b = beamGeom(p);
      if (b.botY <= b.topY) return;
      const topY = b.topY * dpr, botY = b.botY * dpr;
      const topW = b.topW * dpr, botW = b.botW * dpr, cx = b.cx * dpr;
      const flicker = 0.82 + 0.18 * Math.sin(elapsed / 26) * Math.random();
      const a = strength * flicker;
      const grad = ctx2d.createLinearGradient(0, topY, 0, botY);
      grad.addColorStop(0, `rgba(190,255,220,${0.44 * a})`);
      grad.addColorStop(0.5, `rgba(140,255,195,${0.19 * a})`);
      grad.addColorStop(1, `rgba(110,255,180,${0.05 * a})`);
      ctx2d.beginPath();
      ctx2d.moveTo(cx - topW / 2, topY); ctx2d.lineTo(cx + topW / 2, topY);
      ctx2d.lineTo(cx + botW / 2, botY); ctx2d.lineTo(cx - botW / 2, botY);
      ctx2d.closePath();
      ctx2d.fillStyle = grad; ctx2d.fill();
      ctx2d.strokeStyle = `rgba(210,255,230,${0.22 * a})`; ctx2d.lineWidth = 1.5 * dpr; ctx2d.stroke();
      /* ground glow */
      ctx2d.beginPath();
      ctx2d.ellipse(cx, botY, botW / 2, 15 * dpr, 0, 0, Math.PI * 2);
      ctx2d.fillStyle = `rgba(140,255,195,${0.13 * a})`; ctx2d.fill();
      /* rising dust motes */
      if (strength > 0.3) for (let i = 0; i < 3; i++) {
        const px = cx + (Math.random() - 0.5) * botW * 0.8;
        particles.push({ x: px, y: botY - Math.random() * 30 * dpr, tx: cx, ty: topY,
          v: (1.2 + Math.random() * 2.2) * dpr, s: (1 + Math.random() * 2.2) * dpr,
          hue: Math.random() < 0.5 ? "190,255,220" : "230,255,240",
          life: 1 });
      }
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.v; p.x += (p.tx - p.x) * 0.04; p.life -= 0.008;
        const fade = Math.min(1, (p.y - p.ty) / (140 * dpr));
        if (p.y <= p.ty || p.life <= 0) { particles.splice(i, 1); continue; }
        ctx2d.fillStyle = `rgba(${p.hue},${Math.max(0, 0.8 * fade * p.life)})`;
        ctx2d.fillRect(p.x, p.y, p.s, p.s);
      }
    }

    /* aliens ride the beam: materialize → hover → ascend */
    function drawAliens(p, elapsed, beamStrength) {
      const b = beamGeom(p);
      for (const al of aliens) {
        if (elapsed < al.tIn || beamStrength <= 0) { al.el.style.opacity = 0; continue; }
        const tIn = Math.min(1, (elapsed - al.tIn) / 700);
        /* descend from port to hover slot over first 900ms */
        const drop = easeInOut(Math.min(1, (elapsed - al.tIn) / 950));
        const hoverY = b.botY - ALIEN_H * al.size - 26;
        let y = b.topY + (hoverY - b.topY) * drop;
        let opacity = tIn * 0.86;
        /* materialization flicker */
        if (tIn < 1) opacity *= 0.55 + 0.45 * Math.random();
        /* ascend back into the ship */
        if (elapsed >= T.aliensUp) {
          const up = easeInCubic(Math.min(1, (elapsed - T.aliensUp - al.bob * 60) / 800));
          y = hoverY + (b.topY - 40 - hoverY) * Math.max(0, up);
          opacity *= Math.max(0, 1 - Math.max(0, up) * 1.15);
        } else {
          y += Math.sin(elapsed / 480 + al.bob) * 7;
        }
        /* keep them inside the cone at their height */
        const prog = (y + ALIEN_H * al.size * 0.5 - b.topY) / (b.botY - b.topY);
        const coneW = b.topW + (b.botW - b.topW) * Math.max(0, Math.min(1, prog));
        const x = b.cx + al.fx * coneW * 0.42 - (ALIEN_W * al.size) / 2;
        const tilt = Math.sin(elapsed / 620 + al.bob) * 4;
        al.el.style.opacity = Math.max(0, opacity * beamStrength);
        al.el.style.transform = `translate(${x}px, ${y}px) scale(${al.size}) rotate(${tilt}deg)`;
      }
    }

    /* per-letter abduction */
    let abducted = false;
    function abductLetters(p) {
      abducted = true;
      letters.forEach((el, i) => {
        setTimeout(() => {
          if (done) return;
          const lr = el.getBoundingClientRect();
          const dx = p.cx - (lr.left + lr.width / 2);
          const dy = (p.y + 130 * p.sc) - lr.top;
          el.classList.add("up");
          el.style.transform =
            `translate(${dx + (Math.random() - 0.5) * 40}px, ${dy}px) rotate(${(Math.random() - 0.5) * 540}deg) scale(.12)`;
          el.style.opacity = "0";
        }, i * T.abductStagger / TIME_SCALE);
      });
    }

    function doFlash() {
      flash.classList.remove("zap"); void flash.offsetWidth; flash.classList.add("zap");
      doShake();
    }
    function doShake() {
      document.body.classList.remove("ms-shake"); void document.body.offsetWidth;
      document.body.classList.add("ms-shake");
    }

    function restoreTitle() {
      title.innerHTML = origHTML;
      if (origData !== null) title.setAttribute("data-text", origData);
      title.classList.add("ms-reappear");
      setTimeout(() => title.classList.remove("ms-reappear"), 600);
    }

    function finish(skipped) {
      if (done) return;
      done = true;
      if (abducted || skipped) restoreTitle();
      else { title.innerHTML = origHTML; if (origData !== null) title.setAttribute("data-text", origData); }
      dim.classList.remove("on");
      document.body.classList.remove("ms-rumble", "ms-shake");
      skip.remove();
      aliens.forEach(a => a.el.remove());
      setTimeout(() => { canvas.remove(); ship.remove(); dim.remove(); flash.remove(); }, 800);
      if (audio) { audio.fadeOut(3.5); audio.kill(9); }
      unlockEvents.forEach(e => removeEventListener(e, unlockOnce));
      sessionStorage.setItem("ms-played", "1");
      scheduleFlyby();
    }
    skip.onclick = () => { doFlash(); finish(true); };

    function frame(now) {
      if (done) return;
      if (start === null) start = now;
      let el = (now - start) * TIME_SCALE;
      if (window.__msFreeze != null) {           // debug: hold the scene at a fixed ms
        el = window.__msFreeze;
        start = now - el / TIME_SCALE;
      }
      ctx2d.clearRect(0, 0, W, H);
      const p = shipPos(el);

      /* phase transitions */
      if (phase === 0 && el >= 60) { phase = 1; dim.classList.add("on"); document.body.classList.add("ms-rumble"); }
      if (phase === 1 && el >= T.hornA) {
        phase = 1.5; doShake();
        if (audioLive()) audio.horn(46.2, 3.2, 1);
      }
      if (phase < 2 && el >= T.beamOn) {
        phase = 2; doFlash();
        if (audioLive()) { audio.zap(); if (!shimmerG) shimmerG = audio.shimmerStart(); }
      }
      if (phase === 2 && el >= T.abductStart) { phase = 3; abductLetters(p); }
      if (!hornBFired && el >= T.hornB) {
        hornBFired = true;
        if (audioLive()) audio.horn(61.7, 2.2, 0.65);   // distant answering horn
      }
      if (phase === 3 && el >= T.depart) {
        phase = 4;
        document.body.classList.remove("ms-rumble");
        if (audioLive()) { audio.horn(46.2, 1.6, 0.8); audio.whoosh(); }
      }
      if (phase === 4 && el >= T.restore && !title.classList.contains("ms-reappear")) {
        doFlash(); restoreTitle();
        if (audioLive()) audio.zap();
        phase = 5;
      }
      if (el >= T.end) { finish(false); return; }

      /* beam strength envelope */
      let beam = 0;
      if (el >= T.beamOn && el < T.beamOff) beam = Math.min(1, (el - T.beamOn) / 260);
      else if (el >= T.beamOff && el < T.depart) beam = Math.max(0, 1 - (el - T.beamOff) / 220);
      if (beam > 0) drawBeam(p, el, beam);
      drawParticles();
      drawAliens(p, el, beam);

      /* position ship */
      ship.style.opacity = p.alpha;
      ship.style.transform =
        `translate(${p.x - SHIP_W / 2}px, ${p.y}px) scale(${p.sc})`;

      /* departure streak */
      if (phase >= 4 && p.alpha > 0.1) {
        ctx2d.strokeStyle = `rgba(160,255,200,${0.3 * p.alpha})`;
        ctx2d.lineWidth = 3 * dpr;
        ctx2d.beginPath();
        ctx2d.moveTo(p.x * dpr, (p.y + SHIP_H) * dpr);
        ctx2d.lineTo(p.x * dpr, (p.y + SHIP_H + 170) * dpr);
        ctx2d.stroke();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── entry point ─────────────────────────────────────────── */
  function init() {
    if (REDUCED || PLAYED) { scheduleFlyby(); return; }
    /* scroll-restored mid-page (e.g. reload) → composition would be cramped */
    if (scrollY > 120) { sessionStorage.setItem("ms-played", "1"); scheduleFlyby(); return; }
    /* opened in a background tab → hold the show until they actually look */
    if (document.hidden) {
      document.addEventListener("visibilitychange", function onVis() {
        if (!document.hidden) { document.removeEventListener("visibilitychange", onVis); init(); }
      });
      return;
    }
    /* small beat so fonts/layout settle before we measure the title */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(runSequence, 250));
    } else {
      setTimeout(runSequence, 450);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();

  /* easter egg: double-click the ◈ brand mark to summon the ship again */
  document.addEventListener("dblclick", (e) => {
    if (e.target.closest(".brand") && !document.getElementById("ms-ship")) {
      sessionStorage.removeItem("ms-played");
      scrollTo({ top: 0, behavior: "instant" });
      runSequence();
    }
  });
})();
