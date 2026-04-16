import { describe, expect, it } from 'vitest';
import { validateLoginForm, validateRegisterForm } from '../utils/authValidation';

describe('authValidation helpers', () => {
  it('returns login error when email or password is empty', () => {
    const result = validateLoginForm('', '');

    expect(result).toBe('Email and password are required.');
  });

  it('returns register error for mismatched passwords', () => {
    const result = validateRegisterForm('user@osu.edu', 'ValidPass1', 'Mismatch1');

    expect(result).toBe('Passwords do not match.');
  });
});
