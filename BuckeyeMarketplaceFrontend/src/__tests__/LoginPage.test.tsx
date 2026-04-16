import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';

const clearAuthErrorMock = vi.fn();
const loginUserMock = vi.fn();
let authErrorValue: string | null = null;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    authError: authErrorValue,
    clearAuthError: clearAuthErrorMock,
    loginUser: loginUserMock,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    authErrorValue = null;
    clearAuthErrorMock.mockClear();
    loginUserMock.mockReset();
    loginUserMock.mockResolvedValue(undefined);
  });

  it('shows an error when submitting empty credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
    });
  });

  it('submits trimmed email and password when fields are valid', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: ' user@osu.edu ' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'ValidPass1' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(loginUserMock).toHaveBeenCalledWith('user@osu.edu', 'ValidPass1');
    });
  });

  it('renders auth error from context state', () => {
    authErrorValue = 'Unable to login. Please try again.';

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Unable to login. Please try again.')).toBeInTheDocument();
  });
});
