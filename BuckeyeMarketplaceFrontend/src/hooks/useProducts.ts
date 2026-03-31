import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Product } from '../types';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return { products, isLoading, error };
};
