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
        formData.append('name', 'Yassine ELAARFAOUI');
        formData.append('email', 'elaarfaoui.yassine@example.com');
        formData.append('password', 'password123');
        formData.append('role', 'AUTHOR');

        // Espionner console.log pour éviter les logs dans le test
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        await createUser(formData);

        expect(db.user.create).toHaveBeenCalledWith({
            data: {
                name: 'Yassine ELAARFAOUI',
                email: 'elaarfaoui.yassine@example.com',
                password: 'password123',
                role: 'AUTHOR',
            },
        });
        expect(redirect).toHaveBeenCalledWith('/login');

        // Restaurer le comportement de console.log
        consoleSpy.mockRestore();
    });
});
