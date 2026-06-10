export type Category =
  | "tableware"
  | "kitchenware"
  | "crockery"
  | "cutlery"
  | "home_decor";

export interface Product {
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
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
    };
  };
}
