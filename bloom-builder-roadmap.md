# Bloom Builder Bonus Program — Project Roadmap

## Project Overview

A single-page React lead capture form for a real estate marketing campaign. Users scan a QR code from a physical flyer, land on the page, fill out their info, and submit. Submissions are routed to a Zapier webhook that pushes the lead directly into KW Command CRM and triggers confirmation communications.

**Live URL:** `https://bonus.bobbtherealtor.com` ✅ LIVE  
**GitHub Repo:** `https://github.com/adolphlo/bloom-builder-bonus`  
**GitHub Username:** `adolphlo`

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Hosting | GitHub Pages | Static hosting, free, HTTPS |
| Frontend | React + Vite | Single page app |
| Form submission | Zapier Webhook (HTTP POST, no-cors) | Webhook URL stored as env variable |
| CRM | KW Command | Via Zapier's native KW Command connector |
| Confirmation | Zapier automation | Email and/or SMS post-submission |
| Custom domain | bonus.bobbtherealtor.com (GoDaddy) | CNAME → adolphlo.github.io |

---

## Prerequisites Checklist

- [x] GitHub repo created and GitHub Pages enabled
- [x] Zapier Zap created with **Webhooks by Zapier** as trigger (Catch Hook) — webhook URL in hand
- [x] Zapier Zap wired to **KW Command** connector to create/update contact
- [x] Zapier Zap wired to confirmation email and/or SMS step
- [x] Zapier Zap turned **ON** so webhook is live
- [x] GoDaddy DNS CNAME record pointing `bonus.bobbtherealtor.com` → `adolphlo.github.io`
- [x] GitHub Pages custom domain set to `bonus.bobbtherealtor.com` (Settings → Pages)
- [x] GitHub Actions secret `VITE_ZAPIER_WEBHOOK_URL` added to repo
- [ ] Test full flow on a real mobile device (simulate QR scan)

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
| `source` | Lead Source | Hardcoded to `"Bloom Builder QR"` in payload |
| `submitted_at` | — | Use for Zapier internal logging |

> **Note:** KW Command's custom field availability depends on your account configuration. If custom fields aren't available, Zapier can concatenate the qualifying fields into a single Notes field on the contact record.

---

## Repository Structure

```
bloom-builder-bonus/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Pages API deploy (push to main → build → deploy)
├── examples/
│   └── bloom-builder-bonus-landing-page.html  # Reference HTML for design
├── public/
│   └── CNAME                      # Contains: bonus.bobbtherealtor.com
├── src/
│   ├── App.jsx                    # Full page layout (hero, bonus section, footer)
│   ├── main.jsx                   # React entry point
│   ├── components/
│   │   └── LeadForm.jsx           # Form + success/error states
│   └── styles/
│       └── index.css              # Global styles (mobile-first)
├── .env                           # Local env vars (not committed)
├── .env.example                   # Template — safe to commit
├── .gitignore                     # Excludes .env, node_modules, dist
├── index.html
├── vite.config.js                 # base: '/' for custom domain root
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
const WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
```

> The webhook URL is also added as a **GitHub Actions secret** named `VITE_ZAPIER_WEBHOOK_URL` and injected at build time via the deploy workflow.

---

## Form Fields

All fields are required.

| Field | Input Type | Options / Notes |
|---|---|---|
| Full Name | Text | Single field — split in Zapier if needed |
| Phone | Tel | Primary contact method |
| Email | Email | Regex validated |
| Desired Monthly Payment | Text | Budget qualifier — free text e.g. "$1,500/mo" |
| Preferred Area | Text | Neighborhood or city area — free text |
| Timeline to Move | Select | ASAP / 1–3 months / 3–6 months / 6–12 months / Just exploring |
| Currently Renting | Select | Yes / No |

---

## Form Submission Flow

```
1. User fills out form and taps Submit
2. React validates all required fields client-side
3. On valid submit:
   a. Button disables and shows loading state ("Submitting…")
   b. POST JSON payload to VITE_ZAPIER_WEBHOOK_URL with mode: 'no-cors'
   c. If fetch does not throw → show success screen (replaces form in place)
   d. On network error → show inline error message, re-enable submit button
4. Success screen includes link to www.bobbtherealtor.com
5. Zapier receives POST:
   a. Creates/updates contact in KW Command
   b. Sends confirmation email and/or SMS to lead
   c. Sends admin notification email to Bobby
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

> **Important:** Zapier's Catch Hook triggers a CORS preflight failure when `Content-Type: application/json` is set. The fetch uses `mode: 'no-cors'` with no Content-Type header — the body is still a JSON string and Zapier parses it correctly. Because the response is opaque with `no-cors`, success is determined by the fetch not throwing rather than checking `response.ok`.

---

## Zapier Admin Notification Email

Add an **Email by Zapier** step after the KW Command step in your Zap.

**To:** bobbyherrera@kw.com  
**Subject:** `New Bloom Builder Lead: {{name}} — {{preferred_area}}`  
**Body type:** HTML  
**Body:**

```html
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #efc0c8;border-radius:12px;overflow:hidden;">
  <div style="background:#d66f82;padding:20px 28px;">
    <h2 style="color:#fff;margin:0;font-size:20px;">New Lead — Bloom Builder Bonus</h2>
  </div>
  <div style="padding:28px;">
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;width:40%;">Name</td>
        <td style="padding:10px 0;font-weight:700;">{{name}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Phone</td>
        <td style="padding:10px 0;font-weight:700;">{{phone}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Email</td>
        <td style="padding:10px 0;font-weight:700;">{{email}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Monthly Budget</td>
        <td style="padding:10px 0;font-weight:700;">{{desired_monthly_payment}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Preferred Area</td>
        <td style="padding:10px 0;font-weight:700;">{{preferred_area}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Timeline</td>
        <td style="padding:10px 0;font-weight:700;">{{timeline}}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0e3;">
        <td style="padding:10px 0;color:#888;">Currently Renting</td>
        <td style="padding:10px 0;font-weight:700;">{{currently_renting}}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#888;">Submitted</td>
        <td style="padding:10px 0;">{{submitted_at}}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:16px;background:#fff7f8;border-radius:8px;border-left:4px solid #d66f82;">
      <strong>Source:</strong> Bloom Builder QR Flyer
    </div>
  </div>
</div>
```

---

## Deployment

### Vite Config
```js
// vite.config.js
export default {
  base: '/',  // '/' because we're serving from a custom domain root
}
```

> Note: The `adolphlo.github.io/bloom-builder-bonus/` URL will show a white page because assets are root-relative. Always use `https://bonus.bobbtherealtor.com` to access the live site.

### GitHub Actions Deploy Workflow
File: `.github/workflows/deploy.yml`

- Triggers on push to `main`
- Runs `npm ci && npm run build`
- Injects `VITE_ZAPIER_WEBHOOK_URL` from GitHub repository secret at build time
- Deploys via GitHub Pages API (`actions/deploy-pages`)
- Source in Pages settings must be set to **GitHub Actions** (not "Deploy from a branch")

```yaml
# Key steps
- name: Build
  run: npm run build
  env:
    VITE_ZAPIER_WEBHOOK_URL: ${{ secrets.VITE_ZAPIER_WEBHOOK_URL }}

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: "./dist"

- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4
```

### Custom Domain Setup (GoDaddy → GitHub Pages)

**DNS record (subdomain — does not affect existing bobbtherealtor.com A records):**
```
Type    Name    Value
CNAME   bonus   adolphlo.github.io
```

**GitHub Pages settings:**
- Settings → Pages → Source: **GitHub Actions**
- Custom domain: `bonus.bobbtherealtor.com`
- **Enforce HTTPS** — enabled once DNS propagates

**CNAME file:**
- `/public/CNAME` contains exactly one line: `bonus.bobbtherealtor.com`
- This file is committed and deployed with every build — required or GitHub Pages drops the custom domain

---

## Design Direction

- **Tone:** Professional, warm, trustworthy — real estate lead gen
- **Layout:** Mobile-first (QR code traffic is ~90% mobile)
- **Brand color:** `#d66f82` (rose/pink)
- **Reference:** `examples/bloom-builder-bonus-landing-page.html`
- **Includes:**
  - Campaign branding / headline at top with background image
  - Short value proposition explaining the Bloom Builder Bonus Program
  - The lead capture form with all 7 fields
  - Trust badges (3-column grid)
  - Submit button with loading / success / error states
  - Success screen with link to `www.bobbtherealtor.com`
  - Bloom Builder Bonus section below the fold
  - Footer with Bobby's contact info

---

## Phase Breakdown

### Phase 1 — Scaffold & Config ✅
- [x] Initialize Vite + React project manually (directory was not empty)
- [x] Configure `.env` and `.env.example` with Zapier webhook URL placeholder
- [x] Set up `.gitignore` (includes `.env`, `node_modules`, `dist`)
- [x] Configure `vite.config.js` with `base: '/'`
- [x] Create GitHub Actions deploy workflow with secret injection
- [x] Add `CNAME` file to `/public/`
- [x] Add `VITE_ZAPIER_WEBHOOK_URL` secret to GitHub repo settings

### Phase 2 — Build the Form ✅
- [x] Build `LeadForm.jsx` with all 7 fields (controlled inputs)
- [x] Client-side validation — all fields required, email regex checked
- [x] POST JSON payload to Zapier webhook on submit (`mode: 'no-cors'`)
- [x] Loading, success, and error states
- [x] Success screen replaces form in place — no page reload
- [x] Success screen includes link to `www.bobbtherealtor.com`

### Phase 3 — Styling ✅
- [x] Full page layout matching reference HTML (hero, bonus section, footer)
- [x] Mobile-first responsive layout (375px min width, breakpoint at 880px)
- [x] Campaign headline and value prop copy
- [x] Trust badges, brand colors, background image
- [x] Focus states, hover states, disabled button state

### Phase 4 — Test & Deploy ✅
- [x] Test form submission end-to-end (form → Zapier payload confirmed)
- [x] Fixed CORS issue — switched to `mode: 'no-cors'` fetch
- [x] Fixed deploy workflow — switched from JamesIves branch action to GitHub Pages API
- [x] Deployed to GitHub Pages via Actions workflow (green)
- [x] Custom domain `bonus.bobbtherealtor.com` live with HTTPS
- [ ] Verify confirmation email/SMS fires in Zapier
- [ ] Test full flow on a real mobile device (simulate QR scan)

### Phase 5 — QR Code
- [ ] Generate QR code pointing to `https://bonus.bobbtherealtor.com`
- [ ] Test scan → page load on multiple devices
- [ ] Hand off QR to flyer designer

---

## Implementation Notes

- Zapier Catch Hook triggers CORS preflight when `Content-Type: application/json` is set — use `mode: 'no-cors'` with no Content-Type header; Zapier parses the JSON body regardless
- With `mode: 'no-cors'` the response is opaque (status 0) — do NOT check `response.ok`; treat any non-throw as success
- GitHub Pages is static only — all logic is client-side in React
- `vite.config.js` base must be `'/'` since serving from a custom domain root
- The `/public/CNAME` file is required on every deploy or GitHub Pages drops the custom domain
- Mobile-first is non-negotiable — form must be fully usable at 375px viewport width
- The `adolphlo.github.io/bloom-builder-bonus/` URL will always show a white page (assets are root-relative) — use `bonus.bobbtherealtor.com`
