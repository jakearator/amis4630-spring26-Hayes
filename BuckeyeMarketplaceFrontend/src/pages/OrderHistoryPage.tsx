import { CSSProperties, FC, useEffect, useState } from 'react';
import Header from '../components/organisms/Header';
import { getMyOrders } from '../services/api';
import { Order } from '../types';

const OrderHistoryPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '32px 20px 48px',
    },
    title: {
      margin: '0 0 20px',
      fontSize: '28px',
      fontWeight: 700,
      color: '#1a1a1a',
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #ececec',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    },
    confirmation: {
      margin: '0 0 10px',
      color: '#9a0000',
      fontSize: '16px',
      fontWeight: 800,
    },
    meta: {
      margin: '0 0 12px',
      color: '#444',
      fontSize: '14px',
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap',
    },
    shippingAddress: {
      margin: '0 0 12px',
      color: '#333',
      fontSize: '14px',
      lineHeight: 1.5,
    },
    list: {
      margin: 0,
      paddingLeft: '18px',
      color: '#333',
      lineHeight: 1.6,
      fontSize: '14px',
    },
    state: {
      backgroundColor: '#fff',
      border: '1px solid #ececec',
      borderRadius: '12px',
      padding: '28px',
      textAlign: 'center',
      color: '#555',
      fontWeight: 600,
    },
    error: {
      color: '#b00020',
    },
  };

  useEffect(() => {
    const loadOrders = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const orderHistory = await getMyOrders();
        setOrders(orderHistory);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.message.trim().length > 0) {
          setError(loadError.message);
        } else {
          setError('Unable to load order history.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>

        {isLoading && <div style={styles.state}>Loading your orders...</div>}

        {!isLoading && error && <div style={{ ...styles.state, ...styles.error }}>{error}</div>}

        {!isLoading && !error && orders.length === 0 && (
          <div style={styles.state}>You have not placed any orders yet.</div>
        )}

        {!isLoading && !error && orders.map((order) => (
          <article key={order.id} style={styles.card}>
            <p style={styles.confirmation}>{order.confirmationNumber}</p>
            <p style={styles.meta}>
              <span>{new Date(order.orderDate).toLocaleString()}</span>
              <span>Status: {order.status}</span>
              <span>Total: ${order.total.toFixed(2)}</span>
            </p>
            <p style={styles.shippingAddress}>Shipping Address: {order.shippingAddress}</p>
            <ul style={styles.list}>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productTitle} x{item.quantity} @ ${item.unitPrice.toFixed(2)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
