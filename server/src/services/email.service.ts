import { env } from '@/configs/env';
import { PUBLIC_PATH } from '@/configs/public';
import nodemailer, { type SendMailOptions } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: Pick<SendMailOptions, 'attachments'>;
}

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: Number(env.SMTP_PORT),
            secure: env.SMTP_SECURE === 'true',
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });
    }

    async sendMail(options: EmailOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: `"ISMS Solumada" <${env.SMTP_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: [
                    {
                        cid: 'logo',
                        filename: 'solumada.png',
                        path: `${PUBLIC_PATH}/images/solumada-long.png`,
                    },
                    ...((options.attachments?.attachments ?? []) as any[]),
                ],
            });
            console.log('Email sent: %s', info.messageId);
        } catch (err) {
            console.error('Email sending failed', err);
            throw err;
        }
    }
}
