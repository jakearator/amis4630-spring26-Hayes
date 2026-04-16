export const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const hasAdminRole = (token: string): boolean => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    return false;
  }

  const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const rolesClaim = payload.roles;
  const simpleRoleClaim = payload.role;

  const values: string[] = [];

  const collectValues = (input: unknown): void => {
    if (typeof input === 'string') {
      values.push(input);
      return;
    }

    if (Array.isArray(input)) {
      input.forEach((entry) => {
        if (typeof entry === 'string') {
          values.push(entry);
        }
      });
    }
  };

  collectValues(roleClaim);
  collectValues(rolesClaim);
  collectValues(simpleRoleClaim);

  return values.some((role) => role.toLowerCase() === 'admin');
};
