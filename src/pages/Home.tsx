import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant, MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  Star, 
  Clock, 
  MapPin, 
  Plus,
  Search,
  Filter,
  ChefHat,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

// Datos de prueba hasta integrar con Laravel
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    profile_id: 'profile_1',
    name: 'Pizza Palace',
    description: 'Las mejores pizzas artesanales de la ciudad',
    cuisine_type: 'Italiana',
    address: 'Av. Principal 123',
    phone: '987654321',
    image_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
    delivery_fee: 5.00,
    minimum_order: 20.00,
    opening_hours: 'Lun - Dom: 11:00 AM - 11:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    profile_id: 'profile_2',
    name: 'Burger Express',
    description: 'Hamburguesas gourmet con ingredientes frescos',
    cuisine_type: 'Americana',
    address: 'Calle Comercio 456',
    phone: '987654322',
    image_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    delivery_fee: 4.00,
    minimum_order: 15.00,
    opening_hours: 'Lun - Dom: 10:00 AM - 10:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    profile_id: 'profile_3',
    name: 'Sushi Zen',
    description: 'Auténtica comida japonesa preparada por chefs expertos',
    cuisine_type: 'Japonesa',
    address: 'Av. Libertad 789',
    phone: '987654323',
    image_url: 'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg',
    delivery_fee: 6.00,
    minimum_order: 25.00,
    opening_hours: 'Mar - Dom: 12:00 PM - 10:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockFeaturedItems: (MenuItem & { restaurant: Restaurant })[] = [
  {
    id: '1',
    restaurant_id: '1',
    name: 'Pizza Margherita',
    description: 'Clásica pizza con tomate, mozzarella y albahaca fresca',
    price: 18.90,
    category: 'Pizzas',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    preparation_time: 25,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    restaurant: mockRestaurants[0]
  },
  {
    id: '2',
    restaurant_id: '2',
    name: 'Burger Clásica',
    description: 'Hamburguesa con carne angus, lechuga, tomate y papas',
    price: 16.50,
    category: 'Hamburguesas',
    image_url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    preparation_time: 20,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    restaurant: mockRestaurants[1]
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredItems, setFeaturedItems] = useState<(MenuItem & { restaurant: Restaurant })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    fetchRestaurants();
    fetchFeaturedItems();
  }, []);

  const fetchRestaurants = async () => {
    try {
      // TODO: Reemplazar con llamada a Laravel API
      // const response = await fetch('/api/restaurants');
      // const data = await response.json();
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      setRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Error al cargar los restaurantes');
    }
  };

  const fetchFeaturedItems = async () => {
    try {
      // TODO: Reemplazar con llamada a Laravel API
      // const response = await fetch('/api/featured-items');
      // const data = await response.json();
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      setFeaturedItems(mockFeaturedItems);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine_type === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisine_type))];

  const handleAddToCart = (menuItem: MenuItem, restaurant: Restaurant) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    if (user.user_type !== 'customer') {
      toast.error('Solo los clientes pueden agregar productos al carrito');
      return;
    }
    addItem(menuItem, restaurant);
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
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
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
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Platos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-hover">
                  <div className="relative h-48">
                    <img
                      src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                      S/ {item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.restaurant.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.preparation_time} min
                      </div>
                      {user?.user_type === 'customer' && (
                        <button
                          onClick={() => handleAddToCart(item, item.restaurant)}
                          className="btn-primary p-2 rounded-full"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurants Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Restaurantes Disponibles
          </h2>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron restaurantes que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-hover block"
                >
                  <div className="relative h-48">
                    <img
                      src={restaurant.image_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">4.5</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </h3>
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {restaurant.cuisine_type}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>30-45 min</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Delivery: S/ {restaurant.delivery_fee.toFixed(2)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Mín: S/ {restaurant.minimum_order.toFixed(2)}
                        </span>
                      </div>
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