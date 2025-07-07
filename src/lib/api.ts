import { User, Restaurant, MenuItem, Order, LoginResponse, RegisterRequest, CreateOrderRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAuthHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  // Restaurants endpoints
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    const data = await this.handleResponse<any>(response);
    // Manejar respuesta paginada de Laravel
    return Array.isArray(data) ? data : data.data || [];
  }

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  async getMyRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/my-restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async createRestaurant(data: Partial<Restaurant> & { image?: File }): Promise<Restaurant> {
    const formData = new FormData();
    
    // Agregar todos los campos al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error creating restaurant');
    }

    return response.json();
  }

  async updateRestaurant(id: string, data: Partial<Restaurant> & { image?: File }): Promise<Restaurant> {
    const formData = new FormData();
    
    // Agregar todos los campos al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Agregar el método _method para simular PUT
    formData.append('_method', 'PUT');

    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'POST', // Usamos POST con _method=PUT para enviar archivos
      headers: {
        'Authorization': this.getAuthHeader()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error updating restaurant');
    }

    return response.json();
  }

  // Foods endpoints
  async getRestaurantFoods(restaurantId: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    const data = await this.handleResponse<any>(response);
    // Manejar posible respuesta paginada
    return Array.isArray(data) ? data : data.data || [];
  }

  async createFood(restaurantId: string, data: FormData): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/foods`, {
        method: 'POST',
        headers: {
            'Authorization': this.getAuthHeader()
        },
        body: data,
    });
    return this.handleResponse(response);
  }

  async updateFood(id: string, data: FormData): Promise<MenuItem> {
    // Agregar el método _method para simular PUT
    data.append('_method', 'PUT');
    
    const response = await fetch(`${API_URL}/foods/${id}`, {
        method: 'POST', // Usamos POST con _method=PUT para enviar archivos
        headers: {
            'Authorization': this.getAuthHeader()
        },
        body: data,
    });
    return this.handleResponse(response);
  }

  async toggleFoodAvailability(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_URL}/foods/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  async deleteFood(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  // Orders endpoints
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async getRestaurantOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/restaurant-orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    const data = await this.handleResponse<any>(response);
    return Array.isArray(data) ? data : data.data || [];
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async createPayment(orderId: string): Promise<{ init_point: string }> {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }

  // MercadoPago endpoints
  async createPaymentPreference(items: any[]): Promise<{ init_point: string }> {
    const response = await fetch(`${API_URL}/mercadopago/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify({ items }),
    });
    return this.handleResponse(response);
  }

  async getMercadoPagoConfig(): Promise<{ public_key: string; mode: string }> {
    const response = await fetch(`${API_URL}/mercadopago/config`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': this.getAuthHeader()
      },
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 