import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { login, register } from '../services/api';
import { clearAuthTokens, getAccessToken, setAuthTokens } from '../services/authStorage';
import { hasAdminRole } from './authClaims';

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingAuth: boolean;
  authError: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(Boolean(token));
    setIsAdmin(token ? hasAdminRole(token) : false);
    setIsLoadingAuth(false);
  }, []);

  const clearAuthError = useCallback((): void => {
    setAuthError(null);
  }, []);

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return fallback;
  };

  const saveSession = useCallback((token: string, refreshToken: string): void => {
    setAuthTokens(token, refreshToken);
    setIsAuthenticated(true);
    setIsAdmin(hasAdminRole(token));
    setAuthError(null);
  }, []);

  const loginUser = useCallback(async (email: string, password: string): Promise<void> => {
    setAuthError(null);

    try {
      const response = await login({ email: email.trim(), password });
      saveSession(response.token, response.refreshToken);
    } catch (error) {
      setAuthError(getErrorMessage(error, 'Unable to login. Please try again.'));
      throw error;
    }
  }, [saveSession]);

  const registerUser = useCallback(async (email: string, password: string): Promise<void> => {
    setAuthError(null);

    try {
      const response = await register({ email: email.trim(), password });
      saveSession(response.token, response.refreshToken);
    } catch (error) {
      setAuthError(getErrorMessage(error, 'Unable to register. Please try again.'));
      throw error;
    }
  }, [saveSession]);

  const logout = useCallback((): void => {
    clearAuthTokens();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAuthError(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = (): void => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated,
      isAdmin,
      isLoadingAuth,
      authError,
      loginUser,
      registerUser,
      logout,
      clearAuthError,
    };
  }, [authError, clearAuthError, isAdmin, isAuthenticated, isLoadingAuth, loginUser, logout, registerUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
