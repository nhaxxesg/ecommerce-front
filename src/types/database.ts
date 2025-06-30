export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          user_type: 'customer' | 'restaurant';
          full_name: string;
          phone?: string;
          address?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          user_type: 'customer' | 'restaurant';
          full_name: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          user_type?: 'customer' | 'restaurant';
          full_name?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          description?: string;
          cuisine_type: string;
          address: string;
          phone: string;
          image_url?: string;
          is_active: boolean;
          opening_hours?: string;
          delivery_fee: number;
          minimum_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          description?: string;
          cuisine_type: string;
          address: string;
          phone: string;
          image_url?: string;
          is_active?: boolean;
          opening_hours?: string;
          delivery_fee?: number;
          minimum_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          description?: string;
          cuisine_type?: string;
          address?: string;
          phone?: string;
          image_url?: string;
          is_active?: boolean;
          opening_hours?: string;
          delivery_fee?: number;
          minimum_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description?: string;
          price: number;
          category: string;
          image_url?: string;
          is_available: boolean;
          preparation_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string;
          price: number;
          category: string;
          image_url?: string;
          is_available?: boolean;
          preparation_time?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image_url?: string;
          is_available?: boolean;
          preparation_time?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          restaurant_id: string;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          total_amount: number;
          delivery_address: string;
          payment_status: 'pending' | 'paid' | 'failed';
          payment_method: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          restaurant_id: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          total_amount: number;
          delivery_address: string;
          payment_status?: 'pending' | 'paid' | 'failed';
          payment_method: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          restaurant_id?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          total_amount?: number;
          delivery_address?: string;
          payment_status?: 'pending' | 'paid' | 'failed';
          payment_method?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          created_at?: string;
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
  };
}