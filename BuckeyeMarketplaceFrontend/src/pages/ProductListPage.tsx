import { CSSProperties, FC } from 'react';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import ProductGrid from '../components/organisms/ProductGrid';
import CartFeedbackBanner from '../components/molecules/CartFeedbackBanner';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

const ProductListPage: FC = () => {
  const { products, isLoading, error } = useProducts();
  const { addItem, cartError, cartSuccess, clearCartMessages } = useCart();

  const styles: Record<string, CSSProperties> = {
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
      <CartFeedbackBanner
        error={cartError}
        success={cartSuccess}
        onDismiss={clearCartMessages}
      />
      <Hero />

      {isLoading && (
        <div style={styles.loadingContainer}>
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p>Error loading products: {error}</p>
        </div>
      )}

      {!isLoading && !error && <ProductGrid products={products} onAddToCart={addItem} />}
    </div>
  );
};

export default ProductListPage;
