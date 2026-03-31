import { CartApiResponse, Product, ProductListResponse, ProductResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const buildApiError = async (response: Response, fallback: string): Promise<Error> => {
  let message = '';

  try {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = await response.json() as
        | string
        | { message?: string; detail?: string; title?: string };

      if (typeof payload === 'string') {
        message = payload;
      } else {
        message = payload.message ?? payload.detail ?? payload.title ?? '';
      }
    } else {
      message = (await response.text()).trim();
    }
  } catch {
    message = '';
  }

  if (!message) {
    message = response.statusText || fallback;
  }

  return new Error(message);
};

/**
 * Fetches all products from the backend API
 */
export const getProducts = async (): Promise<ProductListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw await buildApiError(response, 'Failed to fetch products');
    }

    return (await response.json()) as ProductListResponse;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetches a single product by ID from the backend API
 */
export const getProductById = async (id: string | number): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw await buildApiError(response, 'Failed to fetch product');
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getCart = async (): Promise<CartApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart`);

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to fetch cart');
  }

  return (await response.json()) as CartApiResponse;
};

export const addCartItem = async (productId: number, quantity = 1): Promise<CartApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to add cart item');
  }

  return (await response.json()) as CartApiResponse;
};

export const updateCartItemQuantity = async (
  cartItemId: number,
  quantity: number,
): Promise<CartApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to update cart item quantity');
  }

  return (await response.json()) as CartApiResponse;
};

export const removeCartItem = async (cartItemId: number): Promise<CartApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to remove cart item');
  }

  return (await response.json()) as CartApiResponse;
};

export const clearCart = async (): Promise<CartApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to clear cart');
  }

  return (await response.json()) as CartApiResponse;
};
