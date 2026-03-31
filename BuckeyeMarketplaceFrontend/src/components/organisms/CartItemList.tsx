import { CSSProperties, FC } from 'react';
import { CartItem } from '../../types';
import CartItemRow from '../molecules/CartItemRow';

interface CartItemListProps {
  items: CartItem[];
  isMutatingCart: boolean;
  onDecreaseQuantity: (item: CartItem) => void;
  onIncreaseQuantity: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
}

const styles: Record<string, CSSProperties> = {
  list: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #ececec',
    overflow: 'hidden',
  },
};

const CartItemList: FC<CartItemListProps> = ({
  items,
  isMutatingCart,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemove,
}) => {
  return (
    <div style={styles.list}>
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          isMutatingCart={isMutatingCart}
          onDecreaseQuantity={onDecreaseQuantity}
          onIncreaseQuantity={onIncreaseQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartItemList;
