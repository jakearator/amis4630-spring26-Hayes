import { CSSProperties, FC } from 'react';
import { CartItem } from '../../types';
import Image from '../atoms/Image';

interface CartItemRowProps {
  item: CartItem;
  isMutatingCart: boolean;
  onDecreaseQuantity: (item: CartItem) => void;
  onIncreaseQuantity: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '18px',
    borderBottom: '1px solid #f0f0f0',
    alignItems: 'center',
  },
  imageWrap: {
    width: '110px',
    height: '110px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    minWidth: '220px',
  },
  itemTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 1.4,
  },
  itemBrand: {
    margin: '6px 0 8px',
    color: '#666',
    fontSize: '13px',
  },
  itemPrice: {
    margin: 0,
    color: '#BB0000',
    fontWeight: '700',
    fontSize: '18px',
  },
  itemSubtotal: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px',
    marginLeft: 'auto',
  },
  qtyGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  qtyButton: {
    border: 'none',
    background: '#f5f5f5',
    width: '34px',
    height: '34px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#333',
  },
  qtyValue: {
    width: '40px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  removeButton: {
    border: 'none',
    background: 'none',
    color: '#b00020',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: 0,
  },
};

const CartItemRow: FC<CartItemRowProps> = ({
  item,
  isMutatingCart,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemove,
}) => {
  return (
    <div style={styles.row}>
      <div style={styles.imageWrap}>
        <Image src={item.imageUrl} alt={item.title} width="100%" height="100%" />
      </div>

      <div style={styles.info}>
        <h2 style={styles.itemTitle}>{item.title}</h2>
        <p style={styles.itemBrand}>Brand: {item.brand}</p>
        <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
        <p style={styles.itemSubtotal}>Line total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.qtyGroup}>
          <button
            style={styles.qtyButton}
            onClick={() => onDecreaseQuantity(item)}
            disabled={isMutatingCart || item.quantity <= 1}
            aria-label={`Decrease quantity for ${item.title}`}
          >
            -
          </button>
          <span style={styles.qtyValue}>{item.quantity}</span>
          <button
            style={styles.qtyButton}
            onClick={() => onIncreaseQuantity(item)}
            disabled={isMutatingCart || item.quantity >= item.stockQuantity}
            aria-label={`Increase quantity for ${item.title}`}
          >
            +
          </button>
        </div>

        <button
          style={styles.removeButton}
          onClick={() => onRemove(item)}
          disabled={isMutatingCart}
          aria-label={`Remove ${item.title} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
