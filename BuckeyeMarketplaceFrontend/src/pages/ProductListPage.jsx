import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import ProductGrid from '../components/organisms/ProductGrid';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      fontSize: '16px',
      color: '#999',
    },
    errorContainer: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#991b1b',
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <Hero />

      {loading && (
        <div style={styles.loadingContainer}>
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p>Error loading products: {error}</p>
        </div>
      )}

      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
}
