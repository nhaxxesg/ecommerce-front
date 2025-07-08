import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Book, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../lib/api';

const complaintSchema = z.object({
  type: z.enum(['reclamo', 'queja']),
  consumer_phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').optional(),
  product_description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  complaint_detail: z.string().min(20, 'El detalle debe tener al menos 20 caracteres'),
});

type ComplaintFormData = {
  type: 'reclamo' | 'queja';
  consumer_phone?: string;
  product_description: string;
  complaint_detail: string;
};

const ComplaintBook: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión para registrar una reclamación');
      navigate('/login');
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setLoading(true);
      await apiService.createComplaint(data);
      toast.success('Reclamación registrada exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error al registrar la reclamación:', error);
      toast.error('Error al registrar la reclamación');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <Book className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Libro de Reclamaciones
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Registra tu reclamo o queja
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de reclamación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Reclamación
              </label>
              <select
                {...register('type')}
                defaultValue="reclamo"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="reclamo">Reclamo</option>
                <option value="queja">Queja</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Teléfono (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono (opcional)
              </label>
              <input
                {...register('consumer_phone')}
                type="tel"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {errors.consumer_phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.consumer_phone.message}
                </p>
              )}
            </div>

            {/* Detalles de la reclamación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción del Producto/Servicio
              </label>
              <textarea
                {...register('product_description')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {errors.product_description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.product_description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detalle de la Reclamación
              </label>
              <textarea
                {...register('complaint_detail')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {errors.complaint_detail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.complaint_detail.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Reclamación
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintBook; 