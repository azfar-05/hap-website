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
- **Framework:** Next.js 14+ (App Router)
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
display:   clamp(2.5rem, 7vw, 4.5rem)  — Cormorant, hero headline
h1:        clamp(2rem, 5vw, 3rem)       — Cormorant, page titles
h2:        clamp(1.5rem, 3.5vw, 2rem)  — Cormorant, section headings
h3:        1.25rem                      — Cormorant, product names on cards
body:      1rem / 1.6 line-height       — DM Sans
small:     0.875rem                     — DM Sans, captions, metadata
price:     1.125rem, DM Sans 600        — always in --color-brand
```

### Spacing & Layout
- Base unit: 4px. All spacing in multiples of 4.
- Section padding: 80px top/bottom on desktop, 48px on mobile
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
card-hover: 0 8px 24px rgba(44, 31, 31, 0.12)
modal:      0 24px 64px rgba(44, 31, 31, 0.16)
```

### Signature Design Element
**Staggered editorial product grid with a masonry-inspired feel on mobile.**
On mobile, the first product card in each category section spans full width with a
taller image ratio (4:3), while subsequent cards are in a 2-column grid (3:4 portrait
ratio). This creates a magazine-layout rhythm that feels intentional and premium,
not like a generic grid of same-size cards. On desktop, the grid is a clean 4-column
layout with consistent proportions.

### Motion & Animation
Restraint is the rule. Only two animation moments:
1. **Product card hover:** subtle lift — translateY(-4px) + card-hover shadow, 200ms ease
2. **Page-level image load:** fade in from opacity 0 over 300ms once loaded
No scroll-triggered animations, no parallax, no entrance animations on text. These
read as AI-generated and slow the experience on mobile.

---

## Component Behaviour

### ProductCard
- Shows: image (lazy loaded via Next.js Image), product name (Cormorant h3),
  price (DM Sans, --color-brand), category badge (pill), in-stock indicator
- Optional fields (color, size, material) are NOT shown on the card — only on
  the product detail page
- If `in_stock` is false: show a subtle "Out of Stock" overlay on the image,
  mute the card slightly (opacity 0.7), disable WhatsApp button
- If `featured` is true: no special badge needed on catalog — featured is only
  used to populate the homepage hero section

### ProductDetail (/product/[id])
- Full-width image (or image carousel if multiple images)
- Name in display font, price prominent
- Description (if present), then attribute pills for color/size/material
  (only render pills that have values — never render empty ones)
- WhatsApp CTA button: deep link to her WhatsApp with pre-filled message:
  "Hi! I'm interested in [product name]." — make the number configurable via
  env variable NEXT_PUBLIC_WHATSAPP_NUMBER
- "Back to catalog" link, not a button

### FilterBar (/catalog)
- Categories rendered as horizontally scrollable pill tabs on mobile
  (no dropdown, no sidebar — native mobile pattern)
- Active pill: --color-brand background, white text
- Inactive pill: --color-surface background, --color-muted text, --color-border border
- "All" pill always first
- Smooth horizontal scroll, hide scrollbar visually (overflow-x: auto,
  scrollbar-width: none)

### Hero (/)
- Full-viewport-height on mobile, 85vh on desktop
- Background: --color-bg
- Left-aligned editorial layout: small eyebrow text ("homes and plates"), large
  display headline, short tagline, CTA button linking to /catalog
- Right side (desktop) or bottom (mobile): a collage of 3 featured product images
  arranged in an asymmetric stack (not a slideshow, not a single hero image)
- Featured products are pulled from Supabase where featured = true (max 3)

### Navigation
- Logo (SVG or Next.js Image) left-aligned
- "Catalog" link right-aligned on mobile (minimal nav — no hamburger menu for V1)
- Sticky on scroll, background transitions from transparent to --color-surface
  with a soft backdrop-blur on scroll
- Height: 64px mobile, 72px desktop

### Footer
- Simple, minimal. Brand name, tagline, Instagram link, WhatsApp link
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
| created_at  | timestamptz | auto     | auto-generated                                     |

**Category enum values:** `tableware` | `kitchenware` | `crockery` | `cutlery` | `home_decor`

### Supabase RLS Policies
- **Public (anon role):** SELECT only on `products` table
- **Authenticated role:** full INSERT, UPDATE, DELETE on `products` table
- **Storage bucket `product-images`:** public read, authenticated write and delete
- Enable RLS on the products table — do not skip this

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
- Add/Edit form: all product fields, image uploader (multiple images,
  drag to reorder), inline validation
- Image upload: directly to Supabase Storage, show preview before saving
- Delete: confirmation dialog before deleting (cannot be undone)
- Simple toast notifications for success/error states

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
- [ ] `/` — Hero with featured products, link to catalog
- [ ] `/catalog` — All products, category filter pills, product grid
- [ ] `/product/[id]` — Product detail, image display, attribute pills, WhatsApp CTA
- [ ] `/admin/login` — Admin login page
- [ ] `/admin` — Product management dashboard
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