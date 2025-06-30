import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';

/**
 * AUTH CONTEXT MOCK
 * 
 * Este AuthContext está configurado como MOCK para desarrollo.
 * - Acepta cualquier email/contraseña para login
 * - Crea usuarios automáticamente en el registro
 * - Si el email contiene "restaurant" → Usuario tipo restaurant
 * - Caso contrario → Usuario tipo customer
 * 
 * Cuando integres con Laravel, reemplaza las funciones mock por llamadas reales a la API.
 */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en localStorage para mantener la sesión
    const token = localStorage.getItem('auth_token');
    if (token && token.startsWith('mock_token_')) {
      // Restaurar usuario mock desde localStorage o crear uno nuevo
      const savedUser = localStorage.getItem('mock_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUser(user);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('mock_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      
      // REGISTRO MOCK - Acepta cualquier email y contraseña
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de API
      
      // Crear usuario mock
      const mockUser: User = {
        id: 'mock_user_' + Date.now(),
        email: email,
        user_type: userData.user_type || 'customer',
        full_name: userData.full_name || 'Usuario Demo',
        phone: userData.phone || '987654321',
        address: userData.address || 'Dirección de ejemplo 123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Guardar token y usuario mock
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Cuenta creada exitosamente');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error al crear la cuenta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // LOGIN MOCK - Acepta cualquier email y contraseña
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de API
      
      // Crear usuario mock basado en el email
      const mockUser: User = {
        id: 'mock_user_' + Date.now(),
        email: email,
        user_type: email.includes('restaurant') ? 'restaurant' : 'customer',
        full_name: email.includes('restaurant') ? 'Restaurante Demo' : 'Cliente Demo',
        phone: '987654321',
        address: 'Dirección de ejemplo 123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Guardar token y usuario mock
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Sesión iniciada exitosamente');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // TODO: Notificar al servidor Laravel sobre el logout
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Limpiar estado local
      localStorage.removeItem('auth_token');
      localStorage.removeItem('mock_user');
      setUser(null);
      
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error al cerrar sesión');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // TODO: Integrar con Laravel API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error al actualizar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};