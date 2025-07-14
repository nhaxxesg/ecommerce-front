import React, { useState, useEffect } from 'react';
import { Image, Loader2 } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [hasAttemptedOriginal, setHasAttemptedOriginal] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setHasAttemptedOriginal(false);
    setIsLoading(false);
    
    // Si no hay src, usar fallback directamente
    if (!src) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Si hay src y no hemos intentado cargarla aún, intentar una sola vez
    if (src && !hasAttemptedOriginal) {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasAttemptedOriginal(true);
    }
  }, [src, fallbackSrc]); // Removido imageError de las dependencias

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    // Una vez que falla, cambiar definitivamente a la imagen por defecto
    // y no volver a intentar cargar la original
    setCurrentSrc(fallbackSrc);
  };

  // Determinar si mostrar el placeholder de error
  const shouldShowErrorPlaceholder = currentSrc === fallbackSrc && src && hasAttemptedOriginal;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
      
      <img
        src={currentSrc || fallbackSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {shouldShowErrorPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Imagen no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback; 