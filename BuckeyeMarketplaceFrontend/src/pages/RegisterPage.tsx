import { CSSProperties, FC, FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/authValidation';

const RegisterPage: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { isAuthenticated, authError, clearAuthError, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      border: '1px solid #ececec',
      padding: '28px',
    },
    title: {
      margin: '0 0 8px',
      fontSize: '28px',
      color: '#111827',
    },
    subtitle: {
      margin: '0 0 24px',
      color: '#4b5563',
      fontSize: '14px',
    },
    form: {
      display: 'grid',
      gap: '14px',
    },
    label: {
      fontSize: '13px',
      color: '#374151',
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '14px',
    },
    submit: {
      marginTop: '6px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#BB0000',
      color: 'white',
      fontSize: '14px',
      fontWeight: '700',
      padding: '11px 14px',
      cursor: 'pointer',
      opacity: isSubmitting ? 0.8 : 1,
    },
    footerText: {
      marginTop: '16px',
      fontSize: '14px',
      color: '#4b5563',
      textAlign: 'center',
    },
    link: {
      color: '#BB0000',
      fontWeight: '700',
      textDecoration: 'none',
    },
    helper: {
      marginTop: '-4px',
      marginBottom: '-2px',
      fontSize: '12px',
      color: '#6b7280',
    },
  };

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (isAuthenticated) {
      const navigationState = location.state as { from?: { pathname?: string } } | null;
      const destination = navigationState?.from?.pathname ?? '/products';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLocalError(null);

    const validationError = validateRegisterForm(email, password, confirmPassword);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(email.trim(), password);
    } catch {
      // Error is exposed via context state for consistent UI messaging.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register to start shopping on Buckeye Marketplace.</p>

        <form style={styles.form} noValidate onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.helper}>Use at least 8 characters and include an uppercase letter and a number.</div>
          </div>

          <div>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={styles.input}
              required
            />
          </div>

          {localError && <div style={styles.error}>{localError}</div>}
          {authError && <div style={styles.error}>{authError}</div>}

          <button type="submit" style={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
