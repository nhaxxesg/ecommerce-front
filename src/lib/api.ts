import { User, Restaurant, MenuItem, Order, LoginResponse, RegisterRequest, CreateOrderRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Restaurants endpoints
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/restaurants`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    // Manejar respuesta paginada de Laravel
    return Array.isArray(data) ? data : data.data || [];
  }

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/my-restaurants`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Foods endpoints
  async getRestaurantFoods(restaurantId: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    // Manejar posible respuesta paginada
    return Array.isArray(data) ? data : data.data || [];
  }

  async createFood(restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateFood(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async toggleFoodAvailability(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteFood(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Orders endpoints
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async getRestaurantOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/restaurant-orders`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async createPayment(orderId: string): Promise<{ init_point: string }> {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // MercadoPago endpoints
  async getMercadoPagoConfig(): Promise<{ public_key: string }> {
    const response = await fetch(`${API_URL}/mercadopago/config`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 