const ACCESS_TOKEN_KEY = 'buckeye_access_token';
const REFRESH_TOKEN_KEY = 'buckeye_refresh_token';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const getStorage = (): StorageLike | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getAccessToken = (): string | null => {
  const storage = getStorage();
  return storage ? storage.getItem(ACCESS_TOKEN_KEY) : null;
};

export const getRefreshToken = (): string | null => {
  const storage = getStorage();
  return storage ? storage.getItem(REFRESH_TOKEN_KEY) : null;
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = (): void => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
};
