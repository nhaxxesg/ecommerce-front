export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'owner';
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
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  items: {
    menu_item_id: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  restaurant_id: string;
  items: {
    menu_item_id: string;
    quantity: number;
  }[];
} 