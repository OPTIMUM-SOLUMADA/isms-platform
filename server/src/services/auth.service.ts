import { comparePassword, hashPassword } from '@/utils/password';
import { UserService } from './user.service';

/**
 * Service for authentication
 * Uses PostgreSQL via UserService for user data
 */
export class AuthService {
    private userService = new UserService();

    login = async (email: string, password: string) => {
        const user = await this.userService.findByEmail(email);
        if (!user || !user.password_hash) return null;

        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) return null;

        // update last_login timestamp here
        await this.userService.updateUser(user.id_user, { last_login: new Date() });

        return user;
    };

    /**
     * Change user's password securely
     */
    changePassword = async (userId: string, newPassword: string) => {
        const password_hash = await hashPassword(newPassword);
        return this.userService.updateUser(userId, { password_hash });
    };
}
