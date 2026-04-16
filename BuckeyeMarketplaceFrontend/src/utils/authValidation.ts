export const validateLoginForm = (email: string, password: string): string | null => {
  if (!email.trim() || !password.trim()) {
    return 'Email and password are required.';
  }

  return null;
};

export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
): string | null => {
  if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
    return 'All fields are required.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return null;
};
