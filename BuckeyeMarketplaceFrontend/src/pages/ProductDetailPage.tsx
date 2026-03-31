import { CSSProperties, FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Image from '../components/atoms/Image';
import Button from '../components/atoms/Button';
import CartFeedbackBanner from '../components/molecules/CartFeedbackBanner';
import { useCart } from '../context/CartContext';
import { useProductDetail } from '../hooks/useProductDetail';

const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, notFound, error } = useProductDetail(id);
  const {
    addItem,
    cartError,
    cartSuccess,
    clearCartMessages,
    isMutatingCart,
  } = useCart();

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    backButton: {
      marginBottom: '32px',
    },
    backLink: {
      color: '#BB0000',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '48px',
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '1',
      backgroundColor: '#f8f8f8',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    category: {
      display: 'inline-block',
      backgroundColor: '#f5f5f5',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#999',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      width: 'fit-content',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '24px',
      lineHeight: '1.2',
    },
    brand: {
      fontSize: '15px',
      color: '#555',
      marginBottom: '8px',
      fontWeight: '400',
    },
    brandName: {
      color: '#BB0000',
      fontWeight: '600',
    },
    postedDate: {
      fontSize: '13px',
      color: '#999',
      marginBottom: '20px',
    },
    divider: {
      borderTop: '1px solid #f0f0f0',
      marginBottom: '20px',
    },
    price: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#BB0000',
      marginBottom: '24px',
    },
    descriptionLabel: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '10px',
    },
    description: {
      fontSize: '15px',
      color: '#555',
      lineHeight: '1.7',
      marginBottom: '32px',
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingTop: '20px',
    },
    stockStatus: {
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#444',
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '500px',
      fontSize: '16px',
      color: '#999',
    },
    notFound: {
      textAlign: 'center',
      padding: '60px 20px',
    },
    notFoundMessage: {
      fontSize: '24px',
      color: '#999',
      marginBottom: '24px',
      fontWeight: '600',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      textAlign: 'center',
    },
  };

  if (isLoading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.loading}>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.error}>
            <p>Error loading product: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.backButton}>
            <Link to="/products" style={styles.backLink}>
              ← Back to Products
            </Link>
          </div>
          <div style={styles.notFound}>
            <p style={styles.notFoundMessage}>Product not found</p>
            <Link to="/products">
              <Button>Return to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.page}>
      <Header />
      <CartFeedbackBanner
        error={cartError}
        success={cartSuccess}
        onDismiss={clearCartMessages}
      />
      <div style={styles.container}>
        <div style={styles.backButton}>
          <Link to="/products" style={styles.backLink}>
            ← Back to Products
          </Link>
        </div>

        <div style={styles.content}>
          <div style={styles.imageContainer}>
            <Image
              src={product.imageUrl}
              alt={product.title}
              width="100%"
              height="100%"
            />
          </div>

          <div style={styles.details}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.title}>{product.title}</h1>

            <div style={styles.brand}>
              Brand: <span style={styles.brandName}>{product.brand}</span>
            </div>
            <div style={styles.postedDate}>Added {formatDate(product.postedDate)}</div>

            <div style={styles.divider} />

            <div style={styles.price}>${product.price.toFixed(2)}</div>

            <div style={styles.stockStatus}>
              {!product.isAvailable
                ? 'This product is currently unavailable.'
                : product.stockQuantity <= 0
                  ? 'This product is out of stock.'
                  : `In stock: ${product.stockQuantity}`}
            </div>

            <div>
              <p style={styles.descriptionLabel}>Description</p>
              <p style={styles.description}>{product.description}</p>
            </div>

            <div style={styles.buttonContainer}>
              <Button
                onClick={() => void addItem(product)}
                disabled={isMutatingCart || !product.isAvailable || product.stockQuantity <= 0}
              >
                {isMutatingCart ? 'Updating Cart...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
