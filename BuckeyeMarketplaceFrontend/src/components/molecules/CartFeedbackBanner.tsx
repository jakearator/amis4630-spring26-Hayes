import { CSSProperties, FC } from 'react';

interface CartFeedbackBannerProps {
  error: string | null;
  success: string | null;
  onDismiss: () => void;
}

const CartFeedbackBanner: FC<CartFeedbackBannerProps> = ({ error, success, onDismiss }) => {
  if (!error && !success) {
    return null;
  }

  const isError = Boolean(error);

  const styles: Record<string, CSSProperties> = {
    wrapper: {
      maxWidth: '1200px',
      margin: '16px auto 0',
      padding: '0 20px',
    },
    banner: {
      borderRadius: '10px',
      border: isError ? '1px solid #fecaca' : '1px solid #bbf7d0',
      backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
      color: isError ? '#991b1b' : '#166534',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      fontSize: '14px',
      fontWeight: 500,
    },
    dismiss: {
      border: 'none',
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 700,
      padding: 0,
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.wrapper} role="status" aria-live="polite">
      <div style={styles.banner}>
        <span>{error ?? success}</span>
        <button style={styles.dismiss} onClick={onDismiss} aria-label="Dismiss message">
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default CartFeedbackBanner;
