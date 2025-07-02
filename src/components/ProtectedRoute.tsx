import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'client' | 'owner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType && user.role !== userType) {
    // Redirigir al dashboard apropiado según el tipo de usuario
    const redirectPath = user.role === 'owner' 
      ? '/restaurant-dashboard' 
      : '/customer-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;