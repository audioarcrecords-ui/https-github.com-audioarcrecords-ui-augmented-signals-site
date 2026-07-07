/* ============================================================ *
 *  Augmented Signals — site behaviour
 * ============================================================ */

/* ---- year ---------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================ *
 *  Animated starfield + drifting particles background
 * ============================================================ */
(() => {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, stars, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width  = innerWidth  * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.floor((innerWidth * innerHeight) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      s: Math.random() * 1.6 + 0.3,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      st.y += st.z * 0.25 * dpr;
      if (st.y > h) { st.y = 0; st.x = Math.random() * w; }
      const tw = 0.5 + Math.random() * 0.5;
      ctx.fillStyle = st.z > 0.6
        ? `rgba(0,240,255,${0.5 * tw})`
        : `rgba(160,180,255,${0.35 * tw})`;
      ctx.fillRect(st.x, st.y, st.s * dpr, st.s * dpr);
    }
    requestAnimationFrame(tick);
  }

  addEventListener("resize", resize);
  resize();
  tick();
})();

/* ============================================================ *
 *  3D cursor-tilt on the plugin showcase
 * ============================================================ */
(() => {
  const stage = document.getElementById("stage");
  const frame = document.getElementById("pluginFrame");
  if (!stage || !frame) return;
  let raf = null;
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      frame.style.transform =
        `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) scale(1.015)`;
    });
  });
  stage.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateY(0) rotateX(0) scale(1)";
  });
})();

/* ============================================================ *
 *  Download-click event (for your analytics provider)
 *  The installer is hosted directly on the site; download counts
 *  appear in your Cloudflare dashboard (requests to /downloads/).
 * ============================================================ */
const dlBtn = document.getElementById("download-btn");
if (dlBtn) {
  dlBtn.addEventListener("click", () => {
    const plugin = dlBtn.dataset.plugin || "unknown";
    // GoatCounter custom event (if you use GoatCounter):
    if (window.goatcounter && window.goatcounter.count)
      window.goatcounter.count({ path: `download-${plugin}`, title: "Download", event: true });
    // Plausible custom event (if you use Plausible):
    if (window.plausible) window.plausible("Download", { props: { plugin } });
    // (Cloudflare Web Analytics auto-tracks the outbound click.)
  });
}

/* ============================================================ *
 *  Contact form (Web3Forms — no backend needed)
 * ============================================================ */
/* ============================================================ *
 *  3D cursor-tilt on the VoidSynth showcase
 * ============================================================ */
(() => {
  const stage = document.getElementById("vs-stage");
  const frame = document.getElementById("vsFrame");
  if (!stage || !frame) return;
  let raf = null;
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      frame.style.transform =
        `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) scale(1.015)`;
    });
  });
  stage.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateY(0) rotateX(0) scale(1)";
  });
})();

/* ============================================================ *
 *  Waitlist form (Web3Forms)
 * ============================================================ */
function getCaptchaToken(formEl) {
  const div = formEl.querySelector(".h-captcha");
  if (!div) return null;
  const widgetId = div.getAttribute("data-hcaptcha-widget-id");
  if (window.hcaptcha && widgetId) return hcaptcha.getResponse(widgetId) || null;
  return formEl.querySelector('[name="h-captcha-response"]')?.value || null;
}

function resetCaptcha(formEl) {
  if (!window.hcaptcha) return;
  const div = formEl.querySelector(".h-captcha");
  const widgetId = div && div.getAttribute("data-hcaptcha-widget-id");
  widgetId ? hcaptcha.reset(widgetId) : hcaptcha.reset();
}

const waitlistForm = document.getElementById("waitlist-form");
if (waitlistForm) {
  const status = document.getElementById("waitlist-status");
  const waitlistCaptcha = waitlistForm.querySelector(".h-captcha");
  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (waitlistCaptcha && !getCaptchaToken(waitlistForm)) {
      status.className = "form-status err";
      status.textContent = "⚠ Please complete the captcha.";
      return;
    }
    status.className = "form-status";
    status.textContent = "Transmitting…";
    try {
      const res = await fetch(waitlistForm.action, { method: "POST", body: new FormData(waitlistForm) });
      const data = await res.json();
      if (data.success) {
        status.className = "form-status ok";
        status.textContent = "✓ You're on the list. We'll signal you at launch.";
        waitlistForm.reset();
        resetCaptcha(waitlistForm);
      } else {
        throw new Error(data.message || "failed");
      }
    } catch (err) {
      status.className = "form-status err";
      const reason = err && err.message && err.message !== "failed" ? err.message.trim() : "Transmission failed.";
      status.textContent = `✗ ${reason} Email augmentedsignals@outlook.com instead.`;
    }
  });
}

const form = document.getElementById("contact-form");
if (form) {
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = form.querySelector('[name="access_key"]').value;
    if (!key || key.startsWith("YOUR_")) {
      status.className = "form-status err";
      status.textContent = "⚠ Form not configured yet — add your Web3Forms access key.";
      return;
    }
    const contactCaptcha = form.querySelector(".h-captcha");
    if (contactCaptcha && !getCaptchaToken(form)) {
      status.className = "form-status err";
      status.textContent = "⚠ Please complete the captcha.";
      return;
    }
    status.className = "form-status";
    status.textContent = "Transmitting…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        status.className = "form-status ok";
        status.textContent = "✓ Signal received. We'll get back to you.";
        form.reset();
        resetCaptcha(form);
      } else {
        throw new Error(data.message || "failed");
      }
    } catch (err) {
      status.className = "form-status err";
      const reason = err && err.message && err.message !== "failed" ? err.message.trim() : "Transmission failed.";
      status.textContent = `✗ ${reason} Email audioarcrecords@gmail.com instead.`;
    }
  });
}
