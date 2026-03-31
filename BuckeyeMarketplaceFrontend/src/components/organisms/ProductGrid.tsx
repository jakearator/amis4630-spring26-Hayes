import { FC, CSSProperties } from 'react';
import { Product } from '../../types';
import ProductCard from '../molecules/ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => Promise<void>;
}

const ProductGrid: FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const styles: Record<string, CSSProperties> = {
    gridContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '24px',
      padding: '40px 0',
    },
    empty: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#999',
    },
    emptyMessage: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#666',
    },
  };

  if (!products || products.length === 0) {
    return (
      <div style={styles.gridContainer}>
        <div style={styles.empty}>
          <p style={styles.emptyMessage}>No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gridContainer}>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
