import { comparePassword, hashPassword } from '@/utils/password';
import { UserService } from './user.service';

export class AuthService {
    private userService = new UserService();

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user || !user.passwordHash) return null;

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) return null;

        // update lastLogin timestamp here
        await this.userService.updateUser(user.id, { lastLogin: new Date() });

        return user;
    }

    /**
     * Change user's password securely
     */
    async changePassword(userId: string, newPassword: string) {
        const passwordHash = await hashPassword(newPassword);
        return this.userService.updateUser(userId, { passwordHash });
    }
}
