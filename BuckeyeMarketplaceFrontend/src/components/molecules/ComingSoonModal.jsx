import { useEffect, useRef } from 'react';

export default function ComingSoonModal({ onClose }) {
  const closeButtonRef = useRef(null);

  // Focus the close button on mount for keyboard accessibility
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Dismiss on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
      padding: '36px 32px 28px',
      maxWidth: '420px',
      width: '90%',
      textAlign: 'center',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 12px 0',
    },
    body: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6',
      margin: '0 0 28px 0',
    },
    closeButton: {
      padding: '10px 28px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#BB0000',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
  };

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <h2 id="coming-soon-title" style={styles.title}>
          Feature Coming Soon
        </h2>
        <p style={styles.body}>
          This feature is currently under development and will be available in a
          future update of Buckeye Marketplace.
        </p>
        <button
          ref={closeButtonRef}
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#9a0000')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#BB0000')
          }
        >
          Close
        </button>
      </div>
    </div>
  );
}
