import {
  AuthResponse,
  CartApiResponse,
  LoginRequest,
  Order,
  OrderHistoryResponse,
  PlaceOrderRequest,
  Product,
  ProductListResponse,
  ProductResponse,
  ProductUpsertRequest,
  RegisterRequest,
  UpdateOrderStatusRequest,
} from '../types';
import { getAccessToken } from './authStorage';

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = (configuredApiBaseUrl && configuredApiBaseUrl.length > 0
  ? `${configuredApiBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '')}/api`
  : 'http://localhost:5000/api').replace(/\/+$/, '');

if (import.meta.env.PROD && !configuredApiBaseUrl) {
  console.warn('VITE_API_URL is not set. Configure it for production builds.');
}

const buildHeaders = (headers?: HeadersInit): Headers => {
  const mergedHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (accessToken) {
    mergedHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return mergedHeaders;
};

const apiFetch = async (input: string, init?: RequestInit): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers: buildHeaders(init?.headers),
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  return response;
};

const extractValidationMessages = (errors: unknown): string[] => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  return Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : []))
    .filter((message): message is string => typeof message === 'string' && message.trim().length > 0);
};

const buildApiError = async (response: Response, fallback: string): Promise<Error> => {
  let message = '';

  try {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = await response.json() as
        | string
        | string[]
        | { message?: string; detail?: string; title?: string; errors?: unknown };

      if (typeof payload === 'string') {
        message = payload;
      } else if (Array.isArray(payload)) {
        message = payload.filter((item) => typeof item === 'string' && item.trim().length > 0).join(' ');
      } else {
        const validationMessages = extractValidationMessages(payload.errors);
        const primaryMessage = payload.message ?? payload.detail ?? payload.title ?? '';

        if (primaryMessage && validationMessages.length > 0) {
          message = `${primaryMessage} ${validationMessages.join(' ')}`;
        } else if (validationMessages.length > 0) {
          message = validationMessages.join(' ');
        } else {
          message = primaryMessage;
        }
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
    const response = await apiFetch('/products');

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
    const response = await apiFetch(`/products/${id}`);

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
  const response = await apiFetch('/cart');

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to fetch cart');
  }

  return (await response.json()) as CartApiResponse;
};

export const addCartItem = async (productId: number, quantity = 1): Promise<CartApiResponse> => {
  const response = await apiFetch('/cart', {
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
  const response = await apiFetch(`/cart/${cartItemId}`, {
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
  const response = await apiFetch(`/cart/${cartItemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to remove cart item');
  }

  return (await response.json()) as CartApiResponse;
};

export const clearCart = async (): Promise<CartApiResponse> => {
  const response = await apiFetch('/cart/clear', {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to clear cart');
  }

  return (await response.json()) as CartApiResponse;
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to login');
  }

  return (await response.json()) as AuthResponse;
};

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to register');
  }

  return (await response.json()) as AuthResponse;
};

export const placeOrder = async (request: PlaceOrderRequest): Promise<Order> => {
  const response = await apiFetch('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to place order');
  }

  return (await response.json()) as Order;
};

export const getMyOrders = async (): Promise<OrderHistoryResponse> => {
  const response = await apiFetch('/orders/mine');

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to fetch order history');
  }

  return (await response.json()) as OrderHistoryResponse;
};

export const createProduct = async (request: ProductUpsertRequest): Promise<Product> => {
  const response = await apiFetch('/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to create product');
  }

  return (await response.json()) as Product;
};

export const updateProduct = async (id: number, request: ProductUpsertRequest): Promise<Product> => {
  const response = await apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to update product');
  }

  return (await response.json()) as Product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to delete product');
  }
};

export const getAllOrdersForAdmin = async (): Promise<OrderHistoryResponse> => {
  const response = await apiFetch('/orders/admin');

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to fetch all orders');
  }

  return (await response.json()) as OrderHistoryResponse;
};

export const updateOrderStatus = async (
  orderId: number,
  request: UpdateOrderStatusRequest,
): Promise<Order> => {
  const response = await apiFetch(`/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to update order status');
  }

  return (await response.json()) as Order;
};
