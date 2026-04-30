import { FC } from 'react';
import { Product } from '../../types';
import ProductCard from '../molecules/ProductCard';

interface SortOption {
  value: string;
  label: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => Promise<void>;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: string;
  sortOptions: SortOption[];
  onSortChange: (sortOption: string) => void;
  onFilterClick: () => void;
  onSaveClick: () => void;
  resultCount: number;
  totalCount: number;
  searchQuery?: string;
}

interface IconProps {
  className?: string;
}

const FilterIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 6.5h16" />
    <path d="M7.5 12h9" />
    <path d="M10.5 17.5h3" />
  </svg>
);

const CategoryIcon: FC<{ category: string; className?: string }> = ({ category, className }) => {
  const icon = category.toLowerCase();

  if (icon.includes('textbook')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 4.75h10.5A2.5 2.5 0 0 1 18 7.25V20H7.5A2.5 2.5 0 0 1 5 17.5z" />
        <path d="M8 8h6" />
        <path d="M8 11h5" />
        <path d="M7.5 20A2.5 2.5 0 0 1 5 17.5" />
      </svg>
    );
  }

  if (icon.includes('electronic')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="5" width="16" height="11" rx="1.5" />
        <path d="M9 20h6" />
        <path d="M12 16v4" />
      </svg>
    );
  }

  if (icon.includes('furniture')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" />
        <path d="M4 11.5h16v5H4z" />
        <path d="M6 16.5V20" />
        <path d="M18 16.5V20" />
      </svg>
    );
  }

  if (icon.includes('clothing')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 4.5h6l2.5 2 3 2.25-2.25 3L16 10.25V20H8V10.25l-2.25 1.5-2.25-3 3-2.25z" />
        <path d="M9 4.5a3 3 0 0 0 6 0" />
      </svg>
    );
  }

  if (icon.includes('home')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.5 11.25 12 5l7.5 6.25" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }

  if (icon.includes('sport')) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" />
        <path d="M7.5 7.5c3 1.5 6 1.5 9 0" />
        <path d="M7.5 16.5c3-1.5 6-1.5 9 0" />
        <path d="M12 4v16" />
      </svg>
    );
  }

  if (icon === 'all') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.5 4.5h6v6h-6z" />
        <path d="M13.5 4.5h6v6h-6z" />
        <path d="M4.5 13.5h6v6h-6z" />
        <path d="M13.5 13.5h6v6h-6z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5.25v13.5" />
      <path d="M5.25 12h13.5" />
      <path d="m7.5 7.5 9 9" />
      <path d="m16.5 7.5-9 9" />
    </svg>
  );
};

const ProductGrid: FC<ProductGridProps> = ({
  products,
  onAddToCart,
  categories,
  activeCategory,
  onCategoryChange,
  sortOption,
  sortOptions,
  onSortChange,
  onFilterClick,
  onSaveClick,
  resultCount,
  totalCount,
  searchQuery = '',
}) => {
  const trimmedSearchQuery = searchQuery.trim();

  return (
    <section id="marketplace-catalog" className="catalog-section" aria-labelledby="catalog-title">
      <div className="catalog-section__inner">
        <div className="catalog-toolbar">
          <div className="catalog-categories" aria-label="Browse by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`catalog-chip${activeCategory === category ? ' catalog-chip--active' : ''}`}
                onClick={() => onCategoryChange(category)}
              >
                <CategoryIcon category={category} className="catalog-chip__icon" />
                <span>{category}</span>
              </button>
            ))}
          </div>

          <div className="catalog-controls">
            <label className="catalog-sort">
              <span>Sort by:</span>
              <select value={sortOption} onChange={(event) => onSortChange(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="catalog-filter-button" onClick={onFilterClick}>
              <FilterIcon className="catalog-filter-button__icon" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="catalog-heading">
          <div>
            <h2 id="catalog-title">Shop Buckeye Marketplace</h2>
          </div>
          <p>
            Showing {resultCount} of {totalCount} listings
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {trimmedSearchQuery ? ` matching "${trimmedSearchQuery}"` : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="catalog-empty">
            <p>{trimmedSearchQuery ? 'No products match your search' : 'No products found'}</p>
            <span>Try another category, search term, or reset back to All.</span>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSaveClick={onSaveClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
