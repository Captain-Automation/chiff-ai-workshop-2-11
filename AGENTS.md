# AGENTS.md · דף הנחיתה לסדנת עוזרי AI אישיים (שיף AI)

## What this is
A single static Hebrew (RTL) landing page for a live Zoom workshop by **Chiff AI (שיף AI)** about **AI personal assistants**.
It sells registration (99 ₪ early bird) and takes payment through an embedded Invoice4U iframe. Registrant data comes only from Invoice4U (no form of our own, no Google Sheet).
Live: https://chiff-ai-workshop.netlify.app/ (also /workshop). Backup: https://captain-automation.github.io/chiff-ai-workshop-2-11/

## Structure
```
index.html            the whole page: inline CSS + inline JS, no build step, no framework
.nojekyll             tells GitHub Pages to serve files as-is
netlify.toml          Netlify config: no build, publish ".", /workshop alias, security + cache headers, hides repo docs
DEPLOY-NETLIFY-HE.md  Hebrew steps for the owner (domain part is not in use: owner chose no custom domain)
assets/
  ad-magazine.webp                the workshop ad (the only one shown). Use as-is, don't redesign.
  asher-ad.webp, chaim-ad.webp    host portraits (cropped from the original ad artwork)
  og.jpg                          1200x630 social preview (WhatsApp / Facebook)
  rubik-*.woff2                   body font (Rubik variable, Hebrew + Latin)
  logo-chiff.woff2, logo-ai.woff2 subset fonts for the CSS logo
```
Page sections, in order: hero (logo, h1, price, CTA, chat demo) → `#ads` (one ad, centered) → `#for` → `#learn` → `#tools` → `#hosts` → `#details` → `#faq` → `#pay` (price, value line, payment iframe, backup button) → footer, plus a sticky mobile CTA.

## Preview
```
python3 -m http.server 8000     # then open http://localhost:8000
```
Always check mobile first (390px wide) and desktop (1280px). Don't leave horizontal scroll.

## The payment constant (top of the `<script>` in index.html)
- `PAYMENT_URL`: the Invoice4U payment link. Used by the iframe and by the backup button "לא נטען? לתשלום בחלון נפרד" (opens in a new tab, sits right under the iframe). Change it **only** here.

## Payment section (`#pay`)
- The Invoice4U iframe shows directly. There is no registration form before it (owner's decision: rely only on Invoice4U data for now).
- Invoice4U's page has a fixed 72px grey top gap; it is trimmed with `.pay-frame iframe{height:972px;margin-top:-72px}` inside an `overflow:hidden` card. Keep it.

## Deploy
Push to `main`. Netlify (project `chiff-ai-workshop`) auto-deploys from `main` via a deploy key + GitHub webhook; GitHub Pages also serves the repo root as a backup. Live within ~1 minute; check with `?v=123` to bypass cache.
No custom domain (owner's decision, 26.10): the address is `chiff-ai-workshop.netlify.app`, used in `og:url`, `og:image` and canonical. Keep GitHub Pages up at least until after 2.11.
Netlify treats `/workshop` and `/workshop/` as the same path: never add a slash redirect between them (it loops).
The CSP in `netlify.toml` allows only self + inline; adding analytics or a pixel means adding its domains there. `frame-src` stays `https:` so the payment iframe is never blocked.
Repo must stay clean: page files only. **No secrets, no API keys, nothing about other projects.**

## Brand rules (Chiff AI)
- Brand name is said "שיף" (never "צ'יף"/"Chief").
- Logo is CSS/HTML, not an image: "Chiff" in Open Sans 700 + a rounded gold badge "AI" in Roboto Slab 800.
- Show the logo **once** on the page, with the tagline under it: **"שיף AI: פיתוח תוכנה, בוטים ואוטומציות"**. Don't use older, longer taglines.
- Palette: navy `#0a1838` / `#11255a`, gold `#e8b64c` / `#f6d48a`, text `#e9eefb`, muted `#b4c0de`. Font: Rubik.
- Position Asher first as a software developer who deeply understands technology. Avoid cheap generic "for businesses" sales talk.

## Content rules
- Topic: **AI personal assistants** that act for you. Tools taught: **Grok Bot, Instinct, Dots** (plus a surprise card that stays a secret; never name surprise tools).
- Never mention "Tab". Never write "מעבר לקלוד קוד".
- Audience: total beginners, no technical background. Step by step. Stress the huge practical value.
- Hebrew: short, plain, **plural** ("אתם", "תראו"). No long dashes (— or –).
- **No invented facts**: no hour, no later price, no testimonials, no participant counts, no guarantees, no "limited seats" unless true.
- Imagery: Haredi-appropriate and modest. **No images of women.**
- Tool claims must be verifiable from official sources:
  Dots: https://openai.com/index/introducing-dots/ · Grok Bot: https://docs.x.ai/grok-bot/overview · Instinct: https://instinct.com/

## Approved host titles (use exactly)
- **אשר שיף**: `Software Developer` / `Founder, Chiff AI`
- **חיים אבלס**: `Software Tech Lead` / `Software Development Lecturer`
- Hebrew name + English titles only. **No Hebrew title lines and no bio paragraphs** in the host cards (owner's decision; the section lead already says they're software people).

## Facts
- Monday 2.11, in the evening ("בערב"), on Zoom, 2 hours.
- 99 ₪ early-bird price until Wednesday 28.10.
- Exact hour: **TBD**. Don't write one until the owner gives it.

## Open items
- Invoice4U product (as of 25.10) shows ₪99, "סדנת עוזרי AI אישיים", header "בונים עתיד". The price after 28.10 must be changed in Invoice4U, not in this repo.
- Workshop hour not set yet.
- Price after 28.10 not set yet.
- Only one ad is shown (`ad-magazine.webp`); the second ad was removed by the owner. The ad says "להרשמה: בקישור שבכיתוב" (meant for social posts, slightly off on a landing page). Ask the owner for a new version if needed; don't edit the images.

## QA decisions (v9, Oct 2026)
- Tool cards: only verified claims. Instinct per instinct.com; Dots trimmed (no Slack/Teams, calling, "always on", "open its computer") until verified on OpenAI's page.
- Grok Bot card: 3 outcome bullets, rest behind `<details class="more">עוד יכולות +`.
- Home card: assistant prepares an order for approval, never orders by itself. Train example: "ליום ראשון בבוקר".
- Unchanged by Asher's decision: hosts (English titles only, no Hebrew bios), hour, price, ad, surprise card, H1, chat demo, CTA.
