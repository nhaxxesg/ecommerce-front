export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'owner';
  user_type?: 'restaurant' | 'client';
  address?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'owner';
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image_url?: string;
  owner_id: string;
  opening_time?: string;
  closing_time?: string;
  opening_hours?: string;
  created_at: string;
  updated_at: string;
  cuisine_type?: string;
  delivery_fee?: number;
  minimum_order?: number;
  is_active?: boolean;
  email?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  restaurant_id: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  preparation_time?: number;
  image?: string;
}

export interface CartItem {
  menu_item: MenuItem;
  menuItem: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  unit_price?: number;
  total_price?: number;
  subtotal?: number;
  name: string;
  menu_item?: MenuItem;
  food?: MenuItem;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  total_amount?: number;
  items: OrderItem[];
  order_items?: OrderItem[];
  created_at: string;
  updated_at: string;
  delivery_address?: string;
  notes?: string;
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  user?: User;
  restaurant?: Restaurant;
}

export interface CreateOrderRequest {
  restaurant_id: string;
  delivery_address?: string;
  notes?: string;
  payment_method?: string;
  items: {
    menu_item_id: string;
    food_id?: string;
    quantity: number;
  }[];
}

export interface ComplaintRequest {
  type: 'reclamo' | 'queja';
  consumer_phone?: string;
  product_description: string;
  complaint_detail: string;
} 