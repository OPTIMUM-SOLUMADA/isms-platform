import { comparePassword, hashPassword } from '@/utils/password';
import { UserService } from './user.service';
import { env } from '@/configs/env';

export class AuthService {
    private userService = new UserService();

    login = async (email: string, password: string) => {
        const user = await this.userService.findByEmail(email);
        if(env.NODE_ENV !== 'production') {
            console.log('AuthService.login - user:', user);
        }
        if (!user) return null;

        // En mode développement, permettre l'authentification via email uniquement
        if (env.NODE_ENV === 'development') {
            console.log('AuthService.login - Development mode: authentication via email only');
            // update lastLogin timestamp here
            await this.userService.updateUser(user.id, { lastLogin: new Date() });
            return user;
        }

        // En production, vérifier le mot de passe
        if (!user.passwordHash) return null;

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            return null;
        }

        // update lastLogin timestamp here
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
