/**
 * Seed script — inserts 8 dummy products for local development.
 *
 * Usage:
 *   npx ts-node scripts/seed.ts
 *   npm run seed
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * The service role key bypasses RLS so inserts work without an auth session.
 * Safe to run multiple times — exits early if products already exist.
 */

import dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local before anything reads process.env
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

import { createClient } from "@supabase/supabase-js";
import type { ProductInsert } from "../types/database.types";

// ─── Supabase service-role client ────────────────────────────────────────────
// Not using the Database generic here — ProductInsert types the data array
// and gives compile-time safety on the seed values themselves.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and " +
      "SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ─── Seed data ────────────────────────────────────────────────────────────────
// Picsum: https://picsum.photos/seed/<seed>/400/500 — named seeds give
// consistent images on every run.

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/400/500`;

const products: ProductInsert[] = [
  // ── Tableware ─────────────────────────────────────────────────────────────

  {
    name: "Marble Trinket Tray",
    description:
      "A smooth white marble tray with a hand-brushed gold rim. " +
      "Works equally well on a coffee table, a bathroom vanity, or a well-set dining table.",
    price: 1200,
    category: "tableware",
    color: "White",
    size: "20 × 12 cm",
    material: "Marble",
    images: [pic("marble-tray-1"), pic("marble-tray-2")],
    in_stock: true,
    featured: true, // ← featured
  },
  {
    name: "Cobalt Blue Dinner Plate",
    description:
      "A bold cobalt glaze over a ceramic base, fired at high temperature " +
      "for a finish that stays rich after years of use.",
    price: 850,
    category: "tableware",
    color: "Cobalt Blue",
    size: "27 cm",
    material: "Ceramic",
    images: [pic("cobalt-plate-1")],
    in_stock: true,
    featured: false,
  },

  // ── Kitchenware ───────────────────────────────────────────────────────────

  {
    name: "Mango Wood Serving Board",
    description:
      "Cut from a single piece of mango wood with an organic edge and a " +
      "rope handle. As easy to display as it is to use.",
    price: 2400,
    category: "kitchenware",
    color: "Natural",
    size: "40 × 25 cm",
    material: "Mango Wood",
    images: [pic("wood-board-1"), pic("wood-board-2")],
    in_stock: true,
    featured: true, // ← featured
  },
  {
    name: "Hand-thrown Clay Pasta Bowl",
    description:
      "Wide and generous with a slightly uneven rim that reminds you it was " +
      "made by hand. Sized for pasta, salad, or anything worth sharing.",
    price: 1100,
    category: "kitchenware",
    color: "Terracotta",
    size: "28 cm diameter",
    material: "Stoneware",
    images: [pic("clay-bowl-1")],
    in_stock: true,
    featured: false,
  },

  // ── Crockery ──────────────────────────────────────────────────────────────

  {
    name: "Terracotta Bud Vase Set",
    description:
      "Three terracotta bud vases in graduating heights with a matte unglazed " +
      "finish. Sold as a set of three.",
    price: 1800,
    category: "crockery",
    color: "Terracotta",
    size: "Set of 3 · 8–16 cm",
    material: "Terracotta",
    images: [pic("bud-vase-1"), pic("bud-vase-2")],
    in_stock: false, // ← out of stock
    featured: false,
  },

  // ── Cutlery ───────────────────────────────────────────────────────────────

  {
    // Minimal — only required fields, no description / color / size / material
    name: "Hammered Brass Teaspoons",
    price: 950,
    category: "cutlery",
    images: [pic("brass-spoon-1")],
  },
  {
    name: "Walnut Salad Servers",
    description:
      "Solid walnut with a satisfying weight and a smooth oil finish that " +
      "improves over time. The kind of thing you reach for every evening.",
    price: 3200,
    category: "cutlery",
    color: "Walnut Brown",
    size: "30 cm",
    material: "Walnut",
    images: [pic("walnut-servers-1"), pic("walnut-servers-2")],
    in_stock: true,
    featured: false,
  },

  // ── Home Decor ────────────────────────────────────────────────────────────

  {
    name: "Woven Seagrass Placemat",
    description:
      "Handwoven from natural seagrass with hand-stitched edges. Layers " +
      "beautifully under any plate and adds warmth to a bare table.",
    price: 650,
    category: "home_decor",
    color: "Natural",
    size: "45 × 30 cm",
    material: "Seagrass",
    images: [pic("seagrass-mat-1")],
    in_stock: true,
    featured: false,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("HAP seed script");
  console.log("───────────────");

  // Guard: skip if products already exist to avoid duplicates
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Could not check existing products:", countError.message);
    process.exit(1);
  }

  if (count && count > 0) {
    console.log(
      `Table already has ${count} product(s) — skipping to avoid duplicates.`
    );
    console.log("Delete existing rows first if you want to reseed.");
    process.exit(0);
  }

  // Insert products one-by-one so we can report per-row results
  console.log(`Inserting ${products.length} products...\n`);

  let inserted = 0;

  for (const product of products) {
    const { error } = await supabase.from("products").insert(product);

    if (error) {
      console.error(`  ✗  ${product.name}: ${error.message}`);
    } else {
      const flags = [
        product.featured && "featured",
        product.in_stock === false && "out of stock",
        !product.description && !product.color && "minimal",
      ]
        .filter(Boolean)
        .join(", ");

      console.log(`  ✓  ${product.name}${flags ? `  [${flags}]` : ""}`);
      inserted++;
    }
  }

  console.log(`\n${inserted}/${products.length} products inserted.`);

  if (inserted < products.length) {
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
