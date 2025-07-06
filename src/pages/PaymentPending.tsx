import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    toast('Tu pago está pendiente de confirmación', {
      icon: '⏳',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Clock className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pago en Proceso
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tu pago está siendo procesado. Una vez confirmado, actualizaremos el estado de tu pedido.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver Estado del Pedido
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

export default PaymentPending; 