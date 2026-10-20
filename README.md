# Ruxx Prepaid — ₦1,500,000 Crowdfunding Page

A warm, single-page crowdfunding site for **Ruxx Digital Services**, powered by
**Paystack**. Supporters give from ₦500 upward, and the page shows the live
target, the number of people who helped, the **first** helper and the person who
**completed** the goal — all read straight from Paystack. No database required.

---

## 1. Run it locally

```bash
npm install
npm run dev        # http://localhost:3000  (dev server, hot reload)
```

To check the production build:

```bash
npm run build      # lint + type-check + production bundle
npm start          # production server at http://localhost:3000
```

> **Dev and build never overwrite each other:** `npm run dev` writes to
> `.next-dev`, while `npm run build` / `npm start` use `.next`. You can keep the
> dev server open while testing a production build (or vice versa) — previously
> running both at once wiped the other's styles.

Configuration lives in `.env.local` (already created with your keys — it is
git-ignored so it can never be pushed):

```env
PAYSTACK_SECRET_KEY=sk_live_...            # server only, never exposed
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_... # safe in the browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # optional: your live domain — share
                                            # links use the visitor's own address
                                            # anyway, so this can never go wrong
```

---

## 2. How the numbers work

| Piece | Source |
|---|---|
| Total raised / people helped | `GET /transaction?status=success&from=2026-10-15`, filtered by `metadata.campaign = "ruxx-prepaid-launch"` |
| Payment actually succeeded? | `GET /transaction/verify/:reference` before anything is counted |
| Instant refresh | Webhook `POST /api/webhook` (signature-checked) clears the 30-second cache |
| Unique people | counted once per email address; payments without an email count as their own helper |
| **First helper** | the earliest successful transaction |
| **Goal completer** | the donation whose running total first reaches ₦1,500,000 |

Every donation is tagged on creation in `POST /api/checkout` with:

```json
{ "campaign": "ruxx-prepaid-launch", "donor_name": "...", "message": "...", "anonymous": "false" }
```

so your Paystack dashboard stays organised too (custom fields show as columns).

---

## 3. Paystack dashboard

- **Settings → API Keys & Webhooks**
  - **Webhook URL:** `https://your-domain.com/api/webhook`
    (optional — the page still works without it, updates just take up to 30s)
  - ⚠️ **Rotate your secret key.** Yours was pasted in plain text during setup;
    generate a new `sk_live_...` and update `PAYSTACK_SECRET_KEY` wherever the
    site runs. Takes a minute and nothing else changes.

---

## 4. Editing the content

All copy, tiers and links live in **`src/lib/campaign.ts`** — goal amount,
suggested contribution levels, story text, WhatsApp number, images. Change it
there and the whole page follows.

Images are in `public/` (`logo.png`, `my-img.png`, `hero-img.jpg`).

---

## 5. Project structure

```
src/
  app/
    page.tsx                 # server-renders the page with live stats
    layout.tsx               # fonts, metadata, Open Graph
    api/
      campaign/route.ts      # GET  - live totals from Paystack
      checkout/route.ts      # POST - creates the transaction (server-side only)
      verify/route.ts        # GET  - confirms a donation really settled
      webhook/route.ts       # POST - Paystack HMAC signature check
  lib/
    campaign.ts              # ALL editable content + settings
    share.ts                 # share-link origin — never says "localhost"
    paystack.ts              # Paystack REST wrappers
    stats.ts                 # totals, helper count, first & completing helper
  components/
    Landing.tsx              # state, polling, thank-you flow
    Hero.tsx  Story.tsx  Services.tsx  WhyFund.tsx
    GiveForm.tsx             # amount picker + Paystack popup
    HelpersWall.tsx          # first-helper spotlight, completer, live feed
    ShareSection.tsx  Trust.tsx  Footer.tsx
    StickyDonate.tsx  ThankYou.tsx  Confetti.tsx  Progress.tsx  Icons.tsx
```

---

## 6. Security notes

- The **secret key** only ever exists on the server; the browser only ever sees
  the public key.
- Amounts are decided on the server, so a supporter cannot under-pay by editing
  the page.
- Webhook payloads are verified with an HMAC-SHA512 signature comparison.
- `.env.local` is git-ignored. Never paste the secret key into client code,
  GitHub issues, or chat.
- The campaign is run by a **CAC-registered business** — RUXX DIGITAL SERVICE,
  **RC 8623757** — and the page links to the official CAC public search
  (`icrp.cac.gov.ng/public-search`) so anyone can verify the registration
  themselves before donating.
- Before the one-time account opens, a **"read this first" sheet explains the
  30-minute limit in full** (one-time, transfer immediately, money sent after
  expiry is lost), and a warning card with a **live countdown** sits under the
  Donate button — so supporters never write the number down to pay later.

---

## 7. Built for phones first

Most supporters will open this from WhatsApp on a phone, so:

- **Images are served through `next/image`** — the 1.7 MB hero banner is delivered
  to a phone as a ~60 KB WebP at the exact size needed (all images together load
  in under 100 KB). Replace `public/founder-full-v2.jpg` with any image; the
  same sizing applies automatically.
- **No horizontal scrolling** at any width from 320 px (small Android) to 1440 px.
- **Inputs are 16 px+** so iOS Safari doesn't zoom into the form, and the amount
  field uses `inputmode="numeric"` to bring up the number pad.
- The **Donate bar sticks to the bottom** of the screen while scrolling, with
  iPhone home-indicator spacing so it is never covered.
- Tap targets are at least 44 px where they matter, and the WhatsApp button
  opens the WhatsApp app directly.
