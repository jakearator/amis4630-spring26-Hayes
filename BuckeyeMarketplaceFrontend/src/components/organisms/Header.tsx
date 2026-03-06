import { FC, useState, CSSProperties } from 'react';
import ComingSoonModal from '../molecules/ComingSoonModal';

const Header: FC = () => {
  const [showModal, setShowModal] = useState(false);

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
    },
    iconButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
      transition: 'color 0.2s',
      padding: '8px',
    },
    iconButtonHover: {
      color: '#BB0000',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <button
          style={styles.logo}
          onClick={() => setShowModal(true)}
          aria-label="Buckeye Marketplace home"
        >
          Buckeye Marketplace
        </button>
        
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
          <button
            style={styles.iconButton}
            onClick={() => setShowModal(true)}
            onMouseEnter={(e) => (e.currentTarget.style.color = styles.iconButtonHover.color as string)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            🛒
          </button>
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
        </div>
      </div>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;
