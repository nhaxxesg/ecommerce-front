export interface User {
  id: string;
  email: string;
  user_type: 'customer' | 'restaurant';
  full_name: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
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
}

export interface MenuItem {
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
}

export interface Order {
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
  restaurant?: Restaurant;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  menu_item?: MenuItem;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}