export default function Button({ children, onClick, type = 'button' }) {
  const styles = {
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#BB0000',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    hover: {
      backgroundColor: '#9a0000',
    },
    active: {
      transform: 'scale(0.98)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={styles.button}
      onMouseEnter={(e) => (e.target.style.backgroundColor = styles.hover.backgroundColor)}
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#BB0000')}
      onMouseDown={(e) => (e.target.style.transform = styles.active.transform)}
      onMouseUp={(e) => (e.target.style.transform = '')}
    >
      {children}
    </button>
  );
}
