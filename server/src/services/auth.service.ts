import { comparePassword, hashPassword } from '@/utils/password';
import { UserService } from './user.service';

export class AuthService {
    private userService = new UserService();

    login = async (email: string, password: string) => {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        // En dev, autoriser la connexion sans mot de passe si le compte n'en a pas encore
        if (!user.passwordHash) {
            if (process.env.NODE_ENV === 'development') {
                await this.userService.updateUser(user.id, { lastLogin: new Date() });
                return user;
            }
            return null;
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) return null;

        await this.userService.updateUser(user.id, { lastLogin: new Date() });
        return user;
    };

    /**
     * Change user's password securely
     */
    changePassword = async (userId: string, newPassword: string) => {
        const passwordHash = await hashPassword(newPassword);
        return this.userService.updateUser(userId, { passwordHash });
    };
}
