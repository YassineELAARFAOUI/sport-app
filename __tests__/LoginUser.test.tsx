import { loginUser } from '../src/actions/index'; // Adapter le chemin d'importation
import { db } from '../src/db/index';
import { redirect } from 'next/navigation';

// Mock de la base de données
jest.mock('../src/db/index', () => ({
    db: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

// Mock de la redirection
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('Login Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loginUser should redirect if user not found', async () => {
        const formData = new FormData();
        formData.append('email', 'nonexistent@example.com');
        formData.append('password', 'password123');

        (db.user.findUnique as jest.Mock).mockResolvedValue(null); // Simuler un utilisateur introuvable

        await loginUser(formData);

        expect(redirect).toHaveBeenCalledWith('/login');
    });

    test('loginUser should redirect if password is incorrect', async () => {
        const formData = new FormData();
        formData.append('email', 'john.doe@example.com');
        formData.append('password', 'wrongpassword');

        (db.user.findUnique as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
            password: 'password123', // Mot de passe correct en base
        });

        await loginUser(formData);

        expect(redirect).toHaveBeenCalledWith('/login');
    });

    test('loginUser should redirect to home if login is successful', async () => {
        const formData = new FormData();
        formData.append('email', 'john.doe@example.com');
        formData.append('password', 'password123');

        (db.user.findUnique as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
            password: 'password123', // Mot de passe correct en base
        });

        await loginUser(formData);

        expect(redirect).toHaveBeenCalledWith('/');
    });
});
