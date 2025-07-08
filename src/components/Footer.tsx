import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sobre Nosotros
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Comida Express es la plataforma líder de delivery de comida en Perú. 
              Conectamos a los mejores restaurantes con los amantes de la buena comida.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/register"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                >
                  Registra tu Restaurante
                </Link>
              </li>
              <li>
                <Link 
                  to="/complaints"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                >
                  Libro de Reclamaciones
                </Link>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                >
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                Av. Principal 123, Lima
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +51 (01) 123-4567
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                contacto@comidaexpress.com
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Lun - Dom: 8:00 - 22:00
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Síguenos
            </h3>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Suscríbete a nuestro boletín para recibir ofertas exclusivas
            </p>
            <form className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Suscribirse
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Comida Express. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 