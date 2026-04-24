import { CSSProperties, FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Header from '../components/organisms/Header';
import { Order } from '../types';

interface ConfirmationLocationState {
  order?: Order;
}

const OrderConfirmationPage: FC = () => {
  const location = useLocation();
  const state = location.state as ConfirmationLocationState | null;
  const order = state?.order;
  const isGuestOrder = order?.userId == null;

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '32px 20px 48px',
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #ececec',
      borderRadius: '12px',
      padding: '28px',
    },
    title: {
      margin: '0 0 12px',
      fontSize: '30px',
      color: '#1a1a1a',
      fontWeight: 800,
    },
    text: {
      margin: '0 0 14px',
      color: '#444',
      fontSize: '15px',
      lineHeight: 1.5,
    },
    confirmationNumber: {
      display: 'inline-block',
      backgroundColor: '#fff6f6',
      border: '1px solid #f1caca',
      borderRadius: '8px',
      padding: '8px 12px',
      color: '#900',
      fontSize: '16px',
      fontWeight: 800,
      marginBottom: '16px',
    },
    details: {
      margin: '0 0 18px',
      padding: '0',
      listStyle: 'none',
      color: '#333',
      display: 'grid',
      gap: '8px',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    linkButton: {
      textDecoration: 'none',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Order Confirmed</h1>

          {order ? (
            <>
              <p style={styles.text}>Thank you for your purchase. Your order has been placed successfully.</p>
              <div style={styles.confirmationNumber}>{order.confirmationNumber}</div>
              <ul style={styles.details}>
                <li>Status: {order.status}</li>
                <li>Placed: {new Date(order.orderDate).toLocaleString()}</li>
                <li>Total: ${order.total.toFixed(2)}</li>
                {order.customerEmail && <li>Email: {order.customerEmail}</li>}
                <li>Shipping Address: {order.shippingAddress}</li>
              </ul>
            </>
          ) : (
            <p style={styles.text}>
              Your order was placed, but this confirmation view was opened without order details.
            </p>
          )}

          <div style={styles.actions}>
            {!isGuestOrder && (
              <Link to="/orders" style={styles.linkButton}>
                <Button>View Order History</Button>
              </Link>
            )}
            <Link to="/products" style={styles.linkButton}>
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
