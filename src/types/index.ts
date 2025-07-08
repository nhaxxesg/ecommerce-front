export * from './database';
export * from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'owner';
  phone?: string;
  address?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  ruc: string;
  razon_social: string;
  description?: string;
  cuisine_type: string;
  address: string;
  phone: string;
  email?: string;
  image_url?: string;
  is_active: boolean;
  opening_time?: string;
  closing_time?: string;
  created_at: string;
  updated_at: string;
  delivery_fee?: number;
  minimum_order?: number;
  opening_hours?: string;
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
  preparation_time?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_address: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
  order_items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  subtotal?: number; // Para compatibilidad con datos mock
  created_at: string;
  updated_at: string;
  food?: MenuItem;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'owner';
  phone?: string;
  address?: string;
  ruc?: string;
}

export interface CreateOrderRequest {
  restaurant_id: string;
  delivery_address: string;
  notes?: string;
  items: {
    food_id: string;
    quantity: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}