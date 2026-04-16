import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItemQuantity } from '../services/api';
import { CartApiResponse, CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoadingCart: boolean;
  isMutatingCart: boolean;
  cartError: string | null;
  cartSuccess: string | null;
  addItem: (product: Product) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reloadCart: () => Promise<void>;
  clearCartMessages: () => void;
}

const mapCartResponseToItems = (cart: CartApiResponse): CartItem[] => {
  return cart.items.map((item) => ({
    ...item.product,
    id: item.productId,
    cartItemId: item.id,
    quantity: item.quantity,
  }));
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(true);
  const [isMutatingCart, setIsMutatingCart] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);

  const syncCart = useCallback(async (): Promise<void> => {
    const cart = await getCart();
    setItems(mapCartResponseToItems(cart));
  }, []);

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return fallback;
  };

  const clearCartMessages = useCallback((): void => {
    setCartError(null);
    setCartSuccess(null);
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setItems([]);
        setCartError(null);
        setCartSuccess(null);
        setIsLoadingCart(false);
        return;
      }

      setIsLoadingCart(true);
      setCartError(null);

      try {
        await syncCart();
      } catch (error) {
        setCartError(getErrorMessage(error, 'Failed to load your cart. Please try again.'));
      } finally {
        setIsLoadingCart(false);
      }
    };

    void loadCart();
  }, [isAuthenticated, syncCart]);

  useEffect(() => {
    if (!cartSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCartSuccess(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cartSuccess]);

  const addItem = useCallback(async (product: Product): Promise<void> => {
    if (!product.isAvailable) {
      setCartError('This product is currently unavailable.');
      setCartSuccess(null);
      return;
    }

    if (product.stockQuantity <= 0) {
      setCartError('This product is out of stock.');
      setCartSuccess(null);
      return;
    }

    const previousItems = items;
    const existingItem = previousItems.find((item) => item.id === product.id);
    const nextQuantity = (existingItem?.quantity ?? 0) + 1;

    if (nextQuantity > product.stockQuantity) {
      setCartError(`Only ${product.stockQuantity} unit(s) are available for this product.`);
      setCartSuccess(null);
      return;
    }

    setIsMutatingCart(true);
    setCartError(null);

    setItems((currentItems) => {
      const existingLocalItem = currentItems.find((item) => item.id === product.id);

      if (existingLocalItem) {
        return currentItems.map((item) => (
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }

      return [
        ...currentItems,
        {
          ...product,
          cartItemId: -Date.now(),
          quantity: 1,
        },
      ];
    });

    try {
      await addCartItem(product.id, 1);
      await syncCart();
      setCartSuccess(existingItem
        ? `Updated quantity for ${product.title}.`
        : `${product.title} added to cart.`);
    } catch (error) {
      setItems(previousItems);
      setCartError(getErrorMessage(error, 'Unable to add item to cart.'));
      setCartSuccess(null);
    } finally {
      setIsMutatingCart(false);
    }
  }, [items, syncCart]);

  const updateItemQuantity = useCallback(async (productId: number, quantity: number): Promise<void> => {
    const previousItems = items;
    const targetItem = previousItems.find((item) => item.id === productId);

    if (!targetItem) {
      return;
    }

    if (quantity < 1) {
      setCartError('Quantity cannot be less than 1. Use Remove to delete an item.');
      setCartSuccess(null);
      return;
    }

    if (quantity > targetItem.stockQuantity) {
      setCartError(`Only ${targetItem.stockQuantity} unit(s) are available for this product.`);
      setCartSuccess(null);
      return;
    }

    setIsMutatingCart(true);
    setCartError(null);

    setItems((currentItems) => currentItems.map((item) => (
      item.id === productId ? { ...item, quantity } : item
    )));

    try {
      await updateCartItemQuantity(targetItem.cartItemId, quantity);
      await syncCart();
      setCartSuccess(`Updated quantity for ${targetItem.title}.`);
    } catch (error) {
      setItems(previousItems);
      setCartError(getErrorMessage(error, 'Unable to update item quantity.'));
      setCartSuccess(null);
    } finally {
      setIsMutatingCart(false);
    }
  }, [items, syncCart]);

  const removeItem = useCallback(async (productId: number): Promise<void> => {
    const previousItems = items;
    const targetItem = previousItems.find((item) => item.id === productId);

    if (!targetItem) {
      return;
    }

    setIsMutatingCart(true);
    setCartError(null);
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));

    try {
      await removeCartItem(targetItem.cartItemId);
      await syncCart();
      setCartSuccess(`${targetItem.title} removed from cart.`);
    } catch (error) {
      setItems(previousItems);
      setCartError(getErrorMessage(error, 'Unable to remove item from cart.'));
      setCartSuccess(null);
    } finally {
      setIsMutatingCart(false);
    }
  }, [items, syncCart]);

  const clearCartItems = useCallback(async (): Promise<void> => {
    const previousItems = items;

    if (previousItems.length === 0) {
      return;
    }

    setIsMutatingCart(true);
    setCartError(null);
    setItems([]);

    try {
      await clearCart();
      await syncCart();
      setCartSuccess('Cart cleared successfully.');
    } catch (error) {
      setItems(previousItems);
      setCartError(getErrorMessage(error, 'Unable to clear cart.'));
      setCartSuccess(null);
    } finally {
      setIsMutatingCart(false);
    }
  }, [items, syncCart]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isLoadingCart,
      isMutatingCart,
      cartError,
      cartSuccess,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart: clearCartItems,
      reloadCart: syncCart,
      clearCartMessages,
    };
  }, [
    addItem,
    cartError,
    cartSuccess,
    clearCartItems,
    clearCartMessages,
    isLoadingCart,
    isMutatingCart,
    items,
    syncCart,
    removeItem,
    updateItemQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
