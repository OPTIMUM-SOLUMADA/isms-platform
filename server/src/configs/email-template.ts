import { renderTemplate } from '@/utils/email-template';
import { Document, User } from '@prisma/client';

type HeaderData = {
    orgName: string;
    headerDescription: string;
};

type FooterData = {
    year: string;
};

type CommonData = HeaderData & FooterData;

export const EmailTemplate = {
    test: (data: { username: string }) => renderTemplate('fr', 'isms_test_email', data),

    resetPassword: (
        data: {
            user: Pick<User, 'name'>;
            resetLink: string;
        } & CommonData,
    ) => renderTemplate('en', 'isms_reset_password', data),

    welcome: (
        data: {
            userName: string;
            orgName: string;
            inviteLink: string;
        } & CommonData,
    ) => renderTemplate('en', 'isms_invitation', data),

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
