import { FC, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import Image from '../atoms/Image';
import Button from '../atoms/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<void>;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stockQuantity <= 0;
  const isUnavailable = !product.isAvailable;
  const disableAddToCart = isOutOfStock || isUnavailable;

  const styles: Record<string, CSSProperties> = {
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
      flex: 1,
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
    } as CSSProperties,
    brand: {
      fontSize: '13px',
      color: '#555',
      marginBottom: '12px',
      fontWeight: '400',
    },
    footer: {
      padding: '12px 16px 16px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '12px',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#BB0000',
    },
    buttonWrap: {
      width: '100%',
    },
    stockStatus: {
      fontSize: '12px',
      fontWeight: '600',
      color: isUnavailable ? '#991b1b' : isOutOfStock ? '#92400e' : '#166534',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = styles.cardHover.transform as string;
        e.currentTarget.style.boxShadow = styles.cardHover.boxShadow as string;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = styles.card.boxShadow as string;
      }}
    >
      <Link to={`/products/${product.id}`} style={styles.link}>
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
        </div>
      </Link>
      <div style={styles.footer}>
        <span style={styles.price}>${Number(product.price).toFixed(2)}</span>
        <span style={styles.stockStatus}>
          {isUnavailable
            ? 'Unavailable'
            : isOutOfStock
              ? 'Out of stock'
              : `${product.stockQuantity} in stock`}
        </span>
        <div style={styles.buttonWrap}>
          <Button onClick={() => void onAddToCart(product)} disabled={disableAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
