import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();
    // Mostrar mensaje de éxito
    toast.success('¡Pago realizado con éxito!');
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tu pago ha sido procesado correctamente. Puedes ver los detalles de tu pedido en tu dashboard.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver Mis Pedidos
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 