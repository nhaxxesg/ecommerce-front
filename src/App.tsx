import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route
                    path="/restaurant-dashboard"
                    element={
                      <ProtectedRoute userType="restaurant">
                        <RestaurantDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard"
                    element={
                      <ProtectedRoute userType="customer">
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;