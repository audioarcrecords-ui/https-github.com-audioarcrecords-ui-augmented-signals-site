/* ============================================================ *
 *  Augmented Signals — MOTHERSHIP ARRIVAL v3 "Visitation"
 *  A colossal dark hull blots out the sky. A dissonant sub-bass
 *  horn moans across the site (War of the Worlds tripod register).
 *  Bio-mechanical things glimpsed only in harsh backlit silhouette
 *  descend the beam. The hero title is torn apart, letter by
 *  letter, and hauled up into the dark. This is meant to read as
 *  a threat, not a mascot.
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
    background:radial-gradient(ellipse at 50% 22%, rgba(10,4,4,.35), rgba(0,0,0,.92) 72%);
    opacity:0;transition:opacity 1.1s ease;}
  #ms-dim.on{opacity:1;}
  #ms-redsweep{position:fixed;inset:0;z-index:9988;pointer-events:none;opacity:0;mix-blend-mode:screen;
    background:linear-gradient(180deg, rgba(255,20,20,.16), transparent 55%);}
  #ms-redsweep.on{animation:msRedSweep 1.4s ease-in-out infinite;}
  @keyframes msRedSweep{0%,100%{opacity:.15}50%{opacity:.55}}
  #ms-ship{position:fixed;left:0;top:0;z-index:9993;pointer-events:none;will-change:transform;
    filter:drop-shadow(0 26px 46px rgba(0,0,0,.85)) drop-shadow(0 0 22px rgba(255,20,20,.1));}
  .ms-alien{position:fixed;left:0;top:0;z-index:9991;pointer-events:none;will-change:transform,opacity;opacity:0;
    filter:drop-shadow(0 0 10px rgba(255,40,30,.22));}
  #ms-flash{position:fixed;inset:0;z-index:9995;pointer-events:none;background:#fff;opacity:0;}
  #ms-flash.zap{animation:msFlash .3s ease-out;}
  #ms-flash.red{background:#ff2818;}
  #ms-flash.red.zap{animation:msFlashRed .42s ease-out;}
  @keyframes msFlash{0%{opacity:.92}100%{opacity:0}}
  @keyframes msFlashRed{0%{opacity:.5}30%{opacity:.08}55%{opacity:.4}100%{opacity:0}}
  body.ms-shake{animation:msShake .6s cubic-bezier(.36,.07,.19,.97);}
  @keyframes msShake{
    0%{transform:translate(0,0)}8%{transform:translate(-9px,6px) rotate(-.3deg)}
    18%{transform:translate(8px,-8px) rotate(.3deg)}30%{transform:translate(-10px,-4px)}
    44%{transform:translate(9px,7px)}58%{transform:translate(-6px,-6px)}
    72%{transform:translate(5px,4px)}86%{transform:translate(-3px,-2px)}100%{transform:translate(0,0)}}
  body.ms-rumble{animation:msRumble .15s linear infinite;}
  @keyframes msRumble{
    0%,100%{transform:translate(0,0)}25%{transform:translate(-1.4px,1.1px)}
    50%{transform:translate(1.3px,-1.2px)}75%{transform:translate(-1.1px,-1px)}}
  body.ms-rumble-hard{animation:msRumbleHard .1s linear infinite;}
  @keyframes msRumbleHard{
    0%,100%{transform:translate(0,0)}20%{transform:translate(-2.4px,1.8px)}
    40%{transform:translate(2.2px,-2px)}60%{transform:translate(-1.9px,-1.6px)}
    80%{transform:translate(2px,1.7px)}}
  #ms-skip{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:9999;
    font-family:"Share Tech Mono",monospace;font-size:.75rem;letter-spacing:.28em;
    color:#8a6f6f;background:rgba(14,8,8,.7);border:1px solid rgba(255,50,40,.3);
    padding:8px 22px;cursor:pointer;transition:.2s;backdrop-filter:blur(4px);}
  #ms-skip:hover{color:#ff4438;border-color:#ff4438;text-shadow:0 0 10px rgba(255,60,50,.7);}
  #ms-sound{position:fixed;bottom:18px;right:18px;z-index:9999;
    font-family:"Share Tech Mono",monospace;font-size:.68rem;letter-spacing:.22em;
    color:#6f86b8;background:rgba(10,14,28,.65);border:1px solid rgba(0,240,255,.2);
    padding:6px 14px;cursor:pointer;transition:.2s;backdrop-filter:blur(4px);}
  #ms-sound:hover{color:#00f0ff;border-color:#00f0ff;}
  #ms-sound.on{color:#00f0ff;border-color:rgba(0,240,255,.55);text-shadow:0 0 8px rgba(0,240,255,.6);}
  .ms-letter{display:inline-block;will-change:transform,opacity;white-space:pre;}
  .ms-letter.up{transition:transform .62s cubic-bezier(.7,-0.5,.86,.15),opacity .5s ease-in .12s;}
  .ms-letter.jolt{animation:msJolt .09s steps(2) 2;}
  @keyframes msJolt{0%{transform:translate(0,0)}50%{transform:translate(3px,-2px) rotate(2deg)}100%{transform:translate(-2px,1px)}}
  h1.ms-reappear{animation:msReappear .5s steps(3);}
  @keyframes msReappear{
    0%{clip-path:inset(0 0 60% 0);transform:translate(-7px,0) skewX(9deg);filter:brightness(2.2);}
    33%{clip-path:inset(40% 0 0 0);transform:translate(7px,0) skewX(-7deg);}
    66%{clip-path:inset(20% 0 30% 0);transform:translate(-3px,0);}
    100%{clip-path:inset(0);transform:none;filter:none;}}
  .ms-strobe{animation:msStrobe 1.15s steps(1) infinite;}
  @keyframes msStrobe{0%,100%{opacity:.15}48%{opacity:.15}50%{opacity:1}52%{opacity:1}54%{opacity:.15}}
  .ms-strobe2{animation:msStrobe 1.15s steps(1) .58s infinite;}
  @media (prefers-reduced-motion: reduce){
    #ms-canvas,#ms-ship,#ms-dim,#ms-flash,#ms-skip,#ms-redsweep,.ms-alien{display:none!important;}}
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── mothership SVG — colossal, dark, industrial ─────────── */
  const SHIP_W = 520, SHIP_H = 210;
  const shipSVG = `
  <svg width="${SHIP_W}" height="${SHIP_H}" viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="msHull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2b2d31"/><stop offset="30%" stop-color="#17181b"/>
        <stop offset="65%" stop-color="#0a0a0c"/><stop offset="100%" stop-color="#020203"/>
      </linearGradient>
      <linearGradient id="msTopDisc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#34363a"/><stop offset="100%" stop-color="#111214"/>
      </linearGradient>
      <radialGradient id="msDome" cx="50%" cy="25%" r="80%">
        <stop offset="0%" stop-color="#26282c"/><stop offset="60%" stop-color="#0e0f11"/>
        <stop offset="100%" stop-color="#020203"/>
      </radialGradient>
      <radialGradient id="msHaze" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stop-color="#ff2818" stop-opacity=".05"/>
        <stop offset="100%" stop-color="#ff2818" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="msRimLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#565b62" stop-opacity=".7"/>
        <stop offset="100%" stop-color="#565b62" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="msPort" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff2ea"/><stop offset="40%" stop-color="#ff6a3c"/>
        <stop offset="100%" stop-color="#ff6a3c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- atmospheric red-tinged haze -->
    <ellipse cx="260" cy="110" rx="270" ry="96" fill="url(#msHaze)"/>
    <!-- dome: dark, almost no glow — a shape you can't quite read -->
    <ellipse cx="260" cy="60" rx="82" ry="46" fill="url(#msDome)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="236" cy="38" rx="30" ry="13" fill="#3a3d42" opacity=".18"/>
    <!-- main hull: heavier, more shadow, less "toy" -->
    <ellipse cx="260" cy="112" rx="252" ry="50" fill="url(#msHull)" stroke="#000" stroke-width="2"/>
    <ellipse cx="260" cy="92" rx="168" ry="28" fill="url(#msTopDisc)"/>
    <path d="M 8,110 A 252,50 0 0 1 512,110" fill="none" stroke="url(#msRimLight)" stroke-width="2"/>
    <!-- heavy panel seams / vents -->
    <ellipse cx="260" cy="112" rx="222" ry="41" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="1"/>
    <ellipse cx="260" cy="116" rx="180" ry="32" fill="none" stroke="rgba(0,0,0,.55)" stroke-width="1.4"/>
    <ellipse cx="260" cy="120" rx="132" ry="24" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="1.2"/>
    <g id="msPanelSeams" stroke="rgba(0,0,0,.55)" stroke-width="1.2"></g>
    <!-- under-hull, deep shadow -->
    <ellipse cx="260" cy="136" rx="146" ry="24" fill="#020203" stroke="#000" stroke-width="1"/>
    <ellipse cx="260" cy="142" rx="96" ry="15" fill="#000"/>
    <!-- red alert strobes (2 banks, alternating) -->
    <g id="msStrobesA"></g>
    <g id="msStrobesB"></g>
    <!-- tractor port: dull, industrial, glows orange-red when active -->
    <ellipse cx="260" cy="151" rx="52" ry="12" fill="#010102" stroke="#170504" stroke-width="1"/>
    <ellipse class="ms-port-glow" cx="260" cy="151" rx="40" ry="8" fill="url(#msPort)"/>
  </svg>`;

  /* ── bio-mechanical visitor SVG (District-9-adjacent) ────── */
  /* Rendered almost as pure backlit silhouette — a wrongness of  *
   * proportion is what reads, not detail. idx keeps ids unique. */
  const ALIEN_W = 100, ALIEN_H = 168;
  const alienSVG = (idx) => `
  <svg width="${ALIEN_W}" height="${ALIEN_H}" viewBox="0 0 100 168" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alBody${idx}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2c3630"/><stop offset="55%" stop-color="#161c18"/>
        <stop offset="100%" stop-color="#050705"/>
      </linearGradient>
      <radialGradient id="alRim${idx}" cx="50%" cy="15%" r="90%">
        <stop offset="0%" stop-color="#8dffa8" stop-opacity=".5"/>
        <stop offset="35%" stop-color="#8dffa8" stop-opacity="0"/>
        <stop offset="100%" stop-color="#8dffa8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="alEye${idx}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff6cc"/><stop offset="45%" stop-color="#ffb23c"/>
        <stop offset="100%" stop-color="#ffb23c" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="alWet${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dff5e6" stop-opacity=".14"/>
        <stop offset="100%" stop-color="#dff5e6" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- hunched, digitigrade rear legs, joint bending backward -->
    <path d="M40,108 C33,120 28,128 30,140 C31,148 30,156 27,166 L34,166
             C38,156 40,148 40,140 C41,130 44,120 48,110 Z" fill="url(#alBody${idx})"/>
    <path d="M58,108 C64,119 68,127 66,139 C65,147 66,155 69,165 L62,165
             C59,155 57,147 57,139 C56,129 54,119 51,110 Z" fill="url(#alBody${idx})"/>
    <!-- elongated forelimbs, too many joints, claw-tipped -->
    <path d="M35,68 C24,74 15,84 10,98 C7,106 5,114 6,120 L11,119
             C11,112 13,104 17,95 C22,84 29,76 38,71 Z" fill="url(#alBody${idx})"/>
    <path d="M4,118 l-4,5 M7,120 l-2,7 M10,120 l1,7 M13,119 l3,6"
          stroke="#0d130f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M65,68 C76,74 85,84 90,98 C93,106 95,114 94,120 L89,119
             C89,112 87,104 83,95 C78,84 71,76 62,71 Z" fill="url(#alBody${idx})"/>
    <path d="M96,118 l4,5 M93,120 l2,7 M90,120 l-1,7 M87,119 l-3,6"
          stroke="#0d130f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- thorax: asymmetric, ribbed, hunched forward -->
    <path d="M32,60 C28,72 27,86 31,100 C36,112 64,112 69,100 C73,86 72,72 68,60
             C63,52 58,49 50,49 C42,49 37,52 32,60 Z" fill="url(#alBody${idx})"/>
    <path d="M36,66 C40,64 60,64 64,66 M35,78 C42,76 58,76 65,78 M37,90 C43,89 57,89 63,90"
          stroke="#020302" stroke-width="1.1" fill="none" opacity=".65"/>
    <!-- neck sinew -->
    <path d="M43,42 C42,46 42,49 41,51 L59,51 C58,49 58,46 57,42 Z" fill="url(#alBody${idx})"/>
    <!-- head: long, asymmetric, tilted, no forehead — wrongness over cuteness -->
    <path d="M50,2 C62,2 71,10 72,22 C73,30 70,36 65,41 C61,45 55,47 49,46
             C41,45 34,41 30,33 C27,26 28,17 34,10 C39,5 44,2 50,2 Z"
          fill="url(#alBody${idx})" transform="rotate(-4 50 24)"/>
    <!-- glowing bioluminescent eye-slits, not "eyes" -->
    <path d="M36,24 C40,21 47,21 50,25" stroke="url(#alEye${idx})" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M52,26 C55,23.4 60,23.6 63,26.4" stroke="url(#alEye${idx})" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>
    <!-- mandible/jaw plates -->
    <path d="M40,38 C44,42 50,43.5 56,41" stroke="#020302" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M41,40.5 l-2,4 M46,42.6 l-1,4.4 M51,42.8 l1,4.2 M55,41.4 l2,3.8"
          stroke="#020302" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <!-- wet chitin specular -->
    <path d="M40,10 C46,6 55,7 61,13 C58,12 51,11 45,14 C43,15 41,17 40,19 Z" fill="url(#alWet${idx})"/>
    <!-- rim light from the beam, only readable edge in silhouette -->
    <path d="M30,2 C10,10 4,30 8,50 C10,60 16,72 26,80 L26,60 C20,48 18,32 22,18 C25,10 30,5 34,2 Z"
          fill="url(#alRim${idx})" opacity=".55"/>
  </svg>`;

  /* ── synthesized audio engine ────────────────────────────── */
  function makeAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -26; comp.ratio.value = 6; comp.knee.value = 8;
    const makeup = ctx.createGain(); makeup.gain.value = 2.4;   // compressor was squashing perceived loudness
    const limiter = ctx.createDynamicsCompressor();             // brickwall so the makeup boost can't clip
    limiter.threshold.value = -2; limiter.ratio.value = 20; limiter.knee.value = 0; limiter.attack.value = 0.002;
    master.connect(comp); comp.connect(makeup); makeup.connect(limiter); limiter.connect(ctx.destination);
    const live = new Set();
    const g = (v) => { const n = ctx.createGain(); n.gain.value = v; return n; };

    /* long dark hall — convolver with decaying noise impulse */
    const verb = ctx.createConvolver();
    {
      const sec = 4.4, rate = ctx.sampleRate;
      const buf = ctx.createBuffer(2, rate * sec, rate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3.1);
      }
      verb.buffer = buf;
    }
    const verbGain = g(0.6); verb.connect(verbGain); verbGain.connect(master);

    /* heavier distortion curve — grittier metal edge for the horn */
    const shaper = ctx.createWaveShaper();
    {
      const c = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) {
        const x = (i / 511.5) - 1;
        c[i] = Math.tanh(3.6 * x) * 0.92 + Math.sign(x) * Math.pow(Math.abs(x), 3) * 0.08;
      }
      shaper.curve = c; shaper.oversample = "4x";
    }
    const shaperOut = g(1); shaper.connect(shaperOut);
    shaperOut.connect(master); shaperOut.connect(verb);

    /* ── THE HORN ──────────────────────────────────────────
     * War of the Worlds (2005) tripod register: not a triad,
     * a dissonant cluster (root + minor 2nd + tritone) over a
     * huge sub, slow-attack moan that bends down half a step
     * and back, ring-modulated for a metallic scrape, decaying
     * into a long guttural tail through the dark verb. */
    function horn(base, dur, vol) {
      base = base || 42; dur = dur || 3.6; vol = vol || 1;
      const t = ctx.currentTime;
      const out = g(0.0001);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 0.9;
      lp.frequency.setValueAtTime(120, t);
      lp.frequency.exponentialRampToValueAtTime(900, t + dur * 0.22);
      lp.frequency.exponentialRampToValueAtTime(160, t + dur);

      /* dissonant cluster: root, tritone, minor 2nd above the octave */
      const intervals = [
        { m: 0.5,          w: 0.6  },   // sub octave
        { m: 1,             w: 0.5  },   // root
        { m: Math.pow(2, 6 / 12),  w: 0.28 }, // tritone
        { m: 2 * Math.pow(2, 1 / 12), w: 0.16 }, // octave + minor 2nd (dissonant sting)
        { m: 1.997,          w: 0.1  },
        { m: 1.003,          w: 0.1  },
      ];
      const bendDepth = base * 0.045; // ~half-step moan
      intervals.forEach((iv) => {
        const o = ctx.createOscillator(); o.type = "sawtooth";
        const f = base * iv.m;
        o.frequency.setValueAtTime(f - bendDepth * iv.m, t);
        o.frequency.linearRampToValueAtTime(f + bendDepth * 0.3 * iv.m, t + dur * 0.35);
        o.frequency.linearRampToValueAtTime(f - bendDepth * 0.6 * iv.m, t + dur);
        const og = g(iv.w);
        o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + 0.15);
      });

      /* ring-mod metallic edge, only on the attack */
      const ring = ctx.createOscillator(); ring.type = "sine"; ring.frequency.value = base * 2.41;
      const ringDepth = ctx.createGain(); ringDepth.gain.setValueAtTime(0.35, t);
      ringDepth.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.5);
      const ringOut = g(0);
      ring.connect(ringOut.gain);
      lp.connect(ringOut); ring.start(t); ring.stop(t + dur * 0.5 + 0.1);

      lp.connect(out); ringOut.connect(out); out.connect(shaper);
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.95 * vol, t + 0.55);   // slow, dreadful attack
      out.gain.setValueAtTime(0.95 * vol, t + dur * 0.55);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }

    /* continuous low rumble (looped filtered noise) */
    function rumbleStart() {
      const sec = 2.8, rate = ctx.sampleRate;
      const buf = ctx.createBuffer(1, rate * sec, rate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        last = (last + (Math.random() * 2 - 1) * 0.045) * 0.986;
        d[i] = last * 15;
      }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 64;
      const out = g(0);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.14;
      const lfoAmt = g(0.18); lfo.connect(lfoAmt); lfoAmt.connect(out.gain);
      src.connect(lp); lp.connect(out); out.connect(master);
      src.start(); lfo.start(); live.add(src); live.add(lfo);
      out.gain.setTargetAtTime(0.7, ctx.currentTime, 1.3);
      return out;
    }

    /* dissonant tractor shimmer — two close, ugly beating tones */
    function shimmerStart() {
      const out = g(0);
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 138;
      const o2 = ctx.createOscillator(); o2.type = "sawtooth"; o2.frequency.value = 146.5; // beats hard
      const vib = ctx.createOscillator(); vib.frequency.value = 3.1;
      const vibAmt = g(5); vib.connect(vibAmt); vibAmt.connect(o.frequency);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 560; bp.Q.value = 3.4;
      const trem = ctx.createOscillator(); trem.frequency.value = 12.5;
      const tremAmt = g(0.4); const tg = g(0.55);
      trem.connect(tremAmt); tremAmt.connect(tg.gain);
      o.connect(bp); o2.connect(bp); bp.connect(tg); tg.connect(out);
      out.connect(master); out.connect(verb);
      [o, o2, vib, trem].forEach(n => { n.start(); live.add(n); });
      out.gain.setTargetAtTime(0.26, ctx.currentTime, 0.5);
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
      o.frequency.setValueAtTime(1100, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.26);
      const og = g(0.001); og.gain.setValueAtTime(0.3, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(0.24);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1500;
      const ng = g(0.001); ng.gain.setValueAtTime(0.24, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(og); og.connect(master); n.connect(hp); hp.connect(ng); ng.connect(master); ng.connect(verb);
      o.start(t); o.stop(t + 0.32); n.start(t);
    }
    function whoosh() {
      const t = ctx.currentTime;
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(1.5);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.3;
      bp.frequency.setValueAtTime(220, t);
      bp.frequency.exponentialRampToValueAtTime(4200, t + 0.55);
      bp.frequency.exponentialRampToValueAtTime(500, t + 1.35);
      const ng = g(0.001);
      ng.gain.setValueAtTime(0.001, t);
      ng.gain.exponentialRampToValueAtTime(0.75, t + 0.4);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      n.connect(bp); bp.connect(ng); ng.connect(master); ng.connect(verb);
      n.start(t);
    }
    /* a jolt: sharp metallic crack for violent letter yanks */
    function crack() {
      const t = ctx.currentTime;
      const n = ctx.createBufferSource(); n.buffer = noiseBuf(0.12);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 900;
      const ng = g(0.001); ng.gain.setValueAtTime(0.16, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      n.connect(hp); hp.connect(ng); ng.connect(master);
      n.start(t);
    }
    return {
      ctx, master, horn, rumbleStart, shimmerStart, zap, whoosh, crack,
      fadeIn()  { master.gain.setTargetAtTime(0.62, ctx.currentTime, 0.6); },
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

  /* ── flybys: a distant hull crosses the sky now and then ──── */
  function scheduleFlyby() {
    if (REDUCED) return;
    const delay = 45000 + Math.random() * 55000;
    setTimeout(() => {
      const el = document.createElement("div");
      el.innerHTML = shipSVG;
      el.style.cssText = "position:fixed;z-index:5;pointer-events:none;opacity:.34;filter:blur(.5px) drop-shadow(0 0 6px rgba(255,30,20,.2));";
      const scale = 0.08 + Math.random() * 0.06;
      const y = 40 + Math.random() * (innerHeight * 0.22);
      const ltr = Math.random() > 0.5;
      el.style.top = y + "px";
      el.style.left = ltr ? -SHIP_W + "px" : innerWidth + "px";
      el.style.transform = `scale(${scale}) ${ltr ? "" : "scaleX(-1)"}`;
      el.style.transition = "left 8s linear";
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.left = ltr ? innerWidth + "px" : -SHIP_W + "px";
      }));
      setTimeout(() => el.remove(), 8500);
      scheduleFlyby();
    }, delay);
  }

  /* ── main visitation sequence ─────────────────────────────── */
  function runSequence() {
    const title = document.querySelector(".hero h1.glitch");
    if (!title) return;

    /* overlay DOM */
    const dim = document.createElement("div"); dim.id = "ms-dim";
    const redsweep = document.createElement("div"); redsweep.id = "ms-redsweep";
    const canvas = document.createElement("canvas"); canvas.id = "ms-canvas";
    const ship = document.createElement("div"); ship.id = "ms-ship"; ship.innerHTML = shipSVG;
    const flash = document.createElement("div"); flash.id = "ms-flash";
    const skip = document.createElement("button"); skip.id = "ms-skip"; skip.textContent = "SKIP TRANSMISSION ▸";
    document.body.append(dim, redsweep, canvas, ship, flash, skip);
    if (!soundBtn.isConnected) document.body.appendChild(soundBtn);

    /* radial panel seams on the hull */
    const seams = ship.querySelector("#msPanelSeams");
    for (let i = 0; i < 11; i++) {
      const a = (i / 10) * Math.PI;
      const x1 = 260 - Math.cos(a) * 168, y1 = 92 + Math.sin(a) * 28;
      const x2 = 260 - Math.cos(a) * 246, y2 = 112 + Math.sin(a) * 48;
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1);
      l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      seams.appendChild(l);
    }
    /* red alert strobe banks — two offset groups so they alternate hard */
    const strobesA = ship.querySelector("#msStrobesA");
    const strobesB = ship.querySelector("#msStrobesB");
    const N_STROBE = 9;
    for (let i = 0; i < N_STROBE; i++) {
      const a = (i / (N_STROBE - 1)) * Math.PI;
      const cx = 260 - Math.cos(a) * 232, cy = 118 + Math.sin(a) * 42;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", 3.6);
      c.setAttribute("fill", "#ff2818");
      (i % 2 === 0 ? strobesA : strobesB).appendChild(c);
    }
    strobesA.setAttribute("class", "ms-strobe");
    strobesB.setAttribute("class", "ms-strobe2");

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
      alertStart: 300, hornA: 950,
      descendStart: 500, descendEnd: 3300,
      beamOn: 3550, alienIn: 3900,
      abductStart: 4650, abductStagger: 78, abductDur: 900,
      hornB: 5350,
      aliensUp: 5950, beamOff: 6950,
      depart: 7150, departEnd: 7750, restore: 7850, end: 8600,
    };
    let start = null, phase = 0, done = false;
    let hornBFired = false;
    const TIME_SCALE = location.hash === "#msdebug" ? 0.25 : 1; // slow-mo for testing
    const particles = [];
    const shipScale = Math.min(1, innerWidth / 700);
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
          if (phase >= 1 && phase < 4) audio.horn(42, 2.6, 0.85);
        });
      } else startBeds();
    }
    const unlockEvents = ["pointerdown", "keydown", "touchend", "wheel"];
    const unlockOnce = () => { unlockAudio(); unlockEvents.forEach(e => removeEventListener(e, unlockOnce)); };
    unlockEvents.forEach(e => addEventListener(e, unlockOnce, { passive: true }));
    bootAudio();
    unlockAudio();

    soundBtn.onclick = () => {
      soundOn = !soundOn;
      localStorage.setItem("ms-sound", soundOn ? "on" : "off");
      paintBtn();
      audioWanted = soundOn;
      if (soundOn) { bootAudio(); unlockAudio(); if (audio) audio.fadeIn(); }
      else if (audio) audio.fadeOut(0.15);
    };

    /* visitors riding the beam */
    const alienDefs = [
      { fx: -0.48, size: 0.9,  tIn: T.alienIn,       bob: 0    },
      { fx:  0.02, size: 1.08, tIn: T.alienIn + 240, bob: 2.1 },
      { fx:  0.5,  size: 0.8,  tIn: T.alienIn + 480, bob: 4.4 },
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
      const hoverY = Math.max(50, r.top - 225 * shipScale);
      let x = cx, y, sc = shipScale, alpha = 1;
      if (elapsed < T.descendStart) { y = -SHIP_H * 2.2; }
      else if (elapsed < T.descendEnd) {
        const t = easeOutCubic((elapsed - T.descendStart) / (T.descendEnd - T.descendStart));
        y = -SHIP_H + (hoverY + SHIP_H) * t;
        x = cx + Math.sin(t * Math.PI * 1.4) * 30 * (1 - t);
      } else if (elapsed < T.depart) {
        y = hoverY + Math.sin(elapsed / 640) * 4;
        x = cx + Math.sin(elapsed / 900) * 5;
      } else {
        const t = easeInCubic(Math.min(1, (elapsed - T.depart) / (T.departEnd - T.depart)));
        y = hoverY - (hoverY + SHIP_H * 3) * t;
        x = cx + t * innerWidth * 0.14;
        sc = shipScale * (1 - t * 0.4);
        alpha = 1 - t * 0.9;
      }
      return { x, y, cx, r, alpha, sc };
    }

    function beamGeom(p) {
      const topY = p.y + 150 * p.sc;
      const botY = p.r.bottom + 16;
      const topW = 60 * p.sc, botW = Math.max(p.r.width * 0.72, 200);
      return { topY, botY, topW, botW, cx: p.x };
    }

    /* harsh spotlight beam: hard edges, static flicker, red-white cast */
    function drawBeam(p, elapsed, strength) {
      const b = beamGeom(p);
      if (b.botY <= b.topY) return;
      const topY = b.topY * dpr, botY = b.botY * dpr;
      const topW = b.topW * dpr, botW = b.botW * dpr, cx = b.cx * dpr;
      const flicker = elapsed % 900 < 40 ? 0.4 : (0.86 + 0.14 * Math.sin(elapsed / 19));
      const a = strength * flicker;
      const grad = ctx2d.createLinearGradient(0, topY, 0, botY);
      grad.addColorStop(0, `rgba(255,250,240,${0.5 * a})`);
      grad.addColorStop(0.45, `rgba(255,120,70,${0.14 * a})`);
      grad.addColorStop(1, `rgba(180,40,20,${0.05 * a})`);
      ctx2d.beginPath();
      ctx2d.moveTo(cx - topW / 2, topY); ctx2d.lineTo(cx + topW / 2, topY);
      ctx2d.lineTo(cx + botW / 2, botY); ctx2d.lineTo(cx - botW / 2, botY);
      ctx2d.closePath();
      ctx2d.fillStyle = grad; ctx2d.fill();
      ctx2d.strokeStyle = `rgba(255,235,220,${0.3 * a})`; ctx2d.lineWidth = 1.2 * dpr; ctx2d.stroke();
      /* ground scorch glow */
      ctx2d.beginPath();
      ctx2d.ellipse(cx, botY, botW / 2, 13 * dpr, 0, 0, Math.PI * 2);
      ctx2d.fillStyle = `rgba(255,90,50,${0.15 * a})`; ctx2d.fill();
      /* debris / static motes, harsher and faster than dust */
      if (strength > 0.3) for (let i = 0; i < 4; i++) {
        const px = cx + (Math.random() - 0.5) * botW * 0.85;
        particles.push({ x: px, y: botY - Math.random() * 26 * dpr, tx: cx, ty: topY,
          v: (2 + Math.random() * 3.4) * dpr, s: (0.6 + Math.random() * 1.8) * dpr,
          hue: Math.random() < 0.7 ? "255,235,220" : "255,120,70",
          life: 1 });
      }
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.v; p.x += (p.tx - p.x) * 0.05; p.life -= 0.011;
        const fade = Math.min(1, (p.y - p.ty) / (140 * dpr));
        if (p.y <= p.ty || p.life <= 0) { particles.splice(i, 1); continue; }
        ctx2d.fillStyle = `rgba(${p.hue},${Math.max(0, 0.85 * fade * p.life)})`;
        ctx2d.fillRect(p.x, p.y, p.s, p.s);
      }
    }

    /* visitors ride the beam: flicker into being → hover → yanked back up */
    function drawAliens(p, elapsed, beamStrength) {
      const b = beamGeom(p);
      for (const al of aliens) {
        if (elapsed < al.tIn || beamStrength <= 0) { al.el.style.opacity = 0; continue; }
        const tIn = Math.min(1, (elapsed - al.tIn) / 560);
        const drop = easeInOut(Math.min(1, (elapsed - al.tIn) / 800));
        const hoverY = b.botY - ALIEN_H * al.size - 22;
        let y = b.topY + (hoverY - b.topY) * drop;
        let opacity = tIn * 0.92;
        /* harsh strobe-like materialization, not a soft fade */
        if (tIn < 1) opacity *= Math.random() < 0.4 ? 0.15 : 0.85;
        if (elapsed >= T.aliensUp) {
          const up = easeInCubic(Math.min(1, (elapsed - T.aliensUp - al.bob * 50) / 620));
          y = hoverY + (b.topY - 30 - hoverY) * Math.max(0, up);
          opacity *= Math.max(0, 1 - Math.max(0, up) * 1.2);
        } else {
          y += Math.sin(elapsed / 560 + al.bob) * 4;
        }
        const prog = (y + ALIEN_H * al.size * 0.5 - b.topY) / (b.botY - b.topY);
        const coneW = b.topW + (b.botW - b.topW) * Math.max(0, Math.min(1, prog));
        const x = b.cx + al.fx * coneW * 0.42 - (ALIEN_W * al.size) / 2;
        const tilt = Math.sin(elapsed / 700 + al.bob) * 2.4;
        al.el.style.opacity = Math.max(0, opacity * beamStrength);
        al.el.style.transform = `translate(${x}px, ${y}px) scale(${al.size}) rotate(${tilt}deg)`;
      }
    }

    /* per-letter abduction: sharp jolt, then a violent yank up */
    let abducted = false;
    function abductLetters(p) {
      abducted = true;
      letters.forEach((el, i) => {
        setTimeout(() => {
          if (done) return;
          el.classList.add("jolt");
          if (audioLive() && i % 2 === 0) audio.crack();
          setTimeout(() => {
            if (done) return;
            const lr = el.getBoundingClientRect();
            const dx = p.cx - (lr.left + lr.width / 2);
            const dy = (p.y + 140 * p.sc) - lr.top;
            el.classList.remove("jolt");
            el.classList.add("up");
            el.style.transform =
              `translate(${dx + (Math.random() - 0.5) * 30}px, ${dy}px) rotate(${(Math.random() - 0.5) * 620}deg) scale(.08)`;
            el.style.opacity = "0";
          }, 90 / TIME_SCALE);
        }, i * T.abductStagger / TIME_SCALE);
      });
    }

    function doFlash(red) {
      flash.classList.remove("zap", "red"); void flash.offsetWidth;
      if (red) flash.classList.add("red");
      flash.classList.add("zap");
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
      setTimeout(() => title.classList.remove("ms-reappear"), 550);
    }

    function finish(skipped) {
      if (done) return;
      done = true;
      if (abducted || skipped) restoreTitle();
      else { title.innerHTML = origHTML; if (origData !== null) title.setAttribute("data-text", origData); }
      dim.classList.remove("on");
      redsweep.classList.remove("on");
      document.body.classList.remove("ms-rumble", "ms-rumble-hard", "ms-shake");
      skip.remove();
      aliens.forEach(a => a.el.remove());
      setTimeout(() => { canvas.remove(); ship.remove(); dim.remove(); redsweep.remove(); flash.remove(); }, 800);
      if (audio) { audio.fadeOut(3.2); audio.kill(8); }
      unlockEvents.forEach(e => removeEventListener(e, unlockOnce));
      sessionStorage.setItem("ms-played", "1");
      scheduleFlyby();
    }
    skip.onclick = () => { doFlash(true); finish(true); };

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
      if (phase === 0 && el >= T.alertStart) {
        phase = 0.5; dim.classList.add("on"); redsweep.classList.add("on");
        document.body.classList.add("ms-rumble");
      }
      if (phase === 0.5 && el >= T.hornA) {
        phase = 1; doShake(); document.body.classList.add("ms-rumble-hard");
        if (audioLive()) audio.horn(42, 3.6, 1);
      }
      if (phase < 2 && el >= T.beamOn) {
        phase = 2; doFlash(true);
        if (audioLive()) { audio.zap(); if (!shimmerG) shimmerG = audio.shimmerStart(); }
      }
      if (phase === 2 && el >= T.abductStart) { phase = 3; abductLetters(p); }
      if (!hornBFired && el >= T.hornB) {
        hornBFired = true;
        if (audioLive()) audio.horn(56, 2.4, 0.6);   // distant answering horn, dissonant fifth-ish up
      }
      if (phase === 3 && el >= T.depart) {
        phase = 4;
        document.body.classList.remove("ms-rumble-hard");
        if (audioLive()) { audio.horn(42, 1.8, 0.85); audio.whoosh(); }
      }
      if (phase === 4 && el >= T.restore && !title.classList.contains("ms-reappear")) {
        doFlash(false); restoreTitle();
        if (audioLive()) audio.zap();
        phase = 5;
      }
      if (el >= T.end) { finish(false); return; }

      /* beam strength envelope */
      let beam = 0;
      if (el >= T.beamOn && el < T.beamOff) beam = Math.min(1, (el - T.beamOn) / 220);
      else if (el >= T.beamOff && el < T.depart) beam = Math.max(0, 1 - (el - T.beamOff) / 200);
      if (beam > 0) drawBeam(p, el, beam);
      drawParticles();
      drawAliens(p, el, beam);

      /* position ship */
      ship.style.opacity = p.alpha;
      ship.style.transform =
        `translate(${p.x - SHIP_W / 2}px, ${p.y}px) scale(${p.sc})`;

      /* departure streak */
      if (phase >= 4 && p.alpha > 0.1) {
        ctx2d.strokeStyle = `rgba(255,120,70,${0.28 * p.alpha})`;
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
    if (scrollY > 120) { sessionStorage.setItem("ms-played", "1"); scheduleFlyby(); return; }
    if (document.hidden) {
      document.addEventListener("visibilitychange", function onVis() {
        if (!document.hidden) { document.removeEventListener("visibilitychange", onVis); init(); }
      });
      return;
    }
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
