/* ============================================================ *
 *  Augmented Signals — MOTHERSHIP ARRIVAL
 *  Self-contained entry sequence: a mothership descends over the
 *  hero, tractor-beams the title letters into the ship, and warps
 *  out. All sound is synthesized live with the Web Audio API —
 *  no audio files. Runs once per session, skippable, respects
 *  prefers-reduced-motion.
 *
 *  Rollback: revert the commit that added this file + its
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
    background:radial-gradient(ellipse at 50% 30%, rgba(0,20,30,.25), rgba(0,0,5,.72) 75%);
    opacity:0;transition:opacity .7s ease;}
  #ms-dim.on{opacity:1;}
  #ms-ship{position:fixed;left:0;top:0;z-index:9992;pointer-events:none;will-change:transform;filter:drop-shadow(0 0 26px rgba(0,240,255,.35));}
  #ms-flash{position:fixed;inset:0;z-index:9995;pointer-events:none;background:#dffcff;opacity:0;}
  #ms-flash.zap{animation:msFlash .38s ease-out;}
  @keyframes msFlash{0%{opacity:.85}100%{opacity:0}}
  body.ms-shake{animation:msShake .4s linear;}
  @keyframes msShake{
    0%,100%{transform:translate(0,0)}20%{transform:translate(-5px,3px)}
    40%{transform:translate(4px,-4px)}60%{transform:translate(-3px,-2px)}80%{transform:translate(3px,3px)}}
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
  .ms-dome-pulse{animation:msDome 1.6s ease-in-out infinite;}
  @keyframes msDome{0%,100%{opacity:.75}50%{opacity:1}}
  @media (prefers-reduced-motion: reduce){
    #ms-canvas,#ms-ship,#ms-dim,#ms-flash,#ms-skip{display:none!important;}}
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── mothership SVG ──────────────────────────────────────── */
  const SHIP_W = 340, SHIP_H = 150;
  const shipSVG = `
  <svg width="${SHIP_W}" height="${SHIP_H}" viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="msDomeG" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#bffcff"/><stop offset="45%" stop-color="#00f0ff" stop-opacity=".85"/>
        <stop offset="100%" stop-color="#0a3b58" stop-opacity=".9"/>
      </radialGradient>
      <linearGradient id="msHullG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2a3a66"/><stop offset="45%" stop-color="#131c3a"/>
        <stop offset="100%" stop-color="#070b1c"/>
      </linearGradient>
      <linearGradient id="msRimG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f0ff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#00f0ff"/>
        <stop offset="100%" stop-color="#ff2bd6" stop-opacity=".35"/>
      </linearGradient>
      <radialGradient id="msPortG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#e8fffb"/><stop offset="55%" stop-color="#37ffd0"/>
        <stop offset="100%" stop-color="#37ffd0" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse class="ms-dome-pulse" cx="170" cy="52" rx="58" ry="40" fill="url(#msDomeG)" opacity=".9"/>
    <ellipse cx="170" cy="80" rx="160" ry="34" fill="url(#msHullG)" stroke="#22335f" stroke-width="1.5"/>
    <ellipse cx="170" cy="72" rx="160" ry="30" fill="none" stroke="url(#msRimG)" stroke-width="2" opacity=".85"/>
    <ellipse cx="170" cy="96" rx="96" ry="17" fill="#0a1128" stroke="#1c2b52" stroke-width="1"/>
    <g id="msLights"></g>
    <ellipse cx="170" cy="108" rx="34" ry="9" fill="url(#msPortG)" opacity=".95"/>
  </svg>`;

  /* ── synthesized audio engine ────────────────────────────── */
  function makeAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22; comp.ratio.value = 8;
    master.connect(comp); comp.connect(ctx.destination);
    const live = new Set();
    const g = (v) => { const n = ctx.createGain(); n.gain.value = v; return n; };

    function droneStart() {
      const out = g(0);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 240; lp.Q.value = 6;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
      const lfoAmt = g(130); lfo.connect(lfoAmt); lfoAmt.connect(lp.frequency);
      [48, 48.9, 96.4].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = i === 2 ? "triangle" : "sawtooth"; o.frequency.value = f;
        const og = g(i === 2 ? 0.12 : 0.3); o.connect(og); og.connect(lp); o.start(); live.add(o);
      });
      const sub = ctx.createOscillator(); sub.type = "sine"; sub.frequency.value = 24;
      const sg = g(0.5); sub.connect(sg); sg.connect(out); sub.start(); live.add(sub);
      lp.connect(out); out.connect(master); lfo.start(); live.add(lfo);
      out.gain.setTargetAtTime(0.62, ctx.currentTime, 0.9);
      return out;
    }
    function shimmerStart() {
      const out = g(0);
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 196;
      const vib = ctx.createOscillator(); vib.frequency.value = 5.6;
      const vibAmt = g(14); vib.connect(vibAmt); vibAmt.connect(o.frequency);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 3;
      const trem = ctx.createOscillator(); trem.frequency.value = 9;
      const tremAmt = g(0.35); const tg = g(0.65);
      trem.connect(tremAmt); tremAmt.connect(tg.gain);
      const hi = ctx.createOscillator(); hi.type = "sine"; hi.frequency.value = 1568;
      const hg = g(0.05); hi.connect(hg); hg.connect(out);
      o.connect(bp); bp.connect(tg); tg.connect(out); out.connect(master);
      [o, vib, trem, hi].forEach(n => { n.start(); live.add(n); });
      out.gain.setTargetAtTime(0.34, ctx.currentTime, 0.4);
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
      const og = g(0.001); og.gain.setValueAtTime(0.4, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(0.2);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1800;
      const ng = g(0.001); ng.gain.setValueAtTime(0.3, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(og); og.connect(master); n.connect(hp); hp.connect(ng); ng.connect(master);
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
      ng.gain.exponentialRampToValueAtTime(0.85, t + 0.4);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 1.35);
      const o = ctx.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(1900, t + 0.5);
      const og = g(0.001); og.gain.setValueAtTime(0.16, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      n.connect(bp); bp.connect(ng); ng.connect(master); o.connect(og); og.connect(master);
      n.start(t); o.start(t); o.stop(t + 0.7);
    }
    return {
      ctx, master, droneStart, shimmerStart, zap, whoosh,
      fadeIn()  { master.gain.setTargetAtTime(0.24, ctx.currentTime, 0.6); },
      fadeOut(sec) { master.gain.setTargetAtTime(0, ctx.currentTime, sec || 2.5); },
      kill(after) {
        setTimeout(() => { live.forEach(n => { try { n.stop(); } catch (e) {} }); ctx.close().catch(() => {}); },
          (after || 0) * 1000);
      },
    };
  }

  /* ── sound toggle button (persistent) ────────────────────── */
  let soundOn = SOUND_PREF;
  const soundBtn = document.createElement("button");
  soundBtn.id = "ms-sound";
  soundBtn.setAttribute("aria-label", "Toggle sound effects");
  const paintBtn = () => {
    soundBtn.textContent = soundOn ? "♪ SFX ON" : "♪ SFX OFF";
    soundBtn.classList.toggle("on", soundOn);
  };
  paintBtn();

  /* ── flybys: a small saucer crosses the sky now and then ──── */
  function scheduleFlyby() {
    if (REDUCED) return;
    const delay = 40000 + Math.random() * 50000;
    setTimeout(() => {
      const el = document.createElement("div");
      el.innerHTML = shipSVG;
      el.style.cssText = "position:fixed;z-index:5;pointer-events:none;opacity:.5;filter:blur(.4px) drop-shadow(0 0 8px rgba(0,240,255,.4));";
      const scale = 0.14 + Math.random() * 0.1;
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

    /* rim lights */
    const lightsG = ship.querySelector("#msLights");
    const N_LIGHTS = 9;
    for (let i = 0; i < N_LIGHTS; i++) {
      const a = (i / (N_LIGHTS - 1)) * Math.PI;
      const cx = 170 - Math.cos(a) * 150, cy = 82 + Math.sin(a) * 26;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", 4.5);
      c.setAttribute("fill", i % 3 === 1 ? "#ff2bd6" : "#00f0ff");
      c.style.animation = `msDome 1.1s ease-in-out ${i * 0.12}s infinite`;
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

    /* audio */
    let audio = null, droneG = null, shimmerG = null;
    let audioWanted = soundOn && !REDUCED;
    function bootAudio() {
      if (!audioWanted || audio) return;
      audio = makeAudio();
      if (!audio) return;
      if (audio.ctx.state === "running") { audio.fadeIn(); droneG = audio.droneStart(); }
    }
    function unlockAudio() {
      if (!audio || !audioWanted) return;
      if (audio.ctx.state === "suspended") {
        audio.ctx.resume().then(() => {
          audio.fadeIn();
          if (!droneG) droneG = audio.droneStart();
          if (phase >= 2 && !shimmerG) shimmerG = audio.shimmerStart();
        });
      }
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

    /* timeline */
    const T = {
      descendStart: 400, descendEnd: 2600,
      beamOn: 2950, abductStart: 3250, abductStagger: 85, abductDur: 1050,
      beamOff: 5450, depart: 5650, departEnd: 6250, restore: 6350, end: 7100,
    };
    let start = null, phase = 0, done = false;
    const TIME_SCALE = location.hash === "#msdebug" ? 0.25 : 1; // slow-mo for testing
    const particles = [];
    const shipScale = Math.min(1, innerWidth / 560);
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInCubic = t => t * t * t;

    function shipPos(elapsed) {
      const r = title.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const hoverY = Math.max(70, r.top - 190 * shipScale);
      let x = cx, y, sc = shipScale, alpha = 1;
      if (elapsed < T.descendStart) { y = -SHIP_H * 2; }
      else if (elapsed < T.descendEnd) {
        const t = easeOutCubic((elapsed - T.descendStart) / (T.descendEnd - T.descendStart));
        y = -SHIP_H + (hoverY + SHIP_H) * t;
        x = cx + Math.sin(t * Math.PI * 2.2) * 60 * (1 - t);
      } else if (elapsed < T.depart) {
        y = hoverY + Math.sin(elapsed / 420) * 7;
        x = cx + Math.sin(elapsed / 650) * 10;
      } else {
        const t = easeInCubic(Math.min(1, (elapsed - T.depart) / (T.departEnd - T.depart)));
        y = hoverY - (hoverY + SHIP_H * 3) * t;
        x = cx + t * innerWidth * 0.18;
        sc = shipScale * (1 - t * 0.4);
        alpha = 1 - t * 0.9;
      }
      return { x, y, cx, r, alpha, sc };
    }

    function drawBeam(p, elapsed, strength) {
      const topY = (p.y + 112 * p.sc) * dpr;
      const botY = (p.r.bottom + 14) * dpr;
      if (botY <= topY) return;
      const topW = 42 * p.sc * dpr, botW = Math.max(p.r.width * 0.72, 180) * dpr;
      const cx = p.x * dpr;
      const flicker = 0.8 + 0.2 * Math.sin(elapsed / 23) * Math.random();
      const a = strength * flicker;
      const grad = ctx2d.createLinearGradient(0, topY, 0, botY);
      grad.addColorStop(0, `rgba(120,255,240,${0.5 * a})`);
      grad.addColorStop(0.5, `rgba(0,240,255,${0.22 * a})`);
      grad.addColorStop(1, `rgba(55,255,208,${0.05 * a})`);
      ctx2d.beginPath();
      ctx2d.moveTo(cx - topW / 2, topY); ctx2d.lineTo(cx + topW / 2, topY);
      ctx2d.lineTo(cx + botW / 2, botY); ctx2d.lineTo(cx - botW / 2, botY);
      ctx2d.closePath();
      ctx2d.fillStyle = grad; ctx2d.fill();
      ctx2d.strokeStyle = `rgba(160,255,245,${0.28 * a})`; ctx2d.lineWidth = 1.5 * dpr; ctx2d.stroke();
      /* ground glow */
      ctx2d.beginPath();
      ctx2d.ellipse(cx, botY, botW / 2, 14 * dpr, 0, 0, Math.PI * 2);
      ctx2d.fillStyle = `rgba(55,255,208,${0.14 * a})`; ctx2d.fill();
      /* spawn rising particles */
      if (strength > 0.3) for (let i = 0; i < 3; i++) {
        const px = cx + (Math.random() - 0.5) * botW * 0.8;
        particles.push({ x: px, y: botY - Math.random() * 30 * dpr, tx: cx, ty: topY,
          v: (1.4 + Math.random() * 2.4) * dpr, s: (1 + Math.random() * 2.2) * dpr,
          hue: Math.random() < 0.12 ? "255,43,214" : (Math.random() < 0.5 ? "0,240,255" : "180,255,245"),
          life: 1 });
      }
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.v; p.x += (p.tx - p.x) * 0.045; p.life -= 0.008;
        const fade = Math.min(1, (p.y - p.ty) / (140 * dpr));
        if (p.y <= p.ty || p.life <= 0) { particles.splice(i, 1); continue; }
        ctx2d.fillStyle = `rgba(${p.hue},${Math.max(0, 0.85 * fade * p.life)})`;
        ctx2d.fillRect(p.x, p.y, p.s, p.s);
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
          const dy = (p.y + 100 * p.sc) - lr.top;
          el.classList.add("up");
          el.style.transform =
            `translate(${dx + (Math.random() - 0.5) * 40}px, ${dy}px) rotate(${(Math.random() - 0.5) * 540}deg) scale(.12)`;
          el.style.opacity = "0";
        }, i * T.abductStagger / TIME_SCALE);
      });
    }

    function doFlash() {
      flash.classList.remove("zap"); void flash.offsetWidth; flash.classList.add("zap");
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
      skip.remove();
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
      const el = (now - start) * TIME_SCALE;
      ctx2d.clearRect(0, 0, W, H);
      const p = shipPos(el);

      /* phase transitions */
      if (phase === 0 && el >= 60) { phase = 1; dim.classList.add("on"); }
      if (phase === 1 && el >= T.beamOn) {
        phase = 2; doFlash();
        if (audio && audio.ctx.state === "running") { audio.zap(); shimmerG = audio.shimmerStart(); }
      }
      if (phase === 2 && el >= T.abductStart) { phase = 3; abductLetters(p); }
      if (phase === 3 && el >= T.depart) {
        phase = 4;
        if (audio && audio.ctx.state === "running") audio.whoosh();
      }
      if (phase === 4 && el >= T.restore && !title.classList.contains("ms-reappear")) {
        doFlash(); restoreTitle();
        if (audio && audio.ctx.state === "running") audio.zap();
        phase = 5;
      }
      if (el >= T.end) { finish(false); return; }

      /* beam strength envelope */
      let beam = 0;
      if (el >= T.beamOn && el < T.beamOff) beam = Math.min(1, (el - T.beamOn) / 260);
      else if (el >= T.beamOff && el < T.depart) beam = Math.max(0, 1 - (el - T.beamOff) / 200);
      if (beam > 0) drawBeam(p, el, beam);
      drawParticles();

      /* position ship */
      ship.style.opacity = p.alpha;
      ship.style.transform =
        `translate(${p.x - SHIP_W / 2}px, ${p.y}px) scale(${p.sc})`;

      /* departure streak */
      if (phase >= 4 && p.alpha > 0.1) {
        ctx2d.strokeStyle = `rgba(0,240,255,${0.35 * p.alpha})`;
        ctx2d.lineWidth = 3 * dpr;
        ctx2d.beginPath();
        ctx2d.moveTo(p.x * dpr, (p.y + SHIP_H) * dpr);
        ctx2d.lineTo(p.x * dpr, (p.y + SHIP_H + 160) * dpr);
        ctx2d.stroke();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── entry point ─────────────────────────────────────────── */
  function init() {
    if (REDUCED || PLAYED) { scheduleFlyby(); return; }
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
      runSequence();
    }
  });
})();
