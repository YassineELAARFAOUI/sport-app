import { updateUser } from '../src/actions/index';
import { db } from '../src/db/index';

// Mock de la base de données
jest.mock('../src/db/index', () => ({
    db: {
        user: {
            update: jest.fn(),
        },
    },
}));

describe('updateUser Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should update user information without changing password', async () => {
        const formData = new FormData();
        formData.append('name', 'Updated Name');
        formData.append('email', 'updated.email@example.com');

        const id = '1'; // Utilisateur à mettre à jour

        await updateUser(id, formData);

        // Vérifie que la fonction `update` a été appelée avec les bons paramètres
        expect(db.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                name: 'Updated Name',
                email: 'updated.email@example.com',
            },
        });
    });

    test('should update user information and password', async () => {
        const formData = new FormData();
        formData.append('name', 'Updated Name');
        formData.append('email', 'updated.email@example.com');
        formData.append('password', 'newpassword123');

        const id = '1'; // Utilisateur à mettre à jour

        await updateUser(id, formData);

        // Vérifie que la fonction `update` a bien été appelée avec le mot de passe
        expect(db.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                name: 'Updated Name',
                email: 'updated.email@example.com',
                password: 'newpassword123',
            },
        });
    });
});
