import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Restaurant, MenuItem } from '../types';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

// Datos de prueba
const mockRestaurants: { [key: string]: Restaurant } = {
  '1': {
    id: '1',
    profile_id: 'profile_1',
    name: 'Pizza Palace',
    description: 'Las mejores pizzas artesanales de la ciudad con ingredientes frescos importados directamente de Italia',
    cuisine_type: 'Italiana',
    address: 'Av. Principal 123, San Miguel',
    phone: '987654321',
    image_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
    delivery_fee: 5.00,
    minimum_order: 20.00,
    opening_hours: 'Lun - Dom: 11:00 AM - 11:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  '2': {
    id: '2',
    profile_id: 'profile_2',
    name: 'Burger Express',
    description: 'Hamburguesas gourmet con ingredientes frescos y carne premium',
    cuisine_type: 'Americana',
    address: 'Calle Comercio 456, Miraflores',
    phone: '987654322',
    image_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    delivery_fee: 4.00,
    minimum_order: 15.00,
    opening_hours: 'Lun - Dom: 10:00 AM - 10:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

const mockMenuItems: { [key: string]: MenuItem[] } = {
  '1': [
    {
      id: 'menu_1',
      restaurant_id: '1',
      name: 'Pizza Margherita',
      description: 'Clásica pizza con tomate San Marzano, mozzarella di bufala y albahaca fresca',
      price: 18.90,
      category: 'Pizzas',
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      preparation_time: 25,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'menu_2',
      restaurant_id: '1',
      name: 'Pizza Pepperoni',
      description: 'Pizza con salsa de tomate, mozzarella y pepperoni premium',
      price: 22.90,
      category: 'Pizzas',
      image_url: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
      preparation_time: 25,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'menu_3',
      restaurant_id: '1',
      name: 'Lasagna Bolognesa',
      description: 'Tradicional lasagna con salsa bolognesa y bechamel casera',
      price: 24.90,
      category: 'Pastas',
      image_url: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg',
      preparation_time: 35,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '2': [
    {
      id: 'menu_4',
      restaurant_id: '2',
      name: 'Burger Clásica',
      description: 'Hamburguesa con carne angus, lechuga, tomate, cebolla y papas fritas',
      price: 16.50,
      category: 'Hamburguesas',
      image_url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
      preparation_time: 20,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'menu_5',
      restaurant_id: '2',
      name: 'Burger BBQ',
      description: 'Hamburguesa con carne, bacon, queso cheddar, salsa BBQ y aros de cebolla',
      price: 19.90,
      category: 'Hamburguesas',
      image_url: 'https://images.pexels.com/photos/1552641/pexels-photo-1552641.jpeg',
      preparation_time: 22,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem, state: cartState } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      // TODO: Reemplazar con llamada a Laravel API
      // const response = await fetch(`/api/restaurants/${id}`);
      // const restaurantData = await response.json();
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const restaurantData = mockRestaurants[id!];
      if (!restaurantData) {
        throw new Error('Restaurante no encontrado');
      }
      
      setRestaurant(restaurantData);

      // TODO: Reemplazar con llamada a Laravel API
      // const menuResponse = await fetch(`/api/restaurants/${id}/menu`);
      // const menuData = await menuResponse.json();
      
      const menuData = mockMenuItems[id!] || [];
      setMenuItems(menuData);

      // Initialize quantities
      const initialQuantities: { [key: string]: number } = {};
      menuData.forEach(item => {
        initialQuantities[item.id] = 1;
      });
      setQuantities(initialQuantities);

    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Error al cargar la información del restaurante');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }));
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    if (user.user_type !== 'customer') {
      toast.error('Solo los clientes pueden agregar productos al carrito');
      return;
    }
    if (!restaurant) return;

    const quantity = quantities[menuItem.id] || 1;
    for (let i = 0; i < quantity; i++) {
      addItem(menuItem, restaurant);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Restaurante no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            El restaurante que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>4.5</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{restaurant.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {restaurant.description || 'Deliciosa comida preparada con los mejores ingredientes.'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Información de Entrega
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Costo de delivery: S/ {restaurant.delivery_fee.toFixed(2)}</p>
                <p>Pedido mínimo: S/ {restaurant.minimum_order.toFixed(2)}</p>
                <p>Tiempo estimado: 30-45 min</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Horarios
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.opening_hours || 'Lun - Dom: 10:00 AM - 10:00 PM'}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{item.preparation_time} min</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                        S/ {item.price.toFixed(2)}
                      </div>
                      {user?.user_type === 'customer' && (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm">
                              {quantities[item.id] || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-full btn-primary text-sm py-2 px-4 rounded-lg flex items-center justify-center"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Agregar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Este restaurante no tiene menú disponible en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;