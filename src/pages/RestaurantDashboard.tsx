import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Restaurant, MenuItem, Order } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Store,
  Clock,
  DollarSign,
  Package,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'settings'>('overview');

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      // TODO: Reemplazar con llamada a Laravel API
      // const response = await fetch(`/api/restaurants/profile/${user!.id}`);
      // const data = await response.json();
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Para usuarios tipo restaurant, mostrar datos mock
      if (user?.user_type === 'restaurant') {
        // Datos de prueba para restaurante
        setRestaurant({
          id: '1',
          profile_id: user.id,
          name: 'Mi Restaurante',
          description: 'Descripción de mi restaurante',
          cuisine_type: 'Peruana',
          address: 'Av. Ejemplo 123',
          phone: '987654321',
          image_url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
          delivery_fee: 5.00,
          minimum_order: 20.00,
          opening_hours: 'Lun - Dom: 10:00 AM - 10:00 PM',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        setMenuItems([]);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Error al cargar los datos del restaurante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Configura tu Restaurante
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Primero necesitas completar la información de tu restaurante
            </p>
            <button 
              onClick={() => toast.success('Función disponible próximamente')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover"
            >
              Configurar Restaurante
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard - {restaurant.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona tu restaurante y pedidos
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'menu', 'orders', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Resumen'}
                {tab === 'menu' && 'Menú'}
                {tab === 'orders' && 'Pedidos'}
                {tab === 'settings' && 'Configuración'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pedidos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">S/ 0.00</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0 min</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Store className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Productos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{menuItems.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestión de Menú
              </h2>
              <button 
                onClick={() => toast.success('Función disponible próximamente')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors btn-hover flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tienes productos en tu menú
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Agrega productos para que los clientes puedan hacer pedidos
                </p>
                <button 
                  onClick={() => toast.success('Función disponible próximamente')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover"
                >
                  Agregar Primer Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Los productos del menú se mostrarían aquí */}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Pedidos Recientes
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tienes pedidos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Los pedidos de los clientes aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Los pedidos se mostrarían aquí */}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Información del Restaurante
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Restaurante
                  </label>
                  <input
                    type="text"
                    value={restaurant.name}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Cocina
                  </label>
                  <input
                    type="text"
                    value={restaurant.cuisine_type}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={restaurant.phone}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Costo de Delivery
                  </label>
                  <input
                    type="number"
                    value={restaurant.delivery_fee}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => toast.success('Función disponible próximamente')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;