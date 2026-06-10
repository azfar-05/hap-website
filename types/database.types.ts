export type Category =
  | 'tableware'
  | 'kitchenware'
  | 'crockery'
  | 'cutlery'
  | 'home_decor'

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: Category
  color: string | null
  size: string | null
  material: string | null
  images: string[]
  in_stock: boolean
  featured: boolean
  created_at: string
}

/** Columns with DB defaults or no NOT NULL are optional on insert. */
export type ProductInsert = {
  name: string
  price: number
  category: Category
  images: string[]
  description?: string | null
  color?: string | null
  size?: string | null
  material?: string | null
  in_stock?: boolean // DB default: true
  featured?: boolean // DB default: false
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
 * Named types (Product, ProductInsert) are kept as separate exports and used
 * throughout the rest of the codebase — explicit casts from Row → Product are
 * needed when consuming Supabase select results.
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
          created_at?: string
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
