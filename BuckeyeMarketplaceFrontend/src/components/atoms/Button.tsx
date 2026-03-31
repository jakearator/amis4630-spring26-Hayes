import { FC, ReactNode, CSSProperties } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {
  const styles: Record<string, CSSProperties> = {
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: disabled ? '#c9c9c9' : '#BB0000',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      opacity: disabled ? 0.85 : 1,
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
      disabled={disabled}
      style={styles.button}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = styles.hover.backgroundColor as string;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = disabled ? '#c9c9c9' : '#BB0000';
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = styles.active.transform as string;
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = '';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
