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
    // Si no, asumimos que es una ruta relativa y la convertimos en absoluta
    return `${import.meta.env.VITE_API_URL?.replace('/api', '')}${url}`;
}; 