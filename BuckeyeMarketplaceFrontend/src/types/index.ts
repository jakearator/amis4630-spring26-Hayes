/**
 * Shared TypeScript types and interfaces for the Buckeye Marketplace frontend
 */

/**
 * Product interface - Represents a product from the backend API
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  postedDate: string;
  imageUrl: string;
  brand?: string;
  isAvailable: boolean;
  stockQuantity: number;
}

export interface ProductUpsertRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  postedDate: string;
  imageUrl: string;
  brand?: string;
  isAvailable: boolean;
  stockQuantity: number;
}

export interface CartItem extends Product {
  cartItemId: number;
  quantity: number;
}

export interface CartApiItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface CartApiResponse {
  id: number;
  userId: string;
  items: CartApiItem[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
}

export interface PlaceOrderRequest {
  shippingAddress: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productTitle: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: string;
  status: string;
  total: number;
  shippingAddress: string;
  confirmationNumber: string;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export type OrderHistoryResponse = Order[];

/**
 * API Response interface for product list
 */
export type ProductListResponse = Product[];

/**
 * API Response interface for single product
 */
export type ProductResponse = Product | null;
