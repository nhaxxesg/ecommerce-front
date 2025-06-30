import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, MenuItem, Restaurant } from '../types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; restaurant: Restaurant } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (menuItem: MenuItem, restaurant: Restaurant) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, restaurant } = action.payload;
      
      // Check if adding from different restaurant
      if (state.restaurant && state.restaurant.id !== restaurant.id) {
        return state; // Don't add, will show error in component
      }

      const existingItemIndex = state.items.findIndex(
        item => item.menu_item.id === menuItem.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { menu_item: menuItem, quantity: 1, restaurant }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.menu_item.price * item.quantity,
        0
      );

      return {
        items: newItems,
        restaurant: restaurant,
        total,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.menu_item.id !== action.payload);
      const total = newItems.reduce(
        (sum, item) => sum + item.menu_item.price * item.quantity,
        0
      );

      return {
        items: newItems,
        restaurant: newItems.length > 0 ? state.restaurant : null,
        total,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: menuItemId });
      }

      const newItems = state.items.map(item =>
        item.menu_item.id === menuItemId
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.menu_item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: newItems,
        total,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        restaurant: null,
        total: 0,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurant: null,
    total: 0,
  });

  const addItem = (menuItem: MenuItem, restaurant: Restaurant) => {
    if (state.restaurant && state.restaurant.id !== restaurant.id) {
      toast.error('Solo puedes pedir de un restaurante a la vez');
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurant } });
    toast.success(`${menuItem.name} agregado al carrito`);
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItemId });
    toast.success('Producto eliminado del carrito');
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};