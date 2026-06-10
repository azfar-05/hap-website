export type Category =
  | "tableware"
  | "kitchenware"
  | "crockery"
  | "cutlery"
  | "home_decor";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: Category;
  color: string | null;
  size: string | null;
  material: string | null;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
};

/** Columns with DB defaults or no NOT NULL are optional on insert. */
export type ProductInsert = {
  name: string;
  price: number;
  category: Category;
  images: string[];
  description?: string | null;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  in_stock?: boolean; // DB default: true
  featured?: boolean; // DB default: false
};

/**
 * Database schema type consumed by the Supabase client.
 * Shape must satisfy @supabase/supabase-js GenericSchema / GenericTable:
 *   - GenericTable requires Row, Insert, Update, Relationships
 *   - GenericSchema requires Tables, Views, Functions
 * Using `type` (not `interface`) avoids index-signature compatibility issues
 * in conditional `extends` checks.
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};
