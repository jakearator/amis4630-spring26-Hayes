import { CSSProperties, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Header from '../components/organisms/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';

type CheckoutMode = 'account' | 'choice' | 'guest';

const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { items, itemCount, subtotal, finalizeCheckout } = useCart();
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(isAuthenticated ? 'account' : 'choice');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isGuestCheckout = !isAuthenticated && checkoutMode === 'guest';

  useEffect(() => {
    setCheckoutMode(isAuthenticated ? 'account' : 'choice');
  }, [isAuthenticated]);

  const canPlaceOrder = useMemo(() => {
    if (items.length === 0 || shippingAddress.trim().length === 0 || isSubmitting) {
      return false;
    }

    if (isGuestCheckout && customerEmail.trim().length === 0) {
      return false;
    }

    return true;
  }, [customerEmail, isGuestCheckout, items.length, shippingAddress, isSubmitting]);

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
    title: {
      margin: '0 0 20px',
      fontSize: '28px',
      fontWeight: 700,
      color: '#1a1a1a',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      alignItems: 'start',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #ececec',
      padding: '20px',
    },
    optionCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #ececec',
      padding: '20px',
      marginBottom: '24px',
    },
    sectionTitle: {
      margin: '0 0 14px',
      fontSize: '18px',
      fontWeight: 700,
      color: '#1a1a1a',
    },
    orderList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      borderBottom: '1px solid #f1f1f1',
      paddingBottom: '12px',
      fontSize: '14px',
      color: '#333',
    },
    itemTitle: {
      margin: 0,
      fontWeight: 600,
    },
    itemMeta: {
      margin: '4px 0 0',
      color: '#666',
      fontSize: '13px',
    },
    totals: {
      marginTop: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      color: '#333',
      fontSize: '15px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    grandTotal: {
      fontWeight: 800,
      color: '#BB0000',
      fontSize: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
    },
    input: {
      width: '100%',
      borderRadius: '8px',
      border: '1px solid #d6d6d6',
      padding: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      marginBottom: '16px',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      borderRadius: '8px',
      border: '1px solid #d6d6d6',
      padding: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    error: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#b00020',
      fontWeight: 600,
    },
    formActions: {
      marginTop: '16px',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    choiceActions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '14px',
    },
    linkButton: {
      textDecoration: 'none',
      display: 'inline-block',
    },
    emptyWrap: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px solid #ececec',
      padding: '36px 20px',
      textAlign: 'center',
    },
    emptyText: {
      margin: '0 0 18px',
      color: '#555',
      fontSize: '16px',
    },
    optionText: {
      margin: 0,
      color: '#555',
      fontSize: '15px',
      lineHeight: 1.5,
    },
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const address = shippingAddress.trim();
    const email = customerEmail.trim();

    if (!address) {
      setError('Shipping address is required.');
      return;
    }

    if (isGuestCheckout && !email) {
      setError('Email is required for guest checkout.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        shippingAddress: address,
        customerEmail: isGuestCheckout ? email : undefined,
        items: isGuestCheckout
          ? items.map((item) => ({ productId: item.id, quantity: item.quantity }))
          : undefined,
      });
      await finalizeCheckout();
      navigate('/order-confirmation', { state: { order }, replace: true });
    } catch (submitError) {
      if (submitError instanceof Error && submitError.message.trim().length > 0) {
        setError(submitError.message);
      } else {
        setError('Unable to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.emptyWrap}>
            <p style={styles.emptyText}>Your cart is empty, so checkout is unavailable.</p>
            <Link to="/products" style={styles.linkButton}>
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const loginState = {
    from: {
      pathname: location.pathname,
    },
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        {!isAuthenticated && (
          <section style={styles.optionCard}>
            <h2 style={styles.sectionTitle}>Choose How to Continue</h2>
            <p style={styles.optionText}>
              You can sign in to use your account, or continue with guest checkout and place this order without logging in.
            </p>
            <div style={styles.choiceActions}>
              <Link to="/login" state={loginState} style={styles.linkButton}>
                <Button type="button">Log In</Button>
              </Link>
              <Button type="button" onClick={() => setCheckoutMode('guest')}>
                Checkout as Guest
              </Button>
            </div>
          </section>
        )}

        <div style={styles.layout}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Order Summary</h2>
            <ul style={styles.orderList}>
              {items.map((item) => (
                <li key={item.cartItemId} style={styles.orderItem}>
                  <div>
                    <p style={styles.itemTitle}>{item.title}</p>
                    <p style={styles.itemMeta}>Qty {item.quantity}</p>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </li>
              ))}
            </ul>

            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              {isGuestCheckout ? 'Guest Checkout Details' : 'Shipping Address'}
            </h2>

            {!isAuthenticated && checkoutMode !== 'guest' ? (
              <p style={styles.optionText}>
                Select <strong>Log In</strong> or <strong>Checkout as Guest</strong> above to continue.
              </p>
            ) : (
              <form onSubmit={(event) => { void handleSubmit(event); }}>
                {isGuestCheckout && (
                  <>
                    <label htmlFor="customer-email" style={styles.label}>Email address</label>
                    <input
                      id="customer-email"
                      name="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      style={styles.input}
                      maxLength={256}
                      required
                    />
                  </>
                )}

                <label htmlFor="shipping-address" style={styles.label}>Enter full delivery address</label>
                <textarea
                  id="shipping-address"
                  name="shippingAddress"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  style={styles.textarea}
                  maxLength={500}
                  required
                />

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.formActions}>
                  <Button type="submit" disabled={!canPlaceOrder}>
                    {isSubmitting
                      ? 'Placing Order...'
                      : isGuestCheckout
                        ? 'Place Guest Order'
                        : 'Place Order'}
                  </Button>
                  <Link to="/cart" style={styles.linkButton}>
                    <Button type="button" disabled={isSubmitting}>Back to Cart</Button>
                  </Link>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
