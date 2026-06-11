# HAP – Homes And Plates | Product Catalog Website

## Project Overview
A full-stack product catalog website for HAP (Homes And Plates), a home decor and
tableware business. Replaces Instagram/WhatsApp-based product showcasing with a
polished, mobile-first catalog. The target audience is entirely mobile users — every
design and layout decision must be mobile-first, with desktop as a graceful extension.

## Goals
- A beautiful, editorial-quality public catalog that feels premium and intentional
- Self-serve admin panel for the business owner to manage products without developer help
- Zero maintenance required from the developer after handoff

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database + Auth + Storage:** Supabase
- **Styling:** Tailwind CSS v3 with custom design tokens
- **Fonts:** Google Fonts (Cormorant Garamond for display, DM Sans for body)
- **Deployment:** Vercel
- **Language:** TypeScript

---

## Design System

### Brand Identity
HAP's logo uses a warm cream background with a muted rose-brown icon and wordmark.
The site must feel like a natural extension of that identity — warm, curated, artisanal.
It should feel like flipping through a beautiful lifestyle catalogue, not browsing an
e-commerce template.

### Color Palette
Use these exact values consistently. Do not substitute or approximate.

```
--color-bg:         #F5EFE6   /* warm cream — primary page background */
--color-surface:    #FDF8F2   /* slightly lighter cream — cards, panels */
--color-brand:      #A07070   /* muted rose-brown — primary brand color, logo color */
--color-accent:     #C4967A   /* terracotta — CTAs, hover states, highlights */
--color-text:       #2C1F1F   /* deep warm near-black — primary text */
--color-muted:      #7A6259   /* warm mid-brown — secondary text, labels, captions */
--color-border:     #E0D5C8   /* soft warm gray — dividers, card borders */
--color-surface-hover: #F0E8DE /* slightly darker cream — card hover state */
```

**Contrast rules (non-negotiable):**
- `--color-text` on `--color-bg`: passes WCAG AA (verified ~7:1)
- `--color-text` on `--color-surface`: passes WCAG AA
- White text on `--color-brand`: passes WCAG AA
- White text on `--color-accent`: passes WCAG AA
- Never place `--color-muted` text on `--color-border` backgrounds
- Never use pure #000000 or #FFFFFF — always use the palette values

### Typography

**Display / Headings:** Cormorant Garamond
- Use for: page titles, product names, hero headlines, section headings
- Weights: 400 (elegant, editorial) and 600 (emphasis)
- Letter spacing: slightly tracked out (+0.02em to +0.05em) at large sizes
- Never use below 18px

**Body / UI:** DM Sans
- Use for: descriptions, prices, labels, buttons, navigation, form fields
- Weights: 300 (captions), 400 (body), 500 (UI labels), 600 (buttons, emphasis)
- Clean, legible at all sizes

**Type Scale:**
```
display:   clamp(3rem, 7.5vw, 5.25rem) / 1.05 — Cormorant, hero headline
h1:        clamp(2rem, 5vw, 3rem)       — Cormorant, page titles
h2:        clamp(1.5rem, 3.5vw, 2.125rem) — Cormorant, section headings
h3:        1.25rem                      — Cormorant, product names on cards
body:      1rem / 1.6 line-height       — DM Sans
small:     0.875rem                     — DM Sans, captions, metadata
price:     1.125rem, DM Sans 600        — always in --color-brand
eyebrow:   0.6875rem, +0.28em tracking  — DM Sans 500, uppercase section labels
```

**Editorial signatures (use consistently):**
- Cormorant italic is loaded (`style: ["normal", "italic"]`) and is a core brand
  move: italic accent words in display headlines, italic piece counts, the
  footer statement line
- Eyebrow pattern: a short hairline rule (h-px, brand at 50–60% opacity) +
  tracked-out uppercase label in `text-eyebrow` — used above section headings
  site-wide (hero, catalog header, Our Picks, related products, admin sections)

### Spacing & Layout
- Base unit: 4px. All spacing in multiples of 4.
- Section padding: 104px top/bottom on desktop, 64px on mobile
- Content max-width: 1200px, centered
- Card grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- Generous whitespace — this is not a dense marketplace, it's a curated catalog

### Border Radius
```
cards:    12px
buttons:  8px
inputs:   8px
badges:   999px (pill)
images:   12px (top corners on cards), 16px on standalone
```

### Shadows
Avoid harsh box-shadows. Use soft, warm-tinted shadows only.
```
card-rest:  0 2px 8px rgba(44, 31, 31, 0.06)
card-hover: 0 12px 32px rgba(44, 31, 31, 0.12)
modal:      0 24px 64px rgba(44, 31, 31, 0.16)
btn:        0 8px 24px rgba(160, 112, 112, 0.28)   — primary CTAs (brand-tinted)
pill:       0 2px 10px rgba(160, 112, 112, 0.30)   — active filter pill
print:      0 16px 40px rgba(44, 31, 31, 0.14)     — hero collage prints
```

### Signature Design Element
**Clean uniform product grid with editorial whitespace.**
All product cards use a 1:1 square image container with `object-fit: contain` and
`--color-surface` as the image background colour. This ensures every product is
always fully visible — nothing is ever cropped or distorted, regardless of the
image's natural dimensions. The grid is 2 columns on mobile, 3 on tablet, 4 on
desktop. Generous whitespace between cards keeps the feel curated, not dense.

Admin upload guidance: "For best results, shoot on a white or warm neutral
background. Your full image will always be shown — nothing is ever cropped."

### Motion & Animation
Restraint is the rule. Motion exists only as *response to touch* and *image load* —
never as decoration. The allowed vocabulary:
1. **Product card hover:** the image tile (not the text block) lifts — translateY(-4px)
   + card-hover shadow, 300ms ease-out — while the product photo zooms to 1.04 over
   500ms. Text stays settled.
2. **Image load:** fade in from opacity 0 over 500ms once loaded
3. **Press feedback (mobile-first tactility):** interactive elements scale down on
   :active — 0.95 for pills/thumbnails, ~0.98 for cards and primary buttons, 200ms
4. **Quiet text links:** animated underline that grows left-to-right on hover
   (`.link-underline` in globals.css)
5. **Primary CTA arrows:** translate-x by 4px on hover
No scroll-triggered animations, no parallax, no entrance animations on text. These
read as AI-generated and slow the experience on mobile.

---

## Component Behaviour

### ProductCard
- Editorial text hierarchy below the image tile, in this order:
  category eyebrow (10px tracked uppercase, muted) → product name (Cormorant h3)
  → price (DM Sans 600, --color-brand, ₹ slightly smaller via `Price` component)
- No bordered category pill on cards — the eyebrow IS the category label
- Image tile: 1:1 square, object-fit: contain, --color-surface background,
  hairline ring (border at 70% opacity) + card-rest shadow
- Hover: the tile lifts and the photo zooms (see Motion); :active presses the card
- Optional fields (color, size, material) are NOT shown on the card — only on
  the product detail page
- If `in_stock` is false: subtle cream overlay with a small "Currently Unavailable"
  ring-pill anchored at the bottom of the tile, card muted to opacity 0.7
- If `featured` is true: no special badge on the card — featured drives the
  homepage "Our Picks" section and the catalog "Featured" filter pill only

### ProductDetail (/product/[id])
- Full-width image (or image carousel if multiple images)
- Image display: object-fit: contain, --color-surface background — never crop
- Category as eyebrow label above the name; name in display font; price prominent
  with a short hairline rule beneath it before the description
- Description (if present), then a quiet spec list for color/size/material:
  hairline-divided rows with tracked-uppercase terms ("COLOUR — Sage") — only
  render rows that have values, never empty ones
- WhatsApp CTA button: "Ask about this piece" — deep link to WhatsApp with
  pre-filled message: "Hi! I'm interested in [product name]." — number from
  env variable NEXT_PUBLIC_WHATSAPP_NUMBER
- On tap, button briefly shows "Opening WhatsApp…" for 1.5s before navigating
- Reassurance caption under the CTA: "Opens WhatsApp with your message ready to
  send" — light, muted, centered
- "← Keep browsing" link back to catalog — not a button

### FilterBar (/catalog)
- Categories rendered as horizontally scrollable pill tabs on mobile
  (no dropdown, no sidebar — native mobile pattern)
- Pill order: "Everything" → "Featured" → tableware → kitchenware → crockery →
  cutlery → home_decor
- "Featured" pill filters grid to only featured = true products
- Active pill: --color-brand background, white text, soft brand-tinted shadow
- Inactive pill: --color-surface background, --color-muted text, hairline ring
  (ring, not border — keeps pill size stable across states)
- Pills scale to 0.95 on press; bar is sticky under the nav with backdrop-blur
- Smooth horizontal scroll, hide scrollbar visually, with a right-edge gradient
  fade on mobile hinting that the row scrolls
- Piece count ("12 pieces") renders as an italic Cormorant line right-aligned
  above the grid — not in a separate bordered band

### Hero (/)
- Full-viewport-height on mobile (100svh), 85vh on desktop
- Background: --color-bg with two soft blurred radial glows (accent/15, brand/10)
  for warmth and depth — decorative only, pointer-events-none
- Left-aligned editorial layout: eyebrow (hairline rule + "Homes & Plates"),
  large display headline with ONE italic brand-colored accent word ("everyday"),
  short tagline in DM Sans 300, CTA button linking to /catalog with sliding arrow
- Right side (desktop) or bottom (mobile): a collage of exactly 3 hand-picked
  images from the `hero_images` table (slots 1, 2, 3) — NOT tied to featured products
- Collage images are framed as "mounted prints": thick --color-surface border
  (6px), rounded, slight alternating rotations, warm print shadow
- If hero_images slots are empty, collage area renders placeholder shapes gracefully

### "Our Picks" Section (/)
- Appears below the hero, above the footer
- Header: eyebrow ("From the collection") + "Our Picks" in Cormorant h2,
  left-aligned; "Browse everything →" link sits at the header's right on desktop,
  below the strip on mobile
- Shows products where featured = true, ordered by featured_at DESC, max 8
- Mobile: horizontally scrollable strip with scroll-snap (snap-start cards) and
  a right-edge gradient fade
- Desktop: 4-column grid
- If no featured products exist, render nothing — no heading, no empty state

### Navigation
- Logo (SVG or Next.js Image) left-aligned
- "Catalog" link right-aligned on mobile (minimal nav — no hamburger menu for V1)
- Sticky on scroll, background transitions from transparent to --color-surface
  with a soft backdrop-blur on scroll
- Height: 64px mobile, 72px desktop

### Footer
- The warm brand line "Made with care, for your everyday" leads the footer as a
  large Cormorant italic statement — it is the footer's hero moment
- Below it: brand wordmark + "Homes & Plates" eyebrow, then Instagram / WhatsApp /
  Contact links with animated underlines
- Background: --color-text (deep warm near-black), text in --color-bg
- No sitemap, no newsletter — V1 only

---

## Database Schema (Supabase)

### products table
| column      | type        | required | notes                                              |
|-------------|-------------|----------|----------------------------------------------------|
| id          | uuid        | auto     | primary key, auto-generated                        |
| name        | text        | yes      |                                                    |
| description | text        | no       | optional free text                                 |
| price       | numeric     | yes      | in INR                                             |
| category    | text        | yes      | one of the enum values below                       |
| color       | text        | no       | optional                                           |
| size        | text        | no       | optional                                           |
| material    | text        | no       | optional                                           |
| images      | text[]      | yes      | array of Supabase Storage public URLs, min 1       |
| in_stock    | boolean     | yes      | default true                                       |
| featured    | boolean     | yes      | default false                                      |
| featured_at | timestamptz | no       | set to now() when featured toggled ON, null when OFF |
| created_at  | timestamptz | auto     | auto-generated                                     |

**Category enum values:** `tableware` | `kitchenware` | `crockery` | `cutlery` | `home_decor`

### hero_images table
| column    | type        | notes                                      |
|-----------|-------------|--------------------------------------------|
| slot      | integer     | primary key, values 1, 2, 3 only           |
| image_url | text        | Supabase Storage public URL                |
| updated_at| timestamptz | auto-updated on write                      |

The hero collage always pulls all 3 slots ordered by slot ASC. This table is
completely independent of the products table and the featured flag.

### Supabase RLS Policies
- **Public (anon role):** SELECT only on `products` and `hero_images` tables
- **Authenticated role:** full INSERT, UPDATE, DELETE on `products` and `hero_images`
- **Storage bucket `product-images`:** public read, authenticated write and delete
- Enable RLS on all tables — do not skip this

---

## Authentication & Admin

- Supabase Auth, email + password
- Only one admin email is permitted. Store it in env var `ADMIN_EMAIL`
- On login: check `session.user.email === process.env.ADMIN_EMAIL` — if not,
  sign out immediately and show an error
- `/admin` and all `/admin/*` routes: server-side auth check, redirect to
  `/admin/login` if no session
- Admin login page: minimal, clean, matches brand — not a generic auth UI
- No "forgot password" flow needed for V1

### Admin Panel Features
- Product list table: name, category, price, in_stock toggle, featured toggle,
  edit button, delete button
- featured toggle: when turned ON set featured_at = now(); when OFF set featured_at = null
- Add/Edit form: all product fields, image uploader (multiple images, drag to reorder)
- Cover image: first image in the array is the catalog cover. Badge it with
  "Cover · shown in catalog" pill in --color-brand. All other images show a
  "Set as cover" button that moves them to index 0.
- Helper text below upload area: "The first image is shown on catalog cards."
  in --color-muted, text-sm, DM Sans
- Delete: confirmation dialog before deleting (cannot be undone)
- Simple toast notifications for success/error states
- Hero Collage section: 3 labeled upload slots (Slot 1, Slot 2, Slot 3), each
  shows current image with replace/remove. Independent of product management.

---

## Architecture Rules (non-negotiable)

### Supabase Storage Uploads — ALWAYS server-side
All Supabase Storage uploads MUST happen in server actions using `createAdminClient()`
(service role key). NEVER upload to Supabase Storage from a client component using
`createClient()` (anon key) — this will always fail with a permissions error.

The correct pattern:
1. Client component collects the file and builds a FormData object
2. Passes it to a server action
3. Server action uses `createAdminClient()` to upload to storage and returns the public URL

Look at how existing product image uploads are handled and follow the exact same
pattern for any new upload functionality (e.g. hero images).

### Admin client vs regular client
- `createAdminClient()` — uses SUPABASE_SERVICE_ROLE_KEY, bypasses RLS, server-only.
  Use for all admin mutations (insert, update, delete, storage writes).
- `createClient()` (server) — uses anon key + session cookie, respects RLS.
  Use for public data reads and auth operations.
- `createClient()` (client-side) — anon key only, no write permissions to storage.
  Never use for uploads or mutations.

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=   # format: 91XXXXXXXXXX (country code + number)
```

---

## V1 Scope (build only this)
- [ ] `/` — Hero collage + "Our Picks" featured section + link to catalog
- [ ] `/catalog` — All products, filter pills (Everything / Featured / categories), product grid
- [ ] `/product/[id]` — Product detail, image display, attribute pills, WhatsApp CTA
- [ ] `/admin/login` — Admin login page
- [ ] `/admin` — Product management dashboard + Hero Collage manager
- [ ] Fully responsive on all screen sizes (mobile-first)
- [ ] Deployed to Vercel with environment variables configured

## Strictly Out of Scope for V1
- Cart, checkout, payments
- Search
- Reviews or ratings
- Blog
- Instagram feed embed
- Animations beyond the two specified above
- Multiple admin users
- Forgot password / email verification flows

---

## Code Quality Rules
- TypeScript strict mode — no `any` types
- All Supabase calls typed against the schema
- Next.js Image component for every image — no raw `<img>` tags
- No inline styles — Tailwind classes only, with custom tokens in tailwind.config
- Mobile-first CSS — base styles are mobile, `md:` and `lg:` are overrides
- Optional fields must be null-checked before rendering — never render empty
  UI elements for missing data
- WhatsApp number and admin email must come from env variables — never hardcoded

## Micro-copy Reference
Use this language consistently across the UI. Never use the generic alternatives.

| Context                  | Use this               | Not this          |
|--------------------------|------------------------|-------------------|
| Filter pill — all        | "Everything"           | "All"             |
| Homepage featured section| "Our Picks"            | "Featured"        |
| Out of stock state       | "Currently Unavailable"| "Out of Stock"    |
| WhatsApp CTA button      | "Ask about this piece" | "Buy on WhatsApp" |
| Back to catalog link     | "← Keep browsing"      | "Back to catalog" |
| Price currency symbol    | ₹ (slightly smaller than number) | Rs. / INR |