# Presentación CRO Allura Healthcare — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `presentacion-home.html` — an interactive CRO case-study landing page comparing the original Allura Healthcare site with the new redesign, then deploy to Vercel.

**Architecture:** Single self-contained HTML file with inline `<style>` and `<script>`. Screenshots captured via Playwright before building the HTML. Drag-slider for S2/S3, side-by-side panels for S4/S5. No build step — Vercel serves as static file alongside the existing Next.js project.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid, IntersectionObserver), Vanilla JS (drag slider, touch events), Playwright (screenshots), Vercel CLI (deploy)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `playwright-screenshots.js` | Create | Captures 12 screenshots of both sites |
| `screenshots/` | Create (auto) | Stores all PNG captures |
| `presentacion-home.html` | Create | Self-contained presentation (all CSS+JS inline) |

---

## Task 0: Initialize Git (if not already a repo)

**Files:** none

- [ ] **Step 0.1: Check if git is initialized**

```powershell
git status
```

If output is `fatal: not a git repository`, run:

```powershell
git init
git add .
git commit -m "chore: initial commit — existing project files"
```

Expected: `On branch main` or `On branch master`.

---

## Task 1: Capture Screenshots with Playwright

**Files:**
- Create: `playwright-screenshots.js` (project root)
- Create: `screenshots/` (auto-created by script)

- [ ] **Step 1.1: Check Playwright availability**

```powershell
npx playwright --version
```

If not found:
```powershell
npm install -D playwright
npx playwright install chromium
```

Expected: `Version 1.x.x`

- [ ] **Step 1.2: Create screenshot script**

Create `playwright-screenshots.js` at project root:

```js
const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

const SITES = {
  original: 'https://www.allurahealthcare.com/',
  nuevo:    'https://allura-healthcare.vercel.app/',
};

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 390,  height: 844 };

async function capture() {
  const browser = await chromium.launch();

  for (const [name, url] of Object.entries(SITES)) {
    // ── Desktop ──────────────────────────────────────────────
    {
      const ctx  = await browser.newContext({ viewport: DESKTOP });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      // Full page
      await page.screenshot({
        path: path.join(DIR, `${name}-desktop.png`),
        fullPage: true,
      });

      // Hero: first viewport
      await page.screenshot({
        path: path.join(DIR, `${name}-hero.png`),
        clip: { x: 0, y: 0, width: DESKTOP.width, height: DESKTOP.height },
      });

      // Servicios: ~900px down
      await page.screenshot({
        path: path.join(DIR, `${name}-servicios.png`),
        clip: { x: 0, y: 900, width: DESKTOP.width, height: DESKTOP.height },
      });

      // Equipo: ~1800px down
      await page.screenshot({
        path: path.join(DIR, `${name}-equipo.png`),
        clip: { x: 0, y: 1800, width: DESKTOP.width, height: DESKTOP.height },
      });

      // CTA: last viewport of the page
      const bodyH = await page.evaluate(() => document.body.scrollHeight);
      await page.screenshot({
        path: path.join(DIR, `${name}-cta.png`),
        clip: { x: 0, y: Math.max(0, bodyH - DESKTOP.height), width: DESKTOP.width, height: DESKTOP.height },
      });

      await ctx.close();
    }

    // ── Mobile ───────────────────────────────────────────────
    {
      const ctx  = await browser.newContext({ viewport: MOBILE });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(DIR, `${name}-mobile.png`),
        fullPage: true,
      });
      await ctx.close();
    }

    console.log(`✓ ${name} — captured`);
  }

  await browser.close();
  console.log('All screenshots saved to /screenshots/');
}

capture().catch(err => { console.error(err.message); process.exit(1); });
```

- [ ] **Step 1.3: Run the script**

```powershell
node playwright-screenshots.js
```

Expected output:
```
✓ original — captured
✓ nuevo — captured
All screenshots saved to /screenshots/
```

Verify 12 files exist:
```powershell
ls screenshots/
```
Expected: `nuevo-cta.png`, `nuevo-desktop.png`, `nuevo-equipo.png`, `nuevo-hero.png`, `nuevo-mobile.png`, `nuevo-servicios.png`, `original-cta.png`, `original-desktop.png`, `original-equipo.png`, `original-hero.png`, `original-mobile.png`, `original-servicios.png`

- [ ] **Step 1.4: Commit**

```powershell
git add playwright-screenshots.js screenshots/
git commit -m "feat: add Playwright screenshot script and captures"
```

---

## Task 2: HTML Skeleton + Full CSS Foundation

**Files:**
- Create: `presentacion-home.html`

- [ ] **Step 2.1: Create the scaffold**

Create `presentacion-home.html` at project root:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Evolución de Allura · Caso de Éxito CRO 2025</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── Brand Variables ────────────────────────────────────── */
    :root {
      --c-primary: #051c33;
      --c-accent:  #8b9fb3;
      --c-silver:  #abacae;
      --c-bg:      #eaeeef;
      --c-white:   #ffffff;
      --c-ok:      #22c55e;
      --c-bad:     #ef4444;
      --f-title:   'Cormorant Garamond', Georgia, serif;
      --f-body:    'Montserrat', Arial, sans-serif;
      --max-w:     1200px;
      --py:        6rem;
    }

    /* ── Reset ──────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html  { scroll-behavior: smooth; }
    body  { font-family: var(--f-body); background: var(--c-bg); color: var(--c-primary); }
    img   { max-width: 100%; display: block; }
    a     { color: inherit; text-decoration: none; }

    /* ── Layout ─────────────────────────────────────────────── */
    .container { width: 100%; max-width: var(--max-w); margin: 0 auto; padding: 0 2rem; }
    section    { padding: var(--py) 0; }

    /* ── Scroll Animation ───────────────────────────────────── */
    .fade-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .fade-up:nth-child(2) { transition-delay: 0.1s; }
    .fade-up:nth-child(3) { transition-delay: 0.2s; }
    .fade-up:nth-child(4) { transition-delay: 0.3s; }

    /* ── Typography helpers ─────────────────────────────────── */
    .section-label {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--c-accent); margin-bottom: 0.75rem;
    }
    .section-title {
      font-family: var(--f-title); font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 500; line-height: 1.2; color: var(--c-primary); margin-bottom: 1rem;
    }
    .section-desc {
      font-size: 1rem; line-height: 1.7; color: #4a5568; max-width: 65ch;
    }

    /* ── Drag Slider ────────────────────────────────────────── */
    .compare-slider {
      position: relative; overflow: hidden; cursor: ew-resize;
      user-select: none; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(5,28,51,0.15);
      aspect-ratio: 16/9; background: var(--c-primary);
    }
    .compare-slider .cs-before,
    .compare-slider .cs-after  { position: absolute; inset: 0; }
    .compare-slider .cs-before img,
    .compare-slider .cs-after  img {
      width: 100%; height: 100%; object-fit: cover;
      object-position: top left; pointer-events: none;
    }
    .compare-slider .cs-after  { clip-path: inset(0 50% 0 0); }
    .compare-slider .cs-handle {
      position: absolute; top: 0; left: 50%;
      transform: translateX(-50%);
      width: 3px; height: 100%;
      background: var(--c-white); z-index: 10; pointer-events: none;
    }
    .compare-slider .cs-handle::before {
      content: '';
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 48px; height: 48px;
      background: var(--c-white); border-radius: 50%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    .compare-slider .cs-icon {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11; pointer-events: none;
      color: var(--c-primary); font-size: 1rem; font-weight: 700;
    }
    .compare-slider .cs-label {
      position: absolute; top: 1rem; padding: 0.35rem 0.85rem;
      border-radius: 4px; font-size: 0.65rem; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; z-index: 5;
    }
    .compare-slider .cs-label-before { left: 1rem;  background: rgba(5,28,51,0.7); color: var(--c-white); }
    .compare-slider .cs-label-after  { right: 1rem; background: rgba(5,28,51,0.7); color: var(--c-white); }

    /* ── Side-by-Side ───────────────────────────────────────── */
    .sbs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
    .sbs-panel { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(5,28,51,0.1); }
    .sbs-panel img { width: 100%; display: block; }
    .sbs-label {
      padding: 0.75rem 1rem; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; text-align: center;
    }
    .sbs-label.bad { background: #fee2e2; color: var(--c-bad); }
    .sbs-label.ok  { background: #dcfce7; color: var(--c-ok);  }

    /* ── Analysis Cards ─────────────────────────────────────── */
    .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }
    .analysis-card {
      background: var(--c-white); border-radius: 12px; padding: 1.5rem;
      border: 1px solid rgba(5,28,51,0.08);
    }
    .analysis-card h4 {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; margin-bottom: 1rem;
    }
    .analysis-card h4.bad { color: var(--c-bad); }
    .analysis-card h4.ok  { color: var(--c-ok);  }
    .analysis-card ul { list-style: none; }
    .analysis-card ul li {
      font-size: 0.9rem; padding: 0.4rem 0;
      border-bottom: 1px solid rgba(5,28,51,0.06); color: #4a5568; line-height: 1.5;
    }
    .analysis-card ul li:last-child { border-bottom: none; }
    .analysis-card ul li.strike { text-decoration: line-through; color: var(--c-silver); }
    .analysis-card p.note { font-size: 0.8rem; margin-top: 1rem; line-height: 1.5; color: #4a5568; }
    .analysis-card p.note.muted { color: var(--c-silver); }

    /* ── Insight Box ────────────────────────────────────────── */
    .insight {
      background: linear-gradient(135deg, var(--c-primary) 0%, #0d3660 100%);
      color: var(--c-white); border-radius: 12px; padding: 2rem; margin-top: 2rem;
    }
    .insight .insight-label {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--c-accent); margin-bottom: 0.75rem;
    }
    .insight p { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.85); }
    .insight strong { color: var(--c-white); }

    /* ── Blockquote ─────────────────────────────────────────── */
    .blockquote { border-left: 3px solid var(--c-accent); padding-left: 1.5rem; margin: 2rem 0; }
    .blockquote p {
      font-family: var(--f-title); font-size: 1.2rem;
      font-style: italic; line-height: 1.6; color: var(--c-primary);
    }

    /* ── Metric Chip ────────────────────────────────────────── */
    .chip {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: rgba(139,159,179,0.15); border: 1px solid var(--c-accent);
      border-radius: 999px; padding: 0.35rem 1rem;
      font-size: 0.8rem; font-weight: 600; color: var(--c-primary);
    }
    .chips { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; }

    /* ── Metrics Grid (S6) ──────────────────────────────────── */
    .metrics-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem; max-width: 800px; margin: 0 auto 3rem;
    }
    .metric-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; padding: 2rem 1.5rem; text-align: center;
    }
    .metric-card .metric-num {
      font-family: var(--f-title); font-size: 2.5rem;
      color: var(--c-accent); margin-bottom: 0.5rem;
    }
    .metric-card .metric-label {
      font-size: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.5;
    }

    /* ── Button ─────────────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; border-radius: 4px;
      font-family: var(--f-body); font-size: 0.85rem;
      font-weight: 600; letter-spacing: 0.05em;
      cursor: pointer; transition: all 0.2s ease;
      border: 1.5px solid transparent;
    }
    .btn-ghost {
      background: transparent; border-color: var(--c-white); color: var(--c-white);
    }
    .btn-ghost:hover { background: var(--c-white); color: var(--c-primary); }

    /* ── Keyframes ──────────────────────────────────────────── */
    @keyframes bounce {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50%       { transform: translateY(8px); opacity: 0.8; }
    }
    @keyframes pulse-badge {
      0%, 100% { box-shadow: 0 0 0 0 rgba(139,159,179,0); }
      50%       { box-shadow: 0 0 0 6px rgba(139,159,179,0.1); }
    }

    /* ── Responsive ─────────────────────────────────────────── */
    @media (max-width: 768px) {
      :root { --py: 4rem; }
      .sbs           { grid-template-columns: 1fr; }
      .analysis-grid { grid-template-columns: 1fr; }
      .metrics-grid  { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .container { padding: 0 1.25rem; }
    }
  </style>
</head>
<body>

  <!-- S1: Portada -->
  <!-- S2: Hero Banner -->
  <!-- S3: Claridad en la Oferta -->
  <!-- S4: Autoridad y Confianza -->
  <!-- S5: Optimización de Conversión -->
  <!-- S6: Cierre / CTA Final -->

  <script>
    document.addEventListener('DOMContentLoaded', () => {

      /* ── Scroll animations ──────────────────────────────── */
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

      /* ── Drag slider ────────────────────────────────────── */
      function initSlider(c) {
        const after  = c.querySelector('.cs-after');
        const handle = c.querySelector('.cs-handle');
        const icon   = c.querySelector('.cs-icon');
        let drag = false;

        function setPos(clientX) {
          const r = c.getBoundingClientRect();
          let p = Math.max(0.03, Math.min(0.97, (clientX - r.left) / r.width));
          after.style.clipPath  = `inset(0 ${(1 - p) * 100}% 0 0)`;
          handle.style.left     = `${p * 100}%`;
          if (icon) icon.style.left = `${p * 100}%`;
        }

        c.addEventListener('mousedown',  ()  => { drag = true; });
        document.addEventListener('mouseup',   ()  => { drag = false; });
        document.addEventListener('mousemove', (e) => { if (drag) setPos(e.clientX); });
        c.addEventListener('touchstart', ()  => { drag = true; },          { passive: true });
        document.addEventListener('touchend',  ()  => { drag = false; });
        document.addEventListener('touchmove', (e) => { if (drag) setPos(e.touches[0].clientX); }, { passive: true });

        const r = c.getBoundingClientRect();
        setPos(r.left + r.width * 0.5);
      }

      document.querySelectorAll('.compare-slider').forEach(initSlider);

      window.addEventListener('resize', () => {
        document.querySelectorAll('.compare-slider').forEach(c => {
          const h = c.querySelector('.cs-handle');
          const pct = parseFloat(h.style.left) / 100 || 0.5;
          c.querySelector('.cs-after').style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
        });
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2.2: Verify base loads**

Open `presentacion-home.html` in Chrome (double-click or `start presentacion-home.html`).
Expected: page background `#eaeeef`, no console errors, Google Fonts loading.

- [ ] **Step 2.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add HTML scaffold with full brand CSS and slider JS"
```

---

## Task 3: S1 — Portada / Hero

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S1: Portada -->`

- [ ] **Step 3.1: Add S1**

Replace `<!-- S1: Portada -->` with:

```html
<section id="portada" style="background:var(--c-primary);min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:4rem 0;">
  <div class="container">

    <div class="fade-up" style="display:inline-flex;align-items:center;gap:0.5rem;border:1px solid rgba(139,159,179,0.4);border-radius:999px;padding:0.4rem 1.25rem;margin-bottom:2rem;animation:pulse-badge 2.5s infinite;">
      <span style="width:6px;height:6px;background:var(--c-accent);border-radius:50%;display:inline-block;"></span>
      <span style="font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--c-accent);">Caso de Éxito · CRO 2025</span>
    </div>

    <h1 class="fade-up" style="font-family:var(--f-title);font-size:clamp(2.2rem,5vw,4.5rem);font-weight:400;line-height:1.15;color:var(--c-white);margin-bottom:1.5rem;letter-spacing:-0.01em;">
      La Evolución de Allura<br>
      <em style="color:var(--c-accent);">De Web Informativa<br>a Máquina de Conversión</em>
    </h1>

    <p class="fade-up" style="font-size:1.05rem;line-height:1.7;color:rgba(255,255,255,0.65);max-width:55ch;margin:0 auto 3rem;">
      Cómo transformamos la presencia digital de una clínica de turismo médico en Medellín en un embudo de conversión de alta performance.
    </p>

    <div class="fade-up" style="display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-bottom:4rem;">
      <div style="text-align:center;">
        <div style="font-family:var(--f-title);font-size:2.5rem;color:var(--c-white);">6</div>
        <div style="font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-accent);">Secciones optimizadas</div>
      </div>
      <div style="width:1px;background:rgba(139,159,179,0.3);align-self:stretch;"></div>
      <div style="text-align:center;">
        <div style="font-family:var(--f-title);font-size:2.5rem;color:var(--c-white);">40</div>
        <div style="font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-accent);">Páginas SEO-ready</div>
      </div>
      <div style="width:1px;background:rgba(139,159,179,0.3);align-self:stretch;"></div>
      <div style="text-align:center;">
        <div style="font-family:var(--f-title);font-size:2.5rem;color:var(--c-white);">0</div>
        <div style="font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-accent);">Fricciones innecesarias</div>
      </div>
    </div>

    <a href="#hero-banner" style="display:inline-flex;flex-direction:column;align-items:center;gap:0.5rem;color:rgba(255,255,255,0.4);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;animation:bounce 2s infinite;">
      <span>Explorar</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
    </a>

  </div>
</section>
```

- [ ] **Step 3.2: Verify S1**

Refresh browser. Expected: full-screen dark navy section, animated badge, large title, 3 stats with dividers, bouncing arrow.

- [ ] **Step 3.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S1 portada hero"
```

---

## Task 4: S2 — Hero Banner with Drag Slider

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S2: Hero Banner -->`

- [ ] **Step 4.1: Add S2**

Replace `<!-- S2: Hero Banner -->` with:

```html
<section id="hero-banner" style="background:var(--c-bg);">
  <div class="container">
    <div class="fade-up">
      <p class="section-label">Sección 1 · Atracción Emocional</p>
      <h2 class="section-title">El Hero que Conecta con el Paciente Internacional</h2>
      <p class="section-desc">El primer mensaje que ve un paciente potencial define si se queda o se va. El copy original era genérico; el nuevo apela directamente a la transformación que busca quien viaja por salud.</p>
    </div>

    <div class="fade-up" style="margin-top:2.5rem;">
      <div class="compare-slider">
        <div class="cs-before"><img src="screenshots/original-hero.png" alt="Hero original" loading="lazy"></div>
        <div class="cs-after"><img src="screenshots/nuevo-hero.png" alt="Hero nuevo" loading="lazy"></div>
        <div class="cs-handle"></div>
        <div class="cs-icon">↔</div>
        <div class="cs-label cs-label-before">Antes</div>
        <div class="cs-label cs-label-after">Después</div>
      </div>
    </div>

    <div class="analysis-grid fade-up">
      <div class="analysis-card">
        <h4 class="bad">✕ Copy original</h4>
        <ul>
          <li class="strike">Bienvenido a Allura Healthcare</li>
          <li class="strike">Servicios médicos y estéticos en Medellín</li>
          <li class="strike">Contáctenos hoy</li>
        </ul>
        <p class="note muted">Copy genérico sin propuesta de valor. No diferencia a Allura de ninguna otra clínica.</p>
      </div>
      <div class="analysis-card">
        <h4 class="ok">✓ Copy nuevo</h4>
        <ul>
          <li style="font-weight:600;color:var(--c-primary);">Salud que inspira, viajes que transforman</li>
          <li>Turismo médico de alta gama en Medellín</li>
          <li>Hablar por WhatsApp · Quiero saber más</li>
        </ul>
        <p class="note">Apela a la identidad del paciente internacional. Posiciona Medellín como destino premium, no solo como ubicación.</p>
      </div>
    </div>

    <div class="insight fade-up">
      <p class="insight-label">Insight CRO</p>
      <p>El paciente de turismo médico toma decisiones <strong>emocionales antes que racionales</strong>. Un copy que habla de "transformación" en lugar de "servicios" activa el sistema límbico y genera una primera conexión de confianza que reduce la fricción en las etapas posteriores del embudo.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4.2: Verify S2**

Refresh. Expected: slider arrastra con mouse, etiquetas Antes/Después visibles, cards de análisis con texto tachado y nuevo copy.

- [ ] **Step 4.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S2 hero banner drag slider"
```

---

## Task 5: S3 — Claridad en la Oferta (Servicios)

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S3: Claridad en la Oferta -->`

- [ ] **Step 5.1: Add S3**

Replace `<!-- S3: Claridad en la Oferta -->` with:

```html
<section id="servicios" style="background:var(--c-white);">
  <div class="container">
    <div class="fade-up">
      <p class="section-label">Sección 2 · Claridad en la Oferta</p>
      <h2 class="section-title">De Servicios Confusos a Rutas de Transformación</h2>
      <p class="section-desc">La oferta original mezclaba terminología clínica técnica con servicios fuera del perfil de la marca. El rediseño organiza todo en 4 rutas centradas en el resultado que desea el paciente.</p>
    </div>

    <div class="fade-up" style="margin-top:2.5rem;">
      <div class="compare-slider">
        <div class="cs-before"><img src="screenshots/original-servicios.png" alt="Servicios originales" loading="lazy"></div>
        <div class="cs-after"><img src="screenshots/nuevo-servicios.png" alt="Servicios nuevos" loading="lazy"></div>
        <div class="cs-handle"></div>
        <div class="cs-icon">↔</div>
        <div class="cs-label cs-label-before">Antes</div>
        <div class="cs-label cs-label-after">Después</div>
      </div>
    </div>

    <div class="analysis-grid fade-up">
      <div class="analysis-card">
        <h4 class="bad">✕ Términos eliminados</h4>
        <ul>
          <li class="strike">Terapia plástica periodontal</li>
          <li class="strike">Medicina general</li>
          <li class="strike">Oncología</li>
          <li class="strike">Cirugía bariátrica</li>
          <li class="strike">Terminología clínica inaccesible</li>
        </ul>
      </div>
      <div class="analysis-card">
        <h4 class="ok">✓ Rutas de transformación</h4>
        <ul>
          <li>Full Mouth Reconstruction</li>
          <li>Smile Makeover</li>
          <li>Aligners (Invisalign)</li>
          <li>Facial Harmony</li>
        </ul>
        <p class="note">Nombres que el paciente entiende intuitivamente y que comunican el resultado, no el procedimiento.</p>
      </div>
    </div>

    <div class="chips fade-up">
      <span class="chip">📈 4 categorías claras vs 12+ servicios dispersos</span>
      <span class="chip">🗂 Arquitectura orientada al paciente internacional</span>
    </div>
  </div>
</section>
```

- [ ] **Step 5.2: Verify S3**

Refresh. Expected: segundo slider funcional e independiente del primero, términos tachados en rojo, 4 rutas en verde, chips de métricas.

- [ ] **Step 5.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S3 servicios clarity section"
```

---

## Task 6: S4 — Autoridad y Confianza (Equipo Médico)

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S4: Autoridad y Confianza -->`

- [ ] **Step 6.1: Add S4**

Replace `<!-- S4: Autoridad y Confianza -->` with:

```html
<section id="equipo" style="background:var(--c-bg);">
  <div class="container">
    <div class="fade-up">
      <p class="section-label">Sección 3 · Autoridad y Confianza</p>
      <h2 class="section-title">El Equipo Médico como Gatillo de Autoridad</h2>
      <p class="section-desc">En turismo médico, el paciente decide confiar a distancia, en un país desconocido. Ver los rostros y credenciales del equipo es el primer requisito de confianza, no un plus.</p>
    </div>

    <div class="sbs fade-up" style="margin-top:2.5rem;">
      <div>
        <div class="sbs-panel">
          <div class="sbs-label bad">Antes — Sin presentación de equipo</div>
          <img src="screenshots/original-equipo.png" alt="Sitio original sin sección de equipo" loading="lazy">
        </div>
      </div>
      <div>
        <div class="sbs-panel">
          <div class="sbs-label ok">Después — Perfiles con credenciales verificadas</div>
          <img src="screenshots/nuevo-equipo.png" alt="Nueva sección de equipo médico" loading="lazy">
        </div>
      </div>
    </div>

    <div class="blockquote fade-up">
      <p>"El paciente internacional decide confiar en una clínica <em>antes</em> de contactarla. Ver los rostros y credenciales del equipo reduce la fricción de la primera consulta y elimina objeciones de credibilidad que de otro modo se convierten en rebotes."</p>
    </div>

    <div class="analysis-card fade-up">
      <h4 class="ok">✓ Equipo médico ahora visible en el sitio</h4>
      <ul>
        <li>Dra. Johanna Jaramillo — Prótesis Periodontal</li>
        <li>Dra. Daniela Alzate — Ortodoncista, MSc.</li>
        <li>Dr. Sebastián Muñoz — Prótesis Periodontal</li>
        <li>Dr. Santiago Henao — Ortodoncista, Diamond Top Doctor Invisalign</li>
        <li>Dr. Iván Darío Jiménez — Ortodoncista, MSc.</li>
        <li>Dr. Alejandro Cifuentes — Rehabilitación Oral</li>
      </ul>
    </div>

    <div class="insight fade-up">
      <p class="insight-label">Insight CRO</p>
      <p>Los pacientes de turismo médico valoran la <strong>transparencia del equipo</strong> por encima del precio. Una sección de equipo con fotos reales y certificaciones reduce la tasa de rebote y aumenta la intención de primer contacto.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 6.2: Verify S4**

Refresh. Expected: dos paneles lado a lado con etiquetas roja/verde, lista de 6 médicos, blockquote con borde izquierdo azul, insight oscuro.

- [ ] **Step 6.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S4 team authority section"
```

---

## Task 7: S5 — Optimización de Conversión (CTAs)

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S5: Optimización de Conversión -->`

- [ ] **Step 7.1: Add S5**

Replace `<!-- S5: Optimización de Conversión -->` with:

```html
<section id="ctas" style="background:var(--c-white);">
  <div class="container">
    <div class="fade-up">
      <p class="section-label">Sección 4 · Optimización de Conversión</p>
      <h2 class="section-title">Eliminar Fricción: De Interrupciones a Invitaciones</h2>
      <p class="section-desc">Un CTA invasivo genera rechazo. Un CTA contextual y de baja fricción guía al paciente sin interrumpir su proceso de decisión.</p>
    </div>

    <div class="sbs fade-up" style="margin-top:2.5rem;">
      <div>
        <div class="sbs-panel">
          <div class="sbs-label bad">Antes — CTA invasivo y de alta fricción</div>
          <img src="screenshots/original-cta.png" alt="CTA original" loading="lazy">
        </div>
      </div>
      <div>
        <div class="sbs-panel">
          <div class="sbs-label ok">Después — CTAs ghost contextuales</div>
          <img src="screenshots/nuevo-cta.png" alt="Nuevos CTAs" loading="lazy">
        </div>
      </div>
    </div>

    <div class="fade-up" style="margin-top:2rem;overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        <thead>
          <tr style="background:var(--c-primary);color:var(--c-white);">
            <th style="padding:0.85rem 1rem;text-align:left;font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Elemento</th>
            <th style="padding:0.85rem 1rem;text-align:left;font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#fca5a5;">✕ Antes</th>
            <th style="padding:0.85rem 1rem;text-align:left;font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#86efac;">✓ Después</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(5,28,51,0.08);">
            <td style="padding:0.85rem 1rem;font-weight:600;">CTA principal</td>
            <td style="padding:0.85rem 1rem;color:var(--c-bad);">¡Vamos a chatear! (flotante, verde neón)</td>
            <td style="padding:0.85rem 1rem;color:var(--c-ok);">Hablar por WhatsApp (ghost, contextual)</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(5,28,51,0.08);background:rgba(5,28,51,0.02);">
            <td style="padding:0.85rem 1rem;font-weight:600;">CTA secundario</td>
            <td style="padding:0.85rem 1rem;color:var(--c-bad);">Inexistente</td>
            <td style="padding:0.85rem 1rem;color:var(--c-ok);">Quiero saber más (baja fricción)</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(5,28,51,0.08);">
            <td style="padding:0.85rem 1rem;font-weight:600;">Nivel de interrupción</td>
            <td style="padding:0.85rem 1rem;color:var(--c-bad);">Alto — interfiere con la lectura</td>
            <td style="padding:0.85rem 1rem;color:var(--c-ok);">Nulo — aparece en contexto</td>
          </tr>
          <tr style="background:rgba(5,28,51,0.02);">
            <td style="padding:0.85rem 1rem;font-weight:600;">Jerarquía visual</td>
            <td style="padding:0.85rem 1rem;color:var(--c-bad);">Rompe la jerarquía del contenido</td>
            <td style="padding:0.85rem 1rem;color:var(--c-ok);">Respeta la jerarquía, guía el scroll</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="insight fade-up">
      <p class="insight-label">Insight CRO</p>
      <p>Los botones flotantes de chat generan <strong>ceguera a los CTAs</strong> (banner blindness) en usuarios con alta intención. Un CTA ghost integrado en el flujo natural de lectura tiene mayor tasa de clic en audiencias premium que los botones de alto contraste.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 7.2: Verify S5**

Refresh. Expected: side-by-side de capturas, tabla de 4 filas con header oscuro, insight CRO.

- [ ] **Step 7.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S5 CTA optimization section"
```

---

## Task 8: S6 — Cierre / CTA Final

**Files:**
- Modify: `presentacion-home.html` — replace `<!-- S6: Cierre / CTA Final -->`

- [ ] **Step 8.1: Add S6**

Replace `<!-- S6: Cierre / CTA Final -->` with:

```html
<section id="cierre" style="background:var(--c-primary);text-align:center;padding:6rem 0;">
  <div class="container">

    <p class="fade-up section-label" style="color:var(--c-accent);">Resultado</p>

    <h2 class="fade-up" style="font-family:var(--f-title);font-size:clamp(2rem,4vw,3.5rem);font-weight:400;color:var(--c-white);margin-bottom:1rem;line-height:1.2;">
      Un sitio diseñado<br>para <em style="color:var(--c-accent);">convertir</em>
    </h2>

    <p class="fade-up" style="font-size:1rem;color:rgba(255,255,255,0.6);max-width:50ch;margin:0 auto 3rem;line-height:1.7;">
      Cada decisión de diseño tiene un fundamento estratégico. El resultado es una presencia digital que trabaja como vendedor 24/7 para Allura Healthcare.
    </p>

    <div class="metrics-grid fade-up">
      <div class="metric-card">
        <div class="metric-num">6</div>
        <div class="metric-label">Secciones de<br>conversión optimizadas</div>
      </div>
      <div class="metric-card">
        <div class="metric-num">40</div>
        <div class="metric-label">Páginas<br>SEO-ready</div>
      </div>
      <div class="metric-card">
        <div class="metric-num">0</div>
        <div class="metric-label">Fricciones<br>innecesarias</div>
      </div>
    </div>

    <div class="fade-up">
      <a href="https://allura-healthcare.vercel.app/" target="_blank" rel="noopener" class="btn btn-ghost">
        Ver el nuevo sitio →
      </a>
    </div>

    <p class="fade-up" style="margin-top:3rem;font-size:0.75rem;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;">
      Allura Healthcare · Medellín, Colombia
    </p>

  </div>
</section>
```

- [ ] **Step 8.2: Verify S6**

Refresh. Expected: dark navy, 3 metric cards in a grid, ghost button that opens the new site, small footer text.

- [ ] **Step 8.3: Commit**

```powershell
git add presentacion-home.html
git commit -m "feat: add S6 closing CTA"
```

---

## Task 9: Full Page Verification

**Files:** None — verification only.

- [ ] **Step 9.1: Visual checklist**

Open `presentacion-home.html` in Chrome and verify each item:

| Item | Expected |
|---|---|
| S1 Portada | Full-screen navy, animated badge, title, 3 stats, bouncing arrow |
| Fonts | Cormorant Garamond for titles, Montserrat for body text |
| S2 Slider | Handle drags left/right, clips image correctly; Antes label left, Después label right |
| S3 Slider | Second slider works independently from first |
| S3 Cards | Strikethrough items in grey, 4 new routes in green card |
| S4 Side-by-side | Two equal panels, red/green labels, blockquote with left border |
| S5 Table | 4 rows, dark header, alternating row background |
| S6 Metrics | 3 metric cards, ghost button links to `allura-healthcare.vercel.app` |
| Scroll animations | Sections fade in as you scroll down |

- [ ] **Step 9.2: Mobile verification**

Open DevTools (F12) → Toggle Device Toolbar → set width to 390px. Verify:
- Sliders fill full width and are draggable by touch-simulation
- Side-by-side panels stack vertically
- Analysis grids stack vertically
- Metrics grid stacks vertically
- No horizontal overflow

- [ ] **Step 9.3: Broken images check**

If any screenshot shows as broken: run `node playwright-screenshots.js` again.

---

## Task 10: Deploy to Vercel

**Files:** None — deployment only.

- [ ] **Step 10.1: Verify Vercel CLI**

```powershell
npx vercel --version
```

If not installed: `npm install -g vercel`

- [ ] **Step 10.2: Login**

```powershell
npx vercel login
```

Authenticate via browser prompt.

- [ ] **Step 10.3: Deploy to production**

From project root:
```powershell
npx vercel --prod
```

Prompts and answers:
- "Set up and deploy?" → `Y`
- "Link to existing project?" → `Y`, select `allura-healthcare`
- "In which directory?" → `.`
- "Want to modify settings?" → `N`

Expected final output line:
```
✅  Production: https://allura-healthcare.vercel.app [copied to clipboard]
```

- [ ] **Step 10.4: Verify live URL**

Open `https://allura-healthcare.vercel.app/presentacion-home.html` in browser.
Verify: page loads, screenshots visible, sliders work, mobile-responsive.

- [ ] **Step 10.5: Deliver URL to user**

Provide: `https://allura-healthcare.vercel.app/presentacion-home.html`
