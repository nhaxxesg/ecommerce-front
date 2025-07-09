import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin,
  CreditCard,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { toNumber } from '../lib/utils';
import { apiService } from '../lib/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago');

  const deliveryFee = cartState.restaurant?.delivery_fee || 0;
  const subtotal = cartState.total;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !cartState.restaurant) {
      toast.error('Error: Usuario o restaurante no válido');
      return;
    }

    if (cartState.items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Por favor ingresa una dirección de entrega');
      return;
    }

    if (cartState.restaurant.minimum_order && subtotal < cartState.restaurant.minimum_order) {
      toast.error(`El pedido mínimo es S/ ${toNumber(cartState.restaurant.minimum_order).toFixed(2)}`);
      return;
    }

    setLoading(true);

    try {
      // Si el método de pago es MercadoPago, creamos la preferencia directamente
      if (paymentMethod === 'mercado_pago') {
        try {
          const items = cartState.items.map(item => ({
            title: item.menu_item.name,
            description: `${item.menu_item.name} de ${cartState.restaurant?.name}`,
            picture_url: item.menu_item.image_url,
            category_id: "food",
            quantity: item.quantity,
            currency_id: "PEN",
            unit_price: Number(item.menu_item.price)
          }));

          console.log('Enviando items a MercadoPago:', items);

          const { init_point } = await apiService.createPaymentPreference(items);
          
          if (init_point) {
            toast.success('Redirigiendo a Mercado Pago...');
            window.location.href = init_point;
            return;
          }
        } catch (error) {
          console.error('Error creating MercadoPago preference:', error);
          toast.error('Error al procesar el pago con MercadoPago');
          return;
        }
      }

      // Si llegamos aquí, es pago en efectivo o falló MercadoPago
      const orderData = {
        restaurant_id: cartState.restaurant.id,
        delivery_address: deliveryAddress,
        notes: notes.trim() || undefined,
        payment_method: paymentMethod,
        items: cartState.items.map(item => ({
          menu_item_id: item.menu_item.id,
          quantity: item.quantity
        }))
      };

      const newOrder = await apiService.createOrder(orderData);

      // Clear cart and show success message
      clearCart();
      toast.success('¡Pedido realizado exitosamente!');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 1000);

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Error al realizar el pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Inicia sesión para continuar con tu pedido
          </p>
          <a
            href="/login"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explora nuestros restaurantes y agrega productos a tu carrito
          </p>
          <Link 
            to="/" 
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors btn-hover inline-block"
          >
            <span>Explorar Restaurantes</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Pedido de {cartState.restaurant?.name}
              </h2>
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.menu_item.id} className="flex items-center space-x-4">
                    <ImageWithFallback
                      src={item.menu_item.image_url}
                      alt={item.menu_item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      fallbackSrc="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.menu_item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        S/ {toNumber(item.menu_item.price).toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.menu_item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.menu_item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.menu_item.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="text-right min-w-[4rem]">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        S/ {(toNumber(item.menu_item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección de Entrega
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ingresa tu dirección completa..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Método de Pago
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="mercado_pago"
                    checked={paymentMethod === 'mercado_pago'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">Mercado Pago</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tarjeta de crédito, débito o transferencia</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">Efectivo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pago contra entrega</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notas (Opcional)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones especiales para el restaurante..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">S/ {toNumber(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Delivery
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">S/ {toNumber(deliveryFee).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">S/ {toNumber(total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < (cartState.restaurant?.minimum_order || 0) && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-lg text-sm">
                  {cartState.restaurant?.minimum_order && (
                    <p>Pedido mínimo: S/ {toNumber(cartState.restaurant.minimum_order).toFixed(2)}</p>
                  )}
                                      {cartState.restaurant?.minimum_order && (
                      <p>Te faltan: S/ {(toNumber(cartState.restaurant.minimum_order) - subtotal).toFixed(2)}</p>
                    )}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || subtotal < (cartState.restaurant?.minimum_order || 0) || !deliveryAddress.trim()}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors btn-hover font-semibold"
              >
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Al realizar el pedido aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;