import { CSSProperties, FC } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Button from '../components/atoms/Button';
import CartFeedbackBanner from '../components/molecules/CartFeedbackBanner';
import CartItemList from '../components/organisms/CartItemList';
import CartSummary from '../components/organisms/CartSummary';
import { CartItem } from '../types';
import { useCart } from '../context/CartContext';

const CartPage: FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    updateItemQuantity,
    removeItem,
    clearCart,
    isLoadingCart,
    isMutatingCart,
    cartError,
    cartSuccess,
    clearCartMessages,
  } = useCart();

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 20px 48px',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      gap: '16px',
      flexWrap: 'wrap',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: 0,
    },
    cartMeta: {
      color: '#555',
      fontSize: '15px',
      fontWeight: '500',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      alignItems: 'start',
    },
    empty: {
      backgroundColor: 'white',
      border: '1px solid #ececec',
      borderRadius: '12px',
      padding: '48px 20px',
      textAlign: 'center',
    },
    loadingWrap: {
      backgroundColor: 'white',
      border: '1px solid #ececec',
      borderRadius: '12px',
      padding: '48px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: '16px',
      fontWeight: '500',
    },
    emptyTitle: {
      margin: '0 0 12px',
      fontSize: '24px',
      color: '#555',
      fontWeight: '700',
    },
    emptyText: {
      margin: '0 0 24px',
      color: '#777',
      fontSize: '15px',
    },
    continueLink: {
      textDecoration: 'none',
      width: 'fit-content',
      display: 'inline-block',
    },
  };

  const handleDecreaseQuantity = (item: CartItem): void => {
    void updateItemQuantity(item.id, item.quantity - 1);
  };

  const handleIncreaseQuantity = (item: CartItem): void => {
    void updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleRemoveItem = (item: CartItem): void => {
    void removeItem(item.id);
  };

  const handleClearCart = (): void => {
    void clearCart();
  };

  if (isLoadingCart) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.loadingWrap}>Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <Header />
        <CartFeedbackBanner
          error={cartError}
          success={cartSuccess}
          onDismiss={clearCartMessages}
        />
        <div style={styles.container}>
          <div style={styles.empty}>
            <h1 style={styles.emptyTitle}>Your cart is empty</h1>
            <p style={styles.emptyText}>Add products from the catalog to get started.</p>
            <Link to="/products" style={styles.continueLink}>
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />
      <CartFeedbackBanner
        error={cartError}
        success={cartSuccess}
        onDismiss={clearCartMessages}
      />
      <div style={styles.container}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>Shopping Cart</h1>
          <div style={styles.cartMeta}>{itemCount} item{itemCount === 1 ? '' : 's'}</div>
        </div>

        <div style={styles.layout}>
          <CartItemList
            items={items}
            isMutatingCart={isMutatingCart}
            onDecreaseQuantity={handleDecreaseQuantity}
            onIncreaseQuantity={handleIncreaseQuantity}
            onRemove={handleRemoveItem}
          />

          <CartSummary
            itemCount={itemCount}
            subtotal={subtotal}
            isMutatingCart={isMutatingCart}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
