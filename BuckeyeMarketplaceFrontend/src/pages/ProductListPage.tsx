import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import ProductGrid from '../components/organisms/ProductGrid';
import CartFeedbackBanner from '../components/molecules/CartFeedbackBanner';
import ComingSoonModal from '../components/molecules/ComingSoonModal';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

const CATEGORIES = [
  'All',
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Home & Living',
  'Sports & Outdoors',
  'Other',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'available', label: 'Available First' },
];

const sortProducts = (products: Product[], sortOption: string): Product[] => {
  const sortedProducts = [...products];

  switch (sortOption) {
    case 'price-low':
      return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-high':
      return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    case 'available':
      return sortedProducts.sort((a, b) => {
        const aAvailable = a.isAvailable && a.stockQuantity > 0 ? 1 : 0;
        const bAvailable = b.isAvailable && b.stockQuantity > 0 ? 1 : 0;
        return bAvailable - aAvailable;
      });
    case 'newest':
    default:
      return sortedProducts.sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
      );
  }
};

const ProductListPage: FC = () => {
  const [searchParams] = useSearchParams();
  const { products, isLoading, error } = useProducts();
  const { addItem, cartError, cartSuccess, clearCartMessages } = useCart();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') ?? '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') ?? '');
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    const categoryProducts =
      activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory);

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredProducts =
      normalizedSearch.length === 0
        ? categoryProducts
        : categoryProducts.filter((product) =>
            [product.title, product.description, product.category, product.brand]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(normalizedSearch)),
          );

    return sortProducts(filteredProducts, sortOption);
  }, [activeCategory, products, searchQuery, sortOption]);

  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      fontSize: '16px',
      color: '#999',
    },
    errorContainer: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#991b1b',
    },
  };

  return (
    <div className="marketplace-page" style={styles.container}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CartFeedbackBanner
        error={cartError}
        success={cartSuccess}
        onDismiss={clearCartMessages}
      />
      <Hero
        onStartShopping={() => {
          document.getElementById('marketplace-catalog')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }}
      />

      {isLoading && (
        <div style={styles.loadingContainer}>
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p>Error loading products: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <ProductGrid
          products={visibleProducts}
          onAddToCart={addItem}
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortOption={sortOption}
          sortOptions={SORT_OPTIONS}
          onSortChange={setSortOption}
          onFilterClick={() => setShowFilterModal(true)}
          onSaveClick={() => setShowFilterModal(true)}
          resultCount={visibleProducts.length}
          totalCount={products.length}
          searchQuery={searchQuery}
        />
      )}

      {showFilterModal && <ComingSoonModal onClose={() => setShowFilterModal(false)} />}
    </div>
  );
};

export default ProductListPage;
