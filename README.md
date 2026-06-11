# HAP - Homes And Plates

A modern product showcase platform for HAP, a home decor and tableware brand. Built with Next.js and Supabase, the platform provides a public product catalog, detailed product pages, and a secure admin dashboard for managing inventory and featured content.

## What’s in the app

- Public homepage with a hero collage and an "Our Picks" featured section
- Full catalog with category filtering and empty/error states
- Product detail pages with image gallery, product attributes, and WhatsApp contact CTA
- Admin login and dashboard for managing products and homepage hero images
- Supabase-backed storage, auth, and database

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v3
- Supabase Auth, Database, and Storage
- Google Fonts: Cormorant Garamond and DM Sans

## Routes

- `/` - homepage
- `/catalog` - all products with filters
- `/product/[id]` - product detail page
- `/admin/login` - admin sign-in
- `/admin` - admin dashboard

## Repository Structure

- `app/` - application routes and page layouts
- `components/` - shared UI and admin components
- `lib/supabase/` - server, client, middleware, and admin Supabase clients
- `scripts/seed.ts` - local seed script
- `supabase/migrations/` - database and storage migrations
- `types/database.types.ts` - typed Supabase schema helpers

## Prerequisites

- Node.js 18+ recommended
- A Supabase project
- A configured admin email address
- A WhatsApp number in international format for product inquiries

## Environment Variables

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Notes:

- `ADMIN_EMAIL` is the only email allowed to access `/admin`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` should be in the format `91XXXXXXXXXX`
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create or connect a Supabase project.

3. Apply the database migrations in `supabase/migrations/`.

   The repo currently includes migrations for the `products` table, the `hero_images` table, RLS policies, and the `product-images` storage bucket.

4. Add the environment variables listed above to `.env.local`.

5. Seed sample products, if you want local demo data:

```bash
npm run seed
```

   The seed script uses the service role key and exits early if products already exist.

6. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - build the production app
- `npm run start` - start the production server
- `npm run lint` - run Next.js linting
- `npm run seed` - seed the database with sample products

## Supabase Data Model

### `products`

- `id` - uuid primary key
- `name` - product name
- `description` - optional text
- `price` - numeric INR price
- `category` - `tableware`, `kitchenware`, `crockery`, `cutlery`, or `home_decor`
- `color` - optional text
- `size` - optional text
- `material` - optional text
- `images` - array of public Supabase Storage URLs
- `in_stock` - boolean, defaults to `true`
- `featured` - boolean, defaults to `false`
- `featured_at` - timestamp used for featured sorting
- `created_at` - timestamp

### `hero_images`

- `slot` - integer primary key, values `1`, `2`, or `3`
- `image_url` - public Supabase Storage URL
- `updated_at` - timestamp

## Access Control

- Public users can read `products` and `hero_images`
- Authenticated users can manage data only through the admin area
- All storage uploads happen server-side with the service role key
- Admin access is checked against `ADMIN_EMAIL` both at login and on protected routes

## Notes

- Product cards always show the first image in the `images` array
- The homepage featured section only renders when featured products exist
- The catalog supports category filtering and a featured-only filter
- Product inquiries open WhatsApp with a pre-filled message
- The app is designed mobile-first and uses a warm editorial visual style

## Deployment

This app is ready for deployment on Vercel with the environment variables above configured in the project settings.

## Project Background

This project was built for a home decor and tableware business to provide a dedicated product showcase platform beyond social media channels. The focus was on product discovery, visual presentation, and streamlined customer inquiries through WhatsApp.

## License

ISC
