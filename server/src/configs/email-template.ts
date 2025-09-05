import { renderTemplate } from '@/utils/email-template';

export const EmailTemplate = {
    test: (data: { username: string }) => renderTemplate('fr', 'isms_test_email', data),

    resetPassword: (data: { userName: string; resetLink: string; orgName: string; year: string }) =>
        renderTemplate('en', 'isms_reset_password', data),

    // Review email template
    review: (data: { username: string; reviewLink: string }) =>
        renderTemplate('en', 'isms_reviewer_reminder', data),
};
