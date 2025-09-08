import { renderTemplate } from '@/utils/email-template';
import { Document, User } from '@prisma/client';

type CommonData = {
    orgName: string;
    year: string;
};

export const EmailTemplate = {
    test: (data: { username: string }) => renderTemplate('fr', 'isms_test_email', data),

    resetPassword: (
        data: {
            user: Pick<User, 'name'>;
            resetLink: string;
        } & CommonData,
    ) => renderTemplate('en', 'isms_reset_password', data),

    // Review email template
    review: (
        data: {
            reviewer: Pick<User, 'name'>;
            document: Pick<Document, 'title' | 'status' | 'description'>;
            owner: Pick<User, 'name' | 'email'>;
            dueDate: string;
            reviewLink: string;
            viewDocLink: string;
        } & CommonData,
    ) => renderTemplate('en', 'isms_reviewer_reminder', data),
};
