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
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay src o ya hubo error, usar fallback directamente
    if (!src || imageError) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }

    // Si hay src y no ha habido error, intentar cargar la imagen original
    setCurrentSrc(src);
    setIsLoading(true);
    setImageError(false);
  }, [src, fallbackSrc, imageError]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
    // Una vez que falla, cambiar a la imagen por defecto
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && currentSrc === src && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
      
      <img
        src={currentSrc || fallbackSrc}
        alt={alt}
        className={`${className} ${isLoading && currentSrc === src ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {imageError && currentSrc === fallbackSrc && (
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