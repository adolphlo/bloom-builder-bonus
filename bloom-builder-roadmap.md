# Bloom Builder Bonus Program — Project Roadmap

## Project Overview

A single-page React lead capture form for a real estate marketing campaign. Users scan a QR code from a physical flyer, land on the page, fill out their info, and submit. Submissions are routed to a Zapier webhook that pushes the lead directly into KW Command CRM and triggers confirmation communications.

**Live URL (target):** `bobbtherealtor.com` (custom domain via GoDaddy → GitHub Pages)  
**GitHub Username:** `adolphlo`

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Hosting | GitHub Pages | Static hosting, free, HTTPS |
| Frontend | React + Vite | Single page app |
| Form submission | Zapier Webhook (HTTP POST) | Webhook URL stored as env variable |
| CRM | KW Command | Via Zapier's native KW Command connector |
| Confirmation | Zapier automation | Email and/or SMS post-submission |
| Custom domain | bobbtherealtor.com (GoDaddy) | DNS pointed to GitHub Pages |

---

## Prerequisites Checklist

Before starting development, confirm the following are ready:

- [ ] GitHub repo created and GitHub Pages enabled
- [ ] Zapier Zap created with **Webhooks by Zapier** as trigger (Catch Hook) — **webhook URL in hand**
- [ ] Zapier Zap wired to **KW Command** connector to create/update contact
- [ ] Zapier Zap wired to confirmation email and/or SMS step
- [ ] Zapier Zap turned **ON** so webhook is live for testing
- [ ] GoDaddy DNS configured to point `bobbtherealtor.com` to GitHub Pages
- [ ] GitHub Pages custom domain set in repo Settings → Pages
- [ ] GitHub Actions secret `VITE_ZAPIER_WEBHOOK_URL` added to repo

---

## KW Command Field Mapping

Map these incoming JSON keys to the corresponding KW Command contact fields in Zapier.

| JSON Key (from form) | KW Command Field | Notes |
|---|---|---|
| `name` | First Name + Last Name | Split on first space in Zapier if needed |
| `phone` | Phone | Primary phone |
| `email` | Email | Primary email |
| `desired_monthly_payment` | Custom field or Note | Budget qualifier |
| `preferred_area` | Custom field or Note | Neighborhood/area preference |
| `timeline` | Custom field or Note | Timeline to move |
| `currently_renting` | Custom field or Note | Yes / No |
| `source` | Lead Source | Hardcode to `"Bloom Builder QR"` in Zapier |
| `submitted_at` | — | Use for Zapier internal logging |

> **Note:** KW Command's custom field availability depends on your account configuration. If custom fields aren't available, Zapier can concatenate the qualifying fields into a single Notes field on the contact record.

---

## Repository Structure

```
bloom-builder-bonus/
├── public/
│   └── CNAME                  # Contains: bobbtherealtor.com
├── src/
│   ├── App.jsx                # Main app shell
│   ├── main.jsx               # React entry point
│   ├── components/
│   │   └── LeadForm.jsx       # Form component
│   └── styles/
│       └── index.css          # Global styles
├── .env                       # Local env vars (not committed)
├── .env.example               # Template — safe to commit
├── .gitignore                 # Must include .env
├── index.html
├── vite.config.js             # Base path set to '/' for custom domain
└── package.json
```

---

## Environment Variables

The Zapier webhook URL must never be hardcoded in source. Store as an env variable.

**.env (local, gitignored):**
```
VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/XXXXXXX/XXXXXXX/
```

**.env.example (committed to repo):**
```
VITE_ZAPIER_WEBHOOK_URL=your_zapier_webhook_url_here
```

**Usage in React:**
```js
const webhookUrl = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
```

> The webhook URL is also added as a **GitHub Actions secret** named `VITE_ZAPIER_WEBHOOK_URL` and injected at build time via the deploy workflow.

---

## Form Fields

All fields are required.

| Field | Input Type | Options / Notes |
|---|---|---|
| Full Name | Text | Single field — split in Zapier if needed |
| Phone | Tel | Primary contact method |
| Email | Email | |
| Desired Monthly Payment | Text | Budget qualifier — free text e.g. "$1,500/mo" |
| Preferred Area | Text | Neighborhood or city area — free text |
| Timeline to Move | Select | ASAP / 1–3 months / 3–6 months / 6–12 months / Just exploring |
| Currently Renting | Select or Radio | Yes / No |

---

## Form Submission Flow

```
1. User fills out form and taps Submit
2. React validates all required fields client-side
3. On valid submit:
   a. Button disables and shows loading state ("Submitting...")
   b. POST JSON payload to VITE_ZAPIER_WEBHOOK_URL
   c. On success (response.ok) → replace form with success screen
   d. On error → show inline error message, re-enable submit button
4. Zapier receives POST:
   a. Creates/updates contact in KW Command
   b. Sends confirmation email and/or SMS to lead
```

### JSON Payload Shape
```json
{
  "name": "Jane Smith",
  "phone": "210-555-0100",
  "email": "jane@example.com",
  "desired_monthly_payment": "$1,500",
  "preferred_area": "Stone Oak",
  "timeline": "1-3 months",
  "currently_renting": "Yes",
  "source": "Bloom Builder QR",
  "submitted_at": "2026-05-10T14:32:00Z"
}
```

> **Important:** Zapier's Catch Hook returns a plain-text `200 OK` — do NOT call `response.json()` or it will throw a parse error even on successful submissions. Use `response.ok` to determine success.

---

## Deployment

### Vite Config
```js
// vite.config.js
export default {
  base: '/',  // '/' because we're serving from a custom domain root
}
```

### GitHub Actions Deploy Workflow
File: `.github/workflows/deploy.yml`

- Triggers on push to `main`
- Runs `npm ci && npm run build`
- Injects `VITE_ZAPIER_WEBHOOK_URL` from GitHub repository secret at build time
- Deploys `/dist` output to `gh-pages` branch

```yaml
# Key build step — injects the secret as an env var at build time
- name: Build
  run: npm run build
  env:
    VITE_ZAPIER_WEBHOOK_URL: ${{ secrets.VITE_ZAPIER_WEBHOOK_URL }}
```

### Custom Domain Setup (GoDaddy → GitHub Pages)

**Step 1 — GoDaddy DNS records:**
```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     adolphlo.github.io
```

**Step 2 — GitHub repo settings:**
- Settings → Pages → Custom domain: `bobbtherealtor.com`
- Check **Enforce HTTPS** once DNS propagates (allow up to 48hrs)

**Step 3 — CNAME file:**
- `/public/CNAME` must contain exactly one line: `bobbtherealtor.com`
- This file is critical — GitHub Pages will drop the custom domain on every deploy without it

---

## Design Direction

- **Tone:** Professional, warm, trustworthy — real estate lead gen
- **Layout:** Mobile-first (QR code traffic is ~90% mobile)
- **Reference:** An example HTML page will be provided to Claude Code — use it as the visual and layout reference
- **Must include:**
  - Campaign branding / headline at top
  - Short value proposition explaining the Bloom Builder Bonus Program
  - The lead capture form with all 7 fields
  - Submit button with loading / success / error states
  - Success screen shown after submission (replaces form in place — no page reload)
- **No navigation, no footer links** — single focused conversion page

---

## Phase Breakdown

### Phase 1 — Scaffold & Config
- [ ] Initialize Vite + React project locally (`npm create vite@latest`)
- [ ] Configure `.env` and `.env.example` with Zapier webhook URL placeholder
- [ ] Set up `.gitignore` (include `.env`)
- [ ] Configure `vite.config.js` with `base: '/'`
- [ ] Create GitHub Actions deploy workflow with secret injection
- [ ] Add `CNAME` file to `/public/` containing `bobbtherealtor.com`
- [ ] Add `VITE_ZAPIER_WEBHOOK_URL` secret to GitHub repo settings

### Phase 2 — Build the Form
- [ ] Build `LeadForm.jsx` with all 7 fields
- [ ] Client-side validation — all fields required
- [ ] POST JSON payload to Zapier webhook on submit
- [ ] Handle Zapier's plain-text response correctly (`response.ok` only — no `.json()`)
- [ ] Loading, success, and error states

### Phase 3 — Styling
- [ ] Replicate layout and style from provided example HTML
- [ ] Mobile-first responsive layout (375px min width target)
- [ ] Campaign headline and value prop copy
- [ ] Success screen after submission

### Phase 4 — Test & Deploy
- [ ] Test form submission end-to-end (form → Zapier → KW Command)
- [ ] Verify confirmation email/SMS fires in Zapier
- [ ] Deploy to GitHub Pages via Actions workflow
- [ ] Verify `bobbtherealtor.com` resolves correctly with HTTPS
- [ ] Test full flow on a real mobile device (simulate QR scan)

### Phase 5 — QR Code
- [ ] Generate QR code pointing to `https://bobbtherealtor.com`
- [ ] Test scan → page load on multiple devices
- [ ] Hand off QR to flyer designer

---

## Notes for Claude Code

- Webhook URL lives in `import.meta.env.VITE_ZAPIER_WEBHOOK_URL` — never hardcode
- Zapier Catch Hook returns plain-text `200 OK` — use `response.ok` to check success, do NOT call `response.json()`
- GitHub Pages is static only — all logic is client-side in React
- The `/public/CNAME` file containing `bobbtherealtor.com` is required or the custom domain breaks on every deploy
- `vite.config.js` base must be `'/'` since a custom domain is used (not a GitHub subdirectory path)
- An example HTML file will be provided — use it as the visual/layout reference for the design
- Mobile-first is non-negotiable — form must be fully usable at 375px viewport width
- Timeline and Currently Renting should use `<select>` dropdowns or styled radio buttons — not free text inputs
