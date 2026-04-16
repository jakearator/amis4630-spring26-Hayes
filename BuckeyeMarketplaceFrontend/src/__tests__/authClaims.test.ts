import { describe, expect, it } from 'vitest';
import { hasAdminRole, parseJwtPayload } from '../context/authClaims';

const createToken = (payload: Record<string, unknown>): string => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${encodedPayload}.signature`;
};

describe('authClaims helpers', () => {
  it('parses a valid JWT payload', () => {
    const token = createToken({ role: 'Admin' });

    const payload = parseJwtPayload(token);

    expect(payload).not.toBeNull();
    expect(payload?.role).toBe('Admin');
  });

  it('detects admin role from role claim', () => {
    const token = createToken({ role: 'Admin' });

    expect(hasAdminRole(token)).toBe(true);
  });
});
