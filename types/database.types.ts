export type Category = string

export type CategoryRow = {
  id: string
  name: string
  slug: string
  display_order: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  color: string | null
  size: string | null
  material: string | null
  images: string[]
  in_stock: boolean
  featured: boolean
  featured_at: string | null
  created_at: string
}

/** Columns with DB defaults or no NOT NULL are optional on insert. */
export type ProductInsert = {
  name: string
  price: number
  category: string
  images: string[]
  description?: string | null
  color?: string | null
  size?: string | null
  material?: string | null
  in_stock?: boolean
  featured?: boolean
  featured_at?: string | null
}

export type HeroSlot = {
  slot: number
  image_url: string
  updated_at: string
}

/**
 * Database schema type for the Supabase client.
 *
 * Row / Insert / Update use inline types (not named-type references) and
 * include a `[key: string]: unknown` index signature so they satisfy
 * Supabase's GenericTable constraint (which requires Record<string, unknown>).
 * Without the index signature, TypeScript resolves Schema to `never` and
 * makes all write-operation parameter types `never`.
 *
 * Named types (Product, ProductInsert, HeroSlot) are kept as separate exports
 * and used throughout the rest of the codebase — explicit casts from Row →
 * Product are needed when consuming Supabase select results.
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          color: string | null
          size: string | null
          material: string | null
          images: string[]
          in_stock: boolean
          featured: boolean
          featured_at: string | null
          created_at: string
          [key: string]: unknown
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          color?: string | null
          size?: string | null
          material?: string | null
          images: string[]
          in_stock?: boolean
          featured?: boolean
          featured_at?: string | null
          created_at?: string
          [key: string]: unknown
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          color?: string | null
          size?: string | null
          material?: string | null
          images?: string[]
          in_stock?: boolean
          featured?: boolean
          featured_at?: string | null
          created_at?: string
          [key: string]: unknown
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          display_order: number
          created_at: string
          [key: string]: unknown
        }
        Insert: {
          id?: string
          name: string
          slug: string
          display_order?: number
          created_at?: string
          [key: string]: unknown
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          display_order?: number
          created_at?: string
          [key: string]: unknown
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          slot: number
          image_url: string
          updated_at: string
          [key: string]: unknown
        }
        Insert: {
          slot: number
          image_url: string
          updated_at?: string
          [key: string]: unknown
        }
        Update: {
          slot?: number
          image_url?: string
          updated_at?: string
          [key: string]: unknown
        }
        Relationships: []
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      [key: string]: never
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}
