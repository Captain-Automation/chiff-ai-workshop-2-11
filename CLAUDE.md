# CLAUDE.md · דף הנחיתה לסדנת עוזרי AI אישיים (שיף AI)

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
  asher-ad.webp, chaim-ad.webp    host portraits (cropped from the original ad artwork)
  og.jpg                          1200x630 social preview (WhatsApp / Facebook); referenced as og.jpg?v=N, bump N when it changes
  rubik-*.woff2                   body font (Rubik variable, Hebrew + Latin)
  logo-chiff.woff2, logo-ai.woff2 subset fonts for the CSS logo
```
Page sections, in order: hero (logo, h1, tool pills, price + red deadline pill, CTA, chat demo) → `#for` → `#uses` (9 everyday use cases, generic, no tool claims) → `#learn` → `#tools` → `#hosts` → `#details` → `#faq` → `#pay` (price, value line, payment iframe, backup button) → footer, plus a sticky mobile CTA.

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
- Look matches the owner's promo video and status ad (repo `captain-automation/chiff-ai-workshop`, branch `claude/hopeful-bell-v8iffp`, `workshops/2026-11-04-personal-assistants/`): black-teal background with teal glow, gold gradient text, gold-outlined pills, red deadline pill.
- Palette: bg `#0b1517` / `#10242a`, teal `#14444c`, gold `#e8b64c` / `#f6d48a` (gradient `--gg`), text `#eef1ee`, muted `#a9b9b9`, red `#e5484d`. Font: Rubik.
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
- Wednesday 4.11, 20:00 to 22:00 (write "20:00 עד 22:00", no dash), on Zoom, 2 hours. (Moved from Monday 2.11; the promo video and ad are the source of truth.)
- 99 ₪ early-bird instead of 139 ₪ (save 40 ₪) until Saturday night 31.10 at midnight ("מוצאי שבת בחצות"). Shown as 99 + struck 139 + red pill.

## Open items
- Invoice4U product (as of 25.10) shows ₪99, "סדנת עוזרי AI אישיים", header "בונים עתיד". The price after 31.10 must be changed in Invoice4U, not in this repo.
- Price after 31.10 is 139 ₪: change it in Invoice4U on Saturday night.
- No ad image on the page (owner removed the ad section, 28.10). Don't add one back unless asked.

## QA decisions (v9, Oct 2026)
- Tool cards: only verified claims. Instinct per instinct.com; Dots trimmed (no Slack/Teams, calling, "always on", "open its computer") until verified on OpenAI's page.
- Grok Bot card: 3 outcome bullets, rest behind `<details class="more">עוד יכולות +`.
- Home card: assistant prepares an order for approval, never orders by itself. Train example: "ליום ראשון בבוקר".
- Unchanged by Asher's decision: hosts (English titles only, no Hebrew bios), hour, price, ad, surprise card, CTA.

## Decisions 28.10
- H1 is plural: "עוזרי AI אישיים / שעושים בשבילכם את העבודה", sub says we cover several kinds of assistants and you'll know which fits you.
- Chat demo looks like a real messaging app (header with Grok Bot, bubbles with times and ticks, input bar). It is still marked "המחשה".
- Page always opens at the top: scroll restoration off, any #hash stripped on load, CTAs scroll to #pay without adding #pay to the URL.

## Accessibility (IS 5568 / WCAG 2.0 AA)
- Required: the page sells a service to the public. Keep: skip link, `<main id="main">`, one h1, visible `:focus-visible` (gold), decorative emoji `aria-hidden`, hidden sticky CTA is `inert`, reduced-motion support, new-window link announced.
- Text contrast at least 4.5:1 (the red deadline pill is `#d13438` for that reason; `#e5484d` failed).
- Built-in accessibility menu (`#a11y-btn` / `#a11y-panel`), no external widget. Contrast filter goes on header/main/footer, never on body (a filter on body breaks the fixed elements).
- Accessibility statement page (`accessibility.html`, linked from the footer) is pending the owner's contact details for accessibility requests.
