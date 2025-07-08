/**
 * Convierte un valor a número de forma segura y lo formatea como precio
 */
export const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `S/. ${numericPrice.toFixed(2)}`;
};

/**
 * Convierte un valor a número de forma segura
 */
export const toNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value) || 0;
};

export const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    
    // Si la URL ya es absoluta (comienza con http:// o https://), la devolvemos tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Obtener la URL base del backend desde las variables de entorno
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', '');
    
    // Asegurarnos de que la URL comience con /storage
    const storagePath = url.startsWith('/storage') ? url : `/storage/${url}`;
    return `${baseUrl}${storagePath}`;
}; 