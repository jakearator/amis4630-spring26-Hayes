import { Link } from 'react-router-dom';
import Image from '../atoms/Image';

export default function ProductCard({ product }) {
  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #f0f0f0',
    },
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    },
    imageContainer: {
      width: '100%',
      height: '240px',
      overflow: 'hidden',
      backgroundColor: '#f8f8f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: '16px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    },
    category: {
      display: 'inline-block',
      backgroundColor: '#f5f5f5',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      color: '#999',
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      width: 'fit-content',
    },
    title: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '8px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    brand: {
      fontSize: '13px',
      color: '#555',
      marginBottom: '12px',
      fontWeight: '400',
    },
    footer: {
      marginTop: 'auto',
      paddingTop: '12px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#BB0000',
    },
  };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={styles.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = styles.cardHover.transform;
          e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = styles.card.boxShadow;
        }}
      >
        <div style={styles.imageContainer}>
          <Image
            src={product.imageUrl}
            alt={product.title}
            width="100%"
            height="100%"
          />
        </div>
        <div style={styles.content}>
          <span style={styles.category}>{product.category}</span>
          <div style={styles.title}>{product.title}</div>
          <div style={styles.brand}>Brand: {product.brand}</div>
          <div style={styles.footer}>
            <span style={styles.price}>${product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
