import { CSSProperties, FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  isMutatingCart: boolean;
  onClearCart: () => void;
}

const styles: Record<string, CSSProperties> = {
  summary: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #ececec',
    padding: '20px',
    position: 'sticky',
    top: '92px',
  },
  summaryTitle: {
    margin: '0 0 18px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#444',
    fontSize: '14px',
  },
  divider: {
    borderTop: '1px solid #ececec',
    margin: '12px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  totalLabel: {
    fontSize: '15px',
    color: '#1a1a1a',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: '22px',
    color: '#BB0000',
    fontWeight: '800',
  },
  summaryActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  clearButton: {
    border: '1px solid #ddd',
    background: '#fff',
    color: '#333',
    borderRadius: '6px',
    padding: '10px 14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  continueLink: {
    textDecoration: 'none',
    width: 'fit-content',
    display: 'inline-block',
  },
};

const CartSummary: FC<CartSummaryProps> = ({
  itemCount,
  subtotal,
  isMutatingCart,
  onClearCart,
}) => {
  return (
    <aside style={styles.summary}>
      <h2 style={styles.summaryTitle}>Order Summary</h2>
      <div style={styles.summaryRow}>
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div style={styles.summaryRow}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div style={styles.summaryRow}>
        <span>Shipping</span>
        <span>$0.00</span>
      </div>
      <div style={styles.divider} />
      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalValue}>${subtotal.toFixed(2)}</span>
      </div>

      <div style={styles.summaryActions}>
        <Link to="/products" style={styles.continueLink}>
          <Button>Continue Shopping</Button>
        </Link>
        <button
          style={styles.clearButton}
          onClick={onClearCart}
          disabled={isMutatingCart}
        >
          Clear Cart
        </button>
      </div>
    </aside>
  );
};

export default CartSummary;
