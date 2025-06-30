import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { Clock, Package, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

// Datos de prueba
const mockOrders: Order[] = [
  {
    id: 'order_1',
    customer_id: 'user_1',
    restaurant_id: '1',
    status: 'preparing',
    total_amount: 45.50,
    delivery_address: 'Av. Principal 456, Miraflores',
    payment_status: 'paid',
    payment_method: 'mercado_pago',
    notes: 'Sin cebolla, por favor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    restaurant: {
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
    order_items: [
      {
        id: 'item_1',
        order_id: 'order_1',
        menu_item_id: 'menu_1',
        quantity: 2,
        unit_price: 18.90,
        subtotal: 37.80,
        created_at: new Date().toISOString(),
        menu_item: {
          id: 'menu_1',
          restaurant_id: '1',
          name: 'Pizza Margherita',
          description: 'Clásica pizza con tomate, mozzarella y albahaca fresca',
          price: 18.90,
          category: 'Pizzas',
          image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          preparation_time: 25,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ]
  }
];

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // TODO: Reemplazar con llamada a Laravel API
      // const response = await fetch(`/api/customers/${user!.id}/orders`);
      // const data = await response.json();
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Solo mostrar órdenes si el usuario está logueado
      if (user) {
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo para recoger';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <Package className="h-5 w-5" />;
      case 'preparing': return <Clock className="h-5 w-5" />;
      case 'ready': return <CheckCircle className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mis Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Revisa el estado de tus pedidos
          </p>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tienes pedidos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explora nuestros restaurantes y haz tu primer pedido
            </p>
            <a
              href="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover inline-block"
            >
              Explorar Restaurantes
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.restaurant?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pedido #{order.id.slice(-8)} • {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        S/ {order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Productos
                      </h4>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.menu_item?.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                              alt={item.menu_item?.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.menu_item?.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Cantidad: {item.quantity} • S/ {item.unit_price.toFixed(2)} c/u
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              S/ {item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Información de Entrega
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.delivery_address}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Restaurante: {order.restaurant?.phone}
                          </p>
                        </div>
                        {order.notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Notas:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.status === 'ready' && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <p className="text-green-800 dark:text-green-200 font-medium">
                          ¡Tu pedido está listo para recoger!
                        </p>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        Dirígete al restaurante para recoger tu pedido.
                      </p>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <p className="text-orange-800 dark:text-orange-200 font-medium">
                          Tu pedido se está preparando
                        </p>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                        El restaurante está preparando tu pedido. Te notificaremos cuando esté listo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;