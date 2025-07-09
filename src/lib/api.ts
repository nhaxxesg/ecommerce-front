import type { User, Restaurant, MenuItem, Order, LoginResponse, RegisterRequest, CreateOrderRequest, ComplaintRequest } from '../types';
import { PaginatedResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecomerce.proyectoinsti.site/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAuthHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Siempre incluir el header de autorización si hay un token
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Manejar errores específicos
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/restaurants`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async getMyRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/my-restaurants`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async createRestaurant(restaurantData: FormData): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: restaurantData,
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async updateRestaurant(id: string, restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(restaurantData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async deleteRestaurant(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Menu endpoints
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Alias para compatibilidad
  async getRestaurantFoods(restaurantId: string): Promise<MenuItem[]> {
    return this.getMenuItems(restaurantId);
  }

  async createMenuItem(menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(menuItemData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Alias para compatibilidad
  async createFood(restaurantId: string, formData: FormData): Promise<MenuItem> {
    const headers: HeadersInit = {
      'Authorization': this.getAuthHeader(),
    };

    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async updateMenuItem(id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(menuItemData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async updateFood(id: string, formData: FormData): Promise<MenuItem> {
    // Para Laravel, necesitamos enviar _method=PUT para simular un PUT con FormData
    formData.append('_method', 'PUT');
    
    const headers: HeadersInit = {
      'Authorization': this.getAuthHeader(),
    };

    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'POST', // Usamos POST pero Laravel lo interpretará como PUT
      headers,
      body: formData,
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async deleteMenuItem(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Alias para compatibilidad
  async deleteFood(id: string): Promise<void> {
    return this.deleteMenuItem(id);
  }

  async toggleMenuItemAvailability(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Alias para compatibilidad
  async toggleFoodAvailability(id: string): Promise<MenuItem> {
    return this.toggleMenuItemAvailability(id);
  }

  // Order endpoints
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  // Alias para compatibilidad
  async getRestaurantOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/restaurant-orders`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    const data = await this.handleResponse<PaginatedResponse<Order>>(response);
    return data.data || [];
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async createPayment(orderId: string): Promise<{ init_point: string }> {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async getMercadoPagoConfig(): Promise<{ public_key: string }> {
    const response = await fetch(`${API_URL}/mercadopago/config`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async createPreference(items: any[]): Promise<{ id: string; init_point: string }> {
    const response = await fetch(`${API_URL}/mercadopago/create-preference`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ items }),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async createPaymentPreference(items: any[]): Promise<{ init_point: string }> {
    const response = await fetch(`${API_URL}/mercadopago/create-preference`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ items }),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  async createComplaint(complaintData: ComplaintRequest): Promise<void> {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(complaintData),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();