import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ComingSoonModal from '../molecules/ComingSoonModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface IconProps {
  className?: string;
}

const SearchIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="m21 21-4.35-4.35" />
    <circle cx="11" cy="11" r="7" />
  </svg>
);

const CartIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6.5 6.5h14l-1.6 7.25a2 2 0 0 1-1.95 1.57H9.1a2 2 0 0 1-1.95-1.56L5.3 4.4H2.75" />
    <circle cx="9.25" cy="20" r="1.35" />
    <circle cx="17.35" cy="20" r="1.35" />
  </svg>
);

const UserIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="8" r="4" />
    <path d="M4.75 21a7.25 7.25 0 0 1 14.5 0" />
  </svg>
);

const OrdersIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4.5 7.5 12 3l7.5 4.5v9L12 21l-7.5-4.5z" />
    <path d="M4.75 7.75 12 12l7.25-4.25" />
    <path d="M12 12v8.5" />
  </svg>
);

const AdminIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3.75 20 7v5.25c0 4.45-3.25 7.1-8 8-4.75-.9-8-3.55-8-8V7z" />
    <path d="M9 12.25 11.1 14.4 15.35 10" />
  </svg>
);

const Header: FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const currentSearchValue = onSearchChange ? searchQuery ?? '' : localSearchQuery;

  const handleSearchChange = (value: string): void => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearchQuery(value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!onSearchChange) {
      const query = currentSearchValue.trim();
      navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__container">
        <Link to="/products" className="site-header__brand" aria-label="Buckeye Marketplace home">
          <span className="site-header__brand-text">
            <span>Buckeye</span>
            <span>Marketplace</span>
          </span>
        </Link>

        <form className="site-header__search" role="search" onSubmit={handleSearchSubmit}>
          <SearchIcon className="site-header__search-icon" />
          <input
            type="text"
            placeholder="Search textbooks, electronics, furniture..."
            value={currentSearchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="site-header__search-input"
            aria-label="Search products"
          />
        </form>

        <div className="site-header__actions">
          <Link
            to="/cart"
            className="site-header__icon-link site-header__cart-link"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <CartIcon className="site-header__icon" />
            <span className="site-header__action-label">Cart</span>
            {itemCount > 0 && <span className="site-header__cart-count">{itemCount}</span>}
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="site-header__icon-link"
              title="Order History"
              aria-label="Order History"
            >
              <OrdersIcon className="site-header__icon" />
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="site-header__icon-link"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <AdminIcon className="site-header__icon" />
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="site-header__icon-button"
                onClick={() => setShowModal(true)}
                title="User Account"
                aria-label="User Account"
              >
                <UserIcon className="site-header__icon" />
              </button>
              <button type="button" className="site-header__logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className="site-header__auth" aria-label="Login or create account">
              <UserIcon className="site-header__auth-icon" />
              <div className="site-header__auth-links">
                <Link to="/login">Login</Link>
                <span>/</span>
                <Link to="/register">Create Account</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;
