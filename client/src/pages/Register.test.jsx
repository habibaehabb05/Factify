import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Register from './Register';
import AuthContext from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate and lucide-react
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('lucide-react', () => ({
    AlertCircle: () => <div data-testid="alert-icon" />,
}));

describe('Register Component', () => {
    const mockRegister = vi.fn();

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={{ register: mockRegister }}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    const fillForm = async (user, password, confirmPassword) => {
        await user.type(screen.getByPlaceholderText(/johndoe/i), 'testuser');
        await user.type(screen.getByPlaceholderText(/john@example.com/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText(/start typing.../i), password);
        await user.type(screen.getByPlaceholderText(/re-enter password/i), confirmPassword);
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders registration form correctly', () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/johndoe/i)).toBeInTheDocument();
    });

    it('validates password length', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'Short1!', 'Short1!');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('validates uppercase requirement', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'password123!', 'password123!');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
        });
    });

    it('validates lowercase requirement', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'PASSWORD123!', 'PASSWORD123!');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
        });
    });

    it('validates number requirement', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'Password!!', 'Password!!');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
        });
    });

    it('validates special character requirement', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'Password123', 'Password123');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument();
        });
    });

    it('validates password match', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'Password123!', 'Password123?');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('calls register function on successful validation', async () => {
        const user = userEvent.setup();
        renderComponent();

        await fillForm(user, 'Password123!', 'Password123!');

        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'Password123!', 'user');
        });
    });
});
