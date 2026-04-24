import { FC, useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ComingSoonModal from '../molecules/ComingSoonModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const styles: Record<string, CSSProperties> = {
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e5e5',
      padding: '16px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#BB0000',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: 'inherit',
    },
    searchContainer: {
      flex: 1,
      maxWidth: '500px',
    },
    searchInput: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      fontFamily: 'inherit',
    },
    searchInputFocus: {
      borderColor: '#BB0000',
      boxShadow: '0 0 0 3px rgba(187, 0, 0, 0.1)',
      outline: 'none',
    },
    icons: {
      display: 'flex',
      gap: '16px',
      minWidth: 'fit-content',
      alignItems: 'center',
    },
    iconButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
      transition: 'color 0.2s',
      padding: '8px',
      textDecoration: 'none',
      position: 'relative',
    },
    iconButtonHover: {
      color: '#BB0000',
    },
    authLink: {
      color: '#444',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '600',
    },
    authLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#444',
      fontSize: '14px',
      fontWeight: '600',
    },
    logoutButton: {
      border: 'none',
      background: '#BB0000',
      color: 'white',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '700',
      padding: '7px 10px',
      cursor: 'pointer',
    },
    cartCountBadge: {
      position: 'absolute',
      top: '-2px',
      right: '-4px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '999px',
      backgroundColor: '#BB0000',
      color: 'white',
      fontSize: '11px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5px',
      lineHeight: 1,
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/products" style={styles.logo} aria-label="Buckeye Marketplace home">
          Buckeye Marketplace
        </Link>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            value=""
            readOnly
            onClick={() => setShowModal(true)}
            style={{ ...styles.searchInput, cursor: 'pointer' }}
          />
        </div>

        <div style={styles.icons}>
          <Link
            to="/cart"
            style={styles.iconButton}
            onMouseEnter={(e) => (e.currentTarget.style.color = styles.iconButtonHover.color as string)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            🛒
            {itemCount > 0 && <span style={styles.cartCountBadge}>{itemCount}</span>}
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              style={styles.iconButton}
              onMouseEnter={(e) => (e.currentTarget.style.color = styles.iconButtonHover.color as string)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
              title="Order History"
              aria-label="Order History"
            >
              📦
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              style={styles.iconButton}
              onMouseEnter={(e) => (e.currentTarget.style.color = styles.iconButtonHover.color as string)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              🛠
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <button
                style={styles.iconButton}
                onClick={() => setShowModal(true)}
                onMouseEnter={(e) => (e.currentTarget.style.color = styles.iconButtonHover.color as string)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
                title="User Account"
                aria-label="User Account"
              >
                👤
              </button>
              <button type="button" style={styles.logoutButton} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div style={styles.authLinks} aria-label="Login or create account">
              <Link to="/login" style={styles.authLink}>Login</Link>
              <span>/</span>
              <Link to="/register" style={styles.authLink}>Create Account</Link>
            </div>
          )}
        </div>
      </div>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;
