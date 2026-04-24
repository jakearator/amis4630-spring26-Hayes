import { CartItem, Product } from '../types';

const GUEST_CART_STORAGE_KEY = 'buckeye-marketplace-guest-cart';

interface StoredGuestCartItem {
  product: Product;
  quantity: number;
}

const toStoredItem = (item: CartItem): StoredGuestCartItem => {
  const { cartItemId: _cartItemId, quantity, ...product } = item;

  return {
    product,
    quantity,
  };
};

export const loadGuestCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const storedItems = JSON.parse(rawValue) as StoredGuestCartItem[];

    return storedItems
      .filter((item) => item?.product && item.quantity > 0)
      .map((item) => ({
        ...item.product,
        cartItemId: -item.product.id,
        quantity: item.quantity,
      }));
  } catch {
    return [];
  }
};

export const saveGuestCartItems = (items: CartItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (items.length === 0) {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify(items.map(toStoredItem)),
  );
};

export const clearGuestCartItems = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
};
