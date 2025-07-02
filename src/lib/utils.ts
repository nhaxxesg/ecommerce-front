/**
 * Convierte un valor a número de forma segura y lo formatea como precio
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const safePrice = isNaN(numericPrice) ? 0 : numericPrice;
  return `S/. ${safePrice.toFixed(2)}`;
};

/**
 * Convierte un valor a número de forma segura
 */
export const toNumber = (value: number | string): number => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numericValue) ? 0 : numericValue;
}; 