import { FC, ReactNode, CSSProperties } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: FC<ButtonProps> = ({ children, onClick, type = 'button' }) => {
  const styles: Record<string, CSSProperties> = {
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
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.hover.backgroundColor as string)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#BB0000')}
      onMouseDown={(e) => (e.currentTarget.style.transform = styles.active.transform as string)}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  );
};

export default Button;
