export interface Restaurant {
    id: string;
    owner_id: string;
    name: string;
    description?: string;
    cuisine_type: string;
    address: string;
    phone: string;
    email?: string;
    opening_time: string;
    closing_time: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    owner?: User;
    foods?: MenuItem[];
}

export interface MenuItem {
    id: string;
    restaurant_id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image_url?: string;
    is_available: boolean;
    preparation_time?: number;
    created_at: string;
    updated_at: string;
    restaurant?: Restaurant;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'client' | 'owner';
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
} 