import ProductCard from '../molecules/ProductCard';

export default function ProductGrid({ products }) {
  const styles = {
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
      '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      },
      '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '16px',
      },
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
