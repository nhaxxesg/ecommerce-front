import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Restaurant, MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../lib/api';
import { formatPrice, toNumber } from '../lib/utils';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  ChefHat,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImageWithFallback from '../components/ImageWithFallback';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem, state: cartState } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Cargar datos del restaurante y su menú en paralelo
      const [restaurantData, menuData] = await Promise.all([
        apiService.getRestaurant(id),
        apiService.getRestaurantFoods(id)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);

      // Inicializar cantidades
      const initialQuantities: { [key: string]: number } = {};
      menuData.forEach(item => {
        initialQuantities[item.id] = 0;
      });
      setQuantities(initialQuantities);

    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Error al cargar los datos del restaurante');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, newQuantity)
    }));
  };

  const addToCart = (item: MenuItem) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    if (user.role !== 'client') {
      toast.error('Solo los clientes pueden agregar productos al carrito');
      return;
    }

    if (!restaurant) return;

    addItem(item, restaurant);
    updateQuantity(item.id, quantities[item.id] + 1);
  };

  const getCartItemQuantity = (itemId: string) => {
    const cartItem = cartState.items.find(item => item.menu_item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getOpeningHours = (restaurant: Restaurant) => {
    if (restaurant.opening_time && restaurant.closing_time) {
      return `${restaurant.opening_time} - ${restaurant.closing_time}`;
    }
    return restaurant.opening_hours || 'Horario no disponible';
  };

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Restaurante no encontrado
          </h1>
          <button
            onClick={() => window.history.back()}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-primary-600 to-primary-800">
          <ImageWithFallback
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-50"
            fallbackSrc="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
        </button>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg opacity-90 mb-4">{restaurant.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 mr-2" />
                <span>{restaurant.cuisine_type}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{getOpeningHours(restaurant)}</span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                <span>{restaurant.phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span>4.5 (150+ reseñas)</span>
              </div>
            </div>
            
            {restaurant.delivery_fee && (
              <div className="mt-4 flex items-center text-sm">
                <Truck className="h-4 w-4 mr-2" />
                <span>Delivery {formatPrice(restaurant.delivery_fee)}</span>
                {restaurant.minimum_order && (
                  <span className="ml-4">Pedido mínimo {formatPrice(restaurant.minimum_order)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu */}
          <div className="flex-1">
            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === ''
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="space-y-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    {menuItems.length === 0 
                      ? 'Este restaurante aún no tiene platos disponibles.'
                      : 'No hay platos en esta categoría.'
                    }
                  </div>
                </div>
              ) : (
                <div>
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow mb-6"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
                          <ImageWithFallback
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            fallbackSrc="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {item.preparation_time && (
                                <>
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{item.preparation_time} min</span>
                                </>
                              )}
                              <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                                item.is_available 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {item.is_available ? 'Disponible' : 'No disponible'}
                              </span>
                            </div>
                            
                            {user?.role === 'client' && (
                              <div className="flex items-center gap-3">
                                {getCartItemQuantity(item.id) > 0 && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">
                                      {getCartItemQuantity(item.id)}
                                    </span>
                                    <button
                                      onClick={() => addToCart(item)}
                                      className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => addToCart(item)}
                                  disabled={!item.is_available}
                                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  {getCartItemQuantity(item.id) === 0 ? 'Agregar' : 'Agregar más'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          {cartState.items.length > 0 && (
            <div className="lg:w-80">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Tu Pedido
                  </h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  {cartState.items.map((cartItem) => (
                    <div key={cartItem.menu_item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {cartItem.menu_item.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatPrice(cartItem.menu_item.price)} x {cartItem.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPrice(cartItem.menu_item.price * cartItem.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatPrice(cartState.total)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Proceder al Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;