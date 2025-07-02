import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, RegisterRequest } from '../types';
import { apiService } from '../lib/api';
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
  signUp: (userData: RegisterRequest) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token y restaurar la sesión
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
    const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
      }
        } catch (error) {
      console.error('Error checking auth:', error);
      // Si el token es inválido, limpiarlo
      localStorage.removeItem('auth_token');
    } finally {
    setLoading(false);
    }
  };

  const signUp = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      
      const response = await apiService.register(userData);
      
      // Guardar token y usuario
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
      
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
      
      const response = await apiService.login(email, password);
      
      // Guardar token y usuario
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
      
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
      // Notificar al servidor sobre el logout
      await apiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      // Limpiar estado local
      localStorage.removeItem('auth_token');
      setUser(null);
      toast.success('Sesión cerrada exitosamente');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      
      // TODO: Implementar endpoint de actualización de perfil en Laravel
      // Por ahora solo actualizamos localmente
      const updatedUser = { ...user, ...data };
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