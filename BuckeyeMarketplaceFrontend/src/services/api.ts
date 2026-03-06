import { Product, ProductListResponse, ProductResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches all products from the backend API
 */
export const getProducts = async (): Promise<ProductListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
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
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
