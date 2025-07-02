import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant, MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { 
  Star, 
  Clock, 
  MapPin, 
  Plus,
  Search,
  Filter,
  ChefHat,
  Truck,
  Store
} from 'lucide-react';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredItems, setFeaturedItems] = useState<(MenuItem & { restaurant?: Restaurant })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar restaurantes
      const restaurantsData = await apiService.getRestaurants();
      const safeRestaurantsData = Array.isArray(restaurantsData) ? restaurantsData : [];
      setRestaurants(safeRestaurantsData);
      
      // Cargar algunos platos destacados de los restaurantes
      if (safeRestaurantsData.length > 0) {
        const featuredItemsPromises = safeRestaurantsData.slice(0, 3).map(async (restaurant) => {
          try {
            const foods = await apiService.getRestaurantFoods(restaurant.id);
            // Tomar los primeros 2 platos de cada restaurante
            const safeFoods = Array.isArray(foods) ? foods : [];
            return safeFoods.slice(0, 2).map(food => ({
              ...food,
              restaurant
            }));
    } catch (error) {
            console.error(`Error loading foods for restaurant ${restaurant.id}:`, error);
            return [];
    }
        });

        const featuredResults = await Promise.all(featuredItemsPromises);
        const allFeaturedItems = featuredResults.flat();
        setFeaturedItems(allFeaturedItems);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = Array.isArray(restaurants) ? restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine_type === selectedCuisine;
    return matchesSearch && matchesCuisine && restaurant.is_active;
  }) : [];

  const cuisineTypes = Array.isArray(restaurants) 
    ? [...new Set(restaurants.map(r => r.cuisine_type).filter(Boolean))]
    : [];

  const handleAddToCart = (menuItem: MenuItem, restaurant: Restaurant) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    if (user.role !== 'client') {
      toast.error('Solo los clientes pueden agregar productos al carrito');
      return;
    }
    addItem(menuItem, restaurant);
  };



  const getOpeningHours = (restaurant: Restaurant) => {
    if (restaurant.opening_time && restaurant.closing_time) {
      return `${restaurant.opening_time} - ${restaurant.closing_time}`;
    }
    return restaurant.opening_hours || 'Horario no disponible';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Comida Express
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Tu comida favorita, entregada rápido y fresco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <ChefHat className="h-5 w-5 mr-2" />
              <span>Restaurantes locales</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Truck className="h-5 w-5 mr-2" />
              <span>Entrega rápida</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Star className="h-5 w-5 mr-2" />
              <span>Calidad garantizada</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar restaurantes o tipo de comida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="">Todos los tipos</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Platos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Store className="h-4 w-4 mr-1" />
                      <span>{item.restaurant?.name}</span>
                      {item.preparation_time && (
                        <>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{item.preparation_time} min</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => item.restaurant && handleAddToCart(item, item.restaurant)}
                      disabled={!item.is_available}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {item.is_available ? 'Agregar al Carrito' : 'No Disponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurants Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Restaurantes Disponibles
          </h2>
          
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {restaurants.length === 0 ? 'No hay restaurantes disponibles en este momento.' : 'No se encontraron restaurantes que coincidan con tu búsqueda.'}
              </div>
              {searchTerm || selectedCuisine ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCuisine('');
                  }}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={restaurant.image_url || 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg'}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {restaurant.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
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
                      {restaurant.delivery_fee && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          <span>Delivery {formatPrice(restaurant.delivery_fee)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;