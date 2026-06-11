export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          is_best_seller: boolean;
          is_new: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_best_seller?: boolean;
          is_new?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          is_best_seller?: boolean;
          is_new?: boolean;
          created_at?: string;
        };
      };
      menu_variants: {
        Row: {
          id: string;
          menu_item_id: string;
          name: string;
          price_adjustment: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          name: string;
          price_adjustment?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          name?: string;
          price_adjustment?: number;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'pickup' | 'delivery';
          delivery_address: string | null;
          delivery_fee: number;
          subtotal: number;
          total_price: number;
          status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes: string | null;
          payment_method: 'cod' | 'transfer';
          payment_status: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'pickup' | 'delivery';
          delivery_address?: string | null;
          delivery_fee?: number;
          subtotal: number;
          total_price: number;
          status?: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes?: string | null;
          payment_method?: 'cod' | 'transfer';
          payment_status?: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_code?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_type?: 'pickup' | 'delivery';
          delivery_address?: string | null;
          delivery_fee?: number;
          subtotal?: number;
          total_price?: number;
          status?: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes?: string | null;
          payment_method?: 'cod' | 'transfer';
          payment_status?: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          menu_item_name: string;
          variant_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          customer_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          menu_item_name: string;
          variant_name?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          customer_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          menu_item_name?: string;
          variant_name?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          customer_name?: string | null;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: number;
          store_name: string;
          is_open: boolean;
          whatsapp_number: string;
          flat_delivery_fee: number;
          minimum_order_amount: number;
          store_address: string | null;
          google_maps_url: string | null;
          opening_hours: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          store_name?: string;
          is_open?: boolean;
          whatsapp_number: string;
          flat_delivery_fee?: number;
          minimum_order_amount?: number;
          store_address?: string | null;
          google_maps_url?: string | null;
          opening_hours?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          store_name?: string;
          is_open?: boolean;
          whatsapp_number?: string;
          flat_delivery_fee?: number;
          minimum_order_amount?: number;
          store_address?: string | null;
          google_maps_url?: string | null;
          opening_hours?: string | null;
          updated_at?: string;
        };
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

export type Category = Database['public']['Tables']['categories']['Row'];
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type MenuVariant = Database['public']['Tables']['menu_variants']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
