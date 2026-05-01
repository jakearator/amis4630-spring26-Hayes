import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { getProductFallbackImage, resolveProductImageSource } from '../../utils/productImages';
import Image from '../atoms/Image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<void>;
  onSaveClick?: () => void;
}

interface IconProps {
  className?: string;
}

const CartIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6.5 6.5h14l-1.6 7.25a2 2 0 0 1-1.95 1.57H9.1a2 2 0 0 1-1.95-1.56L5.3 4.4H2.75" />
    <circle cx="9.25" cy="20" r="1.35" />
    <circle cx="17.35" cy="20" r="1.35" />
  </svg>
);

const HeartIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 20.5s-7.5-4.45-7.5-10.35A4.18 4.18 0 0 1 8.65 6a4.65 4.65 0 0 1 3.35 1.5A4.65 4.65 0 0 1 15.35 6a4.18 4.18 0 0 1 4.15 4.15C19.5 16.05 12 20.5 12 20.5z" />
  </svg>
);

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart, onSaveClick }) => {
  const isOutOfStock = product.stockQuantity <= 0;
  const isUnavailable = !product.isAvailable;
  const disableAddToCart = isOutOfStock || isUnavailable;
  const stockLabel = isUnavailable
    ? 'Unavailable'
    : isOutOfStock
      ? 'Out of stock'
      : `${product.stockQuantity} in stock`;
  const stockClass = isUnavailable
    ? 'product-card__stock product-card__stock--unavailable'
    : isOutOfStock
      ? 'product-card__stock product-card__stock--out'
      : 'product-card__stock';
  const fallbackImageUrl = getProductFallbackImage(product.category);
  const imageUrl = resolveProductImageSource(product);

  return (
    <article className={`product-card${disableAddToCart ? ' product-card--unavailable' : ''}`}>
      <div className="product-card__media">
        <Link to={`/products/${product.id}`} aria-label={`View details for ${product.title}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            width="100%"
            height="100%"
            fallbackSrc={fallbackImageUrl}
            objectFit="contain"
            backgroundColor="transparent"
            mixBlendMode="multiply"
          />
        </Link>
        <button
          type="button"
          className="product-card__save"
          onClick={onSaveClick}
          title="Save item - coming soon"
          aria-label="Save item - coming soon"
        >
          <HeartIcon className="product-card__save-icon" />
        </button>
        {disableAddToCart && <span className="product-card__status-ribbon">{stockLabel}</span>}
      </div>

      <div className="product-card__body">
        <Link to={`/products/${product.id}`} className="product-card__details-link">
          <span className="product-card__category">{product.category}</span>
          <h3>{product.title}</h3>
          <p>Brand: {product.brand || 'Not listed'}</p>
        </Link>
      </div>

      <div className="product-card__footer">
        <div>
          <strong className="product-card__price">${Number(product.price).toFixed(2)}</strong>
          <span className={stockClass}>{stockLabel}</span>
        </div>
        <button
          type="button"
          className="product-card__cart-button"
          onClick={() => void onAddToCart(product)}
          disabled={disableAddToCart}
        >
          <CartIcon className="product-card__cart-icon" />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
