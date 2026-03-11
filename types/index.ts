export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      stores: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          whatsapp: string | null;
          bio: string | null;
          theme_color: string;
          button_color: string;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          whatsapp?: string | null;
          bio?: string | null;
          theme_color?: string;
          button_color?: string;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          whatsapp?: string | null;
          bio?: string | null;
          theme_color?: string;
          button_color?: string;
          logo_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          slug: string;
          price: number;
          description: string | null;
          image_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          slug: string;
          price: number;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          slug?: string;
          price?: number;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      analytics: {
        Row: {
          id: string;
          store_id: string;
          event_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          event_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          event_type?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Store = Database["public"]["Tables"]["stores"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Analytics = Database["public"]["Tables"]["analytics"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];

export type StoreWithProducts = Store & {
  products: Product[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
