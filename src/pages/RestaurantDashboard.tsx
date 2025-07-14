import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Restaurant, MenuItem, Order } from '../types';
import { apiService } from '../lib/api';
import { formatPrice, toNumber, getImageUrl } from '../lib/utils';
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

interface FormData {
    name: string;
    description: string;
    cuisine_type: string;
    address: string;
    phone: string;
    email: string;
    opening_time: string;
    closing_time: string;
    image_url: string;
    ruc: string;
    image?: File | null;
    image_preview?: string;
}

interface RestaurantSettings extends Omit<FormData, 'ruc'> {
    // RestaurantSettings es igual a FormData pero sin el campo ruc
}

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'settings'>('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [editingFood, setEditingFood] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    phone: '',
    email: '',
    opening_time: '10:00',
    closing_time: '22:00',
    image_url: '',
    ruc: ''
  });
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    phone: '',
    email: '',
    opening_time: '',
    closing_time: '',
    image_url: ''
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [foodFormData, setFoodFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    preparation_time: '30',
    image: null as File | null,
    image_preview: ''
  });

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  useEffect(() => {
    if (restaurant) {
      initializeRestaurantSettings();
    }
  }, [restaurant]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Obtener los restaurantes del usuario propietario
      const restaurants = await apiService.getMyRestaurants();
      
      if (restaurants.length > 0) {
        const myRestaurant = restaurants[0]; // Por ahora tomamos el primero
        setRestaurant(myRestaurant);
      
        // Cargar menú y pedidos en paralelo
        const [menuData, ordersData] = await Promise.all([
          apiService.getRestaurantFoods(myRestaurant.id),
          apiService.getRestaurantOrders()
        ]);
        
        setMenuItems(Array.isArray(menuData) ? menuData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        // No tiene restaurantes configurados
        setRestaurant(null);
        setMenuItems([]);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Error al cargar los datos del restaurante');
      setMenuItems([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formDataToSend.append('image', value);
          } else if (key !== 'image_preview') { // No enviar image_preview
            formDataToSend.append(key, value.toString());
          }
        }
      });

      const newRestaurant = await apiService.createRestaurant(formDataToSend);
      setRestaurant(newRestaurant);
      setShowCreateForm(false);
      toast.success('Restaurante creado exitosamente');
      
      // Recargar datos
      await fetchRestaurantData();
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Error al crear el restaurante');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFood = (food: MenuItem) => {
    setEditingFood(food); // Asegurarnos de establecer el food que estamos editando
    setFoodFormData({
      name: food.name,
      description: food.description || '',
      price: food.price.toString(),
      category: food.category || '',
      image_url: food.image_url || '',
      preparation_time: food.preparation_time?.toString() || '30',
      image: null,
      image_preview: getImageUrl(food.image_url) || ''
    });
    setShowFoodForm(true);
  };

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;
    
    try {
        setLoading(true);
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        Object.entries(foodFormData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'image' && value instanceof File) {
                    formData.append('image', value);
                } else if (key !== 'image_preview') { // No enviar image_preview
                    formData.append(key, value.toString());
                }
            }
        });
        
        if (editingFood) {
            await apiService.updateFood(editingFood.id, formData);
            toast.success('Producto actualizado exitosamente');
        } else {
            await apiService.createFood(restaurant.id, formData);
            toast.success('Producto creado exitosamente');
        }
        
        setShowFoodForm(false);
        setEditingFood(null);
        setFoodFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image_url: '',
            preparation_time: '30',
            image: null,
            image_preview: ''
        });
        
        await fetchRestaurantData();
    } catch (error) {
        console.error('Error saving food:', error);
        toast.error('Error al guardar el producto');
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      await apiService.deleteFood(foodId);
      toast.success('Producto eliminado exitosamente');
      await fetchRestaurantData();
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleToggleFoodAvailability = async (foodId: string) => {
    try {
      await apiService.toggleFoodAvailability(foodId);
      toast.success('Disponibilidad actualizada');
      await fetchRestaurantData();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Error al actualizar disponibilidad');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      toast.success('Estado del pedido actualizado');
      await fetchRestaurantData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  const getTodayOrders = () => {
    if (!Array.isArray(orders)) return [];
    
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => 
      order?.created_at?.split('T')[0] === today
    );
  };

  const getTodayRevenue = () => {
    return getTodayOrders().reduce((total, order) => total + toNumber(order.total_amount), 0);
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    try {
      setLoading(true);
      
      // CORREGIDO: Usar FormData si hay una imagen, JSON si no hay imagen
      if (restaurantSettings.image) {
        // Crear FormData para manejar archivo de imagen
        const formDataToSend = new FormData();
        
        // Agregar todos los campos al FormData (excepto image_preview)
        Object.entries(restaurantSettings).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'image_preview') {
            if (key === 'image' && value instanceof File) {
              formDataToSend.append('image', value);
            } else if (key !== 'image') {
              formDataToSend.append(key, value.toString());
            }
          }
        });
        
        await apiService.updateRestaurant(restaurant.id, formDataToSend);
      } else {
        // Sin imagen: usar JSON normal
        const dataToSend = { ...restaurantSettings };
        delete dataToSend.image;
        delete dataToSend.image_preview;
        
        await apiService.updateRestaurant(restaurant.id, dataToSend);
      }
      
      toast.success('Configuración actualizada exitosamente');
      setIsEditingSettings(false);
      await fetchRestaurantData();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Error al actualizar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const initializeRestaurantSettings = () => {
    if (restaurant) {
      setRestaurantSettings({
        name: restaurant.name,
        description: restaurant.description || '',
        cuisine_type: restaurant.cuisine_type,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email || '',
        opening_time: restaurant.opening_time || '',
        closing_time: restaurant.closing_time || '',
        image_url: restaurant.image_url || ''
      });
    }
  };

  const handleImageChange = <T extends FormData | RestaurantSettings>(
    e: React.ChangeEvent<HTMLInputElement>,
    setData: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setData(prev => ({
        ...prev,
        image: file,
        image_preview: URL.createObjectURL(file)
      }));
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
          {!showCreateForm ? (
          <div className="text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Configura tu Restaurante
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Primero necesitas completar la información de tu restaurante
            </p>
            <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Configurar Restaurante
            </button>
          </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Crear Nuevo Restaurante
              </h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      RUC *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ruc}
                      onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="20601030013"
                      maxLength={11}
                      pattern="[0-9]{11}"
                      title="El RUC debe tener 11 dígitos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Restaurante *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Nombre de tu restaurante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Cocina
                    </label>
                    <input
                      type="text"
                      value={formData.cuisine_type}
                      onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ej: Peruana, Italiana, China"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="contacto@mirestaurante.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Apertura *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.opening_time}
                      onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Cierre *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.closing_time}
                      onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Dirección completa del restaurante"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe tu restaurante..."
                  />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Imagen del Restaurante
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                        {formData.image_preview ? (
                            <img
                                src={formData.image_preview}
                                alt="Vista previa"
                                className="h-32 w-32 object-cover rounded-lg"
                            />
                        ) : formData.image_url ? (
                            <img
                                src={formData.image_url}
                                alt="Imagen actual"
                                className="h-32 w-32 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Sin imagen</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setFormData)}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary-50 file:text-primary-700
                                hover:file:bg-primary-100
                                dark:file:bg-primary-900 dark:file:text-primary-300
                                dark:hover:file:bg-primary-800"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG o GIF hasta 2MB
                    </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : 'Crear Restaurante'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getTodayOrders().length}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(getTodayRevenue())}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orders.filter(order => order.status === 'pending' || order.status === 'confirmed').length}
                  </p>
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
          <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestión de Menú
              </h2>
              <button 
                  onClick={() => setShowFoodForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
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
                    onClick={() => setShowFoodForm(true)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Agregar Primer Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4 relative">
                      {item.image_url && (
                        <img 
                          src={getImageUrl(item.image_url)} 
                          alt={item.name} 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.is_available 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {item.is_available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatPrice(item.price)}
                        </span>
                        {item.category && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditFood(item)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </button>
                        <button 
                          onClick={() => handleToggleFoodAvailability(item.id)}
                          className={`flex-1 px-3 py-2 rounded transition-colors flex items-center justify-center ${
                            item.is_available
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {item.is_available ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                          {item.is_available ? 'Ocultar' : 'Mostrar'}
                        </button>
                        <button 
                          onClick={() => handleDeleteFood(item.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal para crear/editar producto */}
            {showFoodForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {editingFood ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <form onSubmit={handleCreateFood} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={foodFormData.name}
                        onChange={(e) => setFoodFormData({...foodFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={foodFormData.description}
                        onChange={(e) => setFoodFormData({...foodFormData, description: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Precio *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={foodFormData.price}
                          onChange={(e) => setFoodFormData({...foodFormData, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Categoría
                        </label>
                        <input
                          type="text"
                          value={foodFormData.category}
                          onChange={(e) => setFoodFormData({...foodFormData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Imagen del Producto
                      </label>
                      <div className="mt-1 flex items-center space-x-4">
                        {foodFormData.image_preview ? (
                          <img
                            src={foodFormData.image_preview}
                            alt="Vista previa"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                        ) : foodFormData.image_url ? (
                          <img
                            src={foodFormData.image_url}
                            alt="Imagen actual"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Sin imagen</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFoodFormData({
                                ...foodFormData,
                                image: file,
                                image_preview: URL.createObjectURL(file)
                              });
                            }
                          }}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-50 file:text-primary-700
                            hover:file:bg-primary-100
                            dark:file:bg-primary-900 dark:file:text-primary-300
                            dark:hover:file:bg-primary-800"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG o GIF hasta 2MB
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tiempo de Preparación (minutos)
                      </label>
                      <input
                        type="number"
                        value={foodFormData.preparation_time}
                        onChange={(e) => setFoodFormData({...foodFormData, preparation_time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : (editingFood ? 'Actualizar' : 'Crear')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFoodForm(false);
                          setEditingFood(null);
                          setFoodFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: '',
                            image_url: '',
                            preparation_time: '30',
                            image: null,
                            image_preview: ''
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
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
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Pedido #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.user?.name} - {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.delivery_address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatPrice(order.total_amount)}
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`px-3 py-1 text-sm rounded border ${
                            order.status === 'pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                            order.status === 'preparing' ? 'bg-orange-100 border-orange-300 text-orange-800' :
                            order.status === 'ready' ? 'bg-purple-100 border-purple-300 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 border-green-300 text-green-800' :
                            'bg-red-100 border-red-300 text-red-800'
                          }`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>
                    
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Items:</h4>
                        <div className="space-y-1">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {item.quantity}x {item.food?.name}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.subtotal || 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {order.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <span className={`px-2 py-1 rounded ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        Pago: {
                          order.payment_status === 'paid' ? 'Pagado' :
                          order.payment_status === 'pending' ? 'Pendiente' :
                          'Fallido'
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Información del Restaurante
              </h2>
                {!isEditingSettings ? (
                  <button 
                    onClick={() => setIsEditingSettings(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsEditingSettings(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleUpdateRestaurant}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      RUC *
                  </label>
                  <input
                    type="text"
                      value={formData.ruc}
                      onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly={!isEditingSettings}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Restaurante *
                  </label>
                  <input
                    type="text"
                      value={isEditingSettings ? restaurantSettings.name : restaurant.name}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly={!isEditingSettings}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Cocina
                  </label>
                  <input
                    type="text"
                      value={isEditingSettings ? restaurantSettings.cuisine_type : restaurant.cuisine_type}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, cuisine_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly={!isEditingSettings}
                    />
                  </div>
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={isEditingSettings ? restaurantSettings.phone : restaurant.phone}
                    onChange={(e) => setRestaurantSettings({...restaurantSettings, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly={!isEditingSettings}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={isEditingSettings ? restaurantSettings.email : (restaurant.email || '')}
                    onChange={(e) => setRestaurantSettings({...restaurantSettings, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly={!isEditingSettings}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hora de Apertura *
                  </label>
                  <input
                    type="time"
                    value={isEditingSettings ? restaurantSettings.opening_time : (restaurant.opening_time || '')}
                    onChange={(e) => setRestaurantSettings({...restaurantSettings, opening_time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly={!isEditingSettings}
                  />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Cierre *
                    </label>
                    <input
                      type="time"
                      value={isEditingSettings ? restaurantSettings.closing_time : (restaurant.closing_time || '')}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, closing_time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly={!isEditingSettings}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={isEditingSettings ? restaurantSettings.address : restaurant.address}
                    onChange={(e) => setRestaurantSettings({...restaurantSettings, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly={!isEditingSettings}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={isEditingSettings ? restaurantSettings.description : (restaurant.description || '')}
                    onChange={(e) => setRestaurantSettings({...restaurantSettings, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly={!isEditingSettings}
                  />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Imagen del Restaurante
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                        {restaurantSettings.image_preview ? (
                            <img
                                src={restaurantSettings.image_preview}
                                alt="Vista previa"
                                className="h-32 w-32 object-cover rounded-lg"
                            />
                        ) : restaurant?.image_url ? (
                            <img
                                src={restaurant.image_url}
                                alt="Imagen actual"
                                className="h-32 w-32 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Sin imagen</span>
                            </div>
                        )}
                        {isEditingSettings && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, setRestaurantSettings)}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100
                                    dark:file:bg-primary-900 dark:file:text-primary-300
                                    dark:hover:file:bg-primary-800"
                            />
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG o GIF hasta 2MB
                    </p>
                </div>
                
                {isEditingSettings && (
                <div className="mt-6">
                  <button 
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;