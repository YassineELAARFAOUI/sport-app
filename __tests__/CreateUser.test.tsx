import { createUser } from '../src/actions/index'; // Adapter le chemin d'importation
import { db } from '../src/db/index';
import { redirect } from 'next/navigation';

// Mock de la base de données
jest.mock('../src/db/index', () => ({
    db: {
        user: {
            create: jest.fn(),
        },
    },
}));

// Mock de la redirection
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('User Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createUser should create a new user and redirect', async () => {
        const formData = new FormData();
        formData.append('name', 'John Doe');
        formData.append('email', 'john.doe@example.com');
        formData.append('password', 'password123');
        formData.append('role', 'AUTHOR');

        await createUser(formData);

        expect(db.user.create).toHaveBeenCalledWith({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'AUTHOR',
            },
        });
        expect(redirect).toHaveBeenCalledWith('/login');
    });
});
