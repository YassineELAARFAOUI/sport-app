import { loginUser } from '../src/actions/index';
import { db } from '../src/db/index';
import { cookies } from "next/headers";

// Mock de la base de données
jest.mock('../src/db/index', () => ({
    db: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

// Création d'un mock global pour `cookies()`
const mockSet = jest.fn();
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        set: mockSet, // Associer `set` à un mock global
    })),
}));

describe('Login Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loginUser should return an error if user is not found', async () => {
        const formData = new FormData();
        formData.append('email', 'elaarfaoui.yassine@gmail.com');
        formData.append('password', 'password123');

        (db.user.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await loginUser(formData);

        expect(response).toEqual({ success: false, error: "User not found" });
    });

    test('loginUser should return an error if password is incorrect', async () => {
        const formData = new FormData();
        formData.append('email', 'elaarfaoui.yassine@gmail.com');
        formData.append('password', 'wrongpassword');

        (db.user.findUnique as jest.Mock).mockResolvedValue({
            id: '1',
            name: 'Yassine ELAARFAOUI',
            email: 'elaarfaoui.yassine@gmail.com',
            password: 'password123',
            role: 'AUTHOR',
        });

        const response = await loginUser(formData);

        expect(response).toEqual({ success: false, error: "Invalid password" });
    });

    test('loginUser should set cookie and return success if login is successful', async () => {
        const formData = new FormData();
        formData.append('email', 'elaarfaoui.yassine@gmail.com');
        formData.append('password', 'password123');

        const mockUser = {
            id: '1',
            name: 'Yassine ELAARFAOUI',
            email: 'john.doe@example.com',
            password: 'password123',
            role: 'AUTHOR',
        };

        (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const response = await loginUser(formData);

        expect(response).toEqual({ success: true });

        // Vérification que le cookie est bien défini
        expect(mockSet).toHaveBeenCalledWith('user', JSON.stringify({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role
        }), {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
        });
    });
});
