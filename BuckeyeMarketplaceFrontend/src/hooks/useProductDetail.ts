import { useEffect, useState } from 'react';
import { getProductById } from '../services/api';
import { Product } from '../types';

interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
}

export const useProductDetail = (productId?: string): UseProductDetailResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async (): Promise<void> => {
      if (!productId) {
        setNotFound(true);
        setProduct(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getProductById(productId);

        if (data === null) {
          setNotFound(true);
          setProduct(null);
        } else {
          setProduct(data);
          setNotFound(false);
        }

        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId]);

  return { product, isLoading, notFound, error };
};
