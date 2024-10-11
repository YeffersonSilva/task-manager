import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';
import { AuthContext } from '../../contex/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const mockAuthContextValue = {
  user: null,
  setUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to /tasks on successful login', async () => {
    mockAuthContextValue.login.mockResolvedValueOnce(undefined);

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(mockAuthContextValue.login).toHaveBeenCalledWith('test@example.com', 'password123'));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/tasks'));
  });

  it('shows an alert with error message on failed login', async () => {
    const errorMessage = 'Login failed';
    mockAuthContextValue.login.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

   
    const alertElement = await screen.findByRole('alert');
    expect(alertElement).toHaveTextContent(errorMessage);

    expect(mockAuthContextValue.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
  });
});
