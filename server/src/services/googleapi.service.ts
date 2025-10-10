import fs from 'fs';
import { Readable } from 'stream';
import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

export type UploadResult = {
    id: string;
    name?: string;
    mimeType?: string;
    webViewLink?: string;
    webContentLink?: string;
};

export type DriveFileMetadata = {
    id: string;
    name: string;
    mimeType: string;
    parents?: string[];
    createdTime?: string;
    modifiedTime?: string;
    size?: string;
    webViewLink?: string;
    webContentLink?: string;
};

export interface GDriveOptions {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    token?: any; // OAuth2 token object { access_token, refresh_token, scope, token_type, expiry_date }
    scopes?: string[];
}

/**
 * GoogleDriveService using OAuth2
 */
export class GoogleDriveService {
    private authClient?: OAuth2Client;
    private drive: ReturnType<typeof google.drive>;
    private readonly scopes: string[];

    constructor(private readonly opts: GDriveOptions = {}) {
        this.scopes = opts.scopes ?? ['https://www.googleapis.com/auth/drive'];
        this.drive = google.drive({ version: 'v3' }); // placeholder
    }

    /**
     * Initialize OAuth2 client. Call before other methods.
     */
    async initialize(): Promise<void> {
        const { clientId, clientSecret, redirectUri, token } = this.opts;

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error(
                'OAuth2 credentials (clientId, clientSecret, redirectUri) are required.',
            );
        }

        this.authClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        if (token) {
            this.authClient.setCredentials(token);
        }

        this.drive = google.drive({ version: 'v3', auth: this.authClient });
    }

    /**
     * Generate an OAuth2 URL for user consent.
     */
    generateAuthUrl(): string {
        if (!this.authClient) throw new Error('Service not initialized.');
        return this.authClient.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
            prompt: 'consent',
        });
    }

    /**
     * Exchange authorization code for token
     */
    async getTokenFromCode(code: string) {
        if (!this.authClient) throw new Error('Service not initialized.');
        const { tokens } = await this.authClient.getToken(code);
        this.authClient.setCredentials(tokens);
        return tokens;
    }

    // ---------------------------
    // Upload helpers
    // ---------------------------

    async uploadFileFromPath(
        filePath: string,
        options?: { name?: string; parents?: string[]; mimeType?: string },
    ): Promise<UploadResult> {
        const stream = fs.createReadStream(filePath);
        return this.uploadFileFromStream(stream, options);
    }

    async uploadFileFromStream(
        stream: Readable,
        options?: { name?: string; parents?: string[]; mimeType?: string },
    ): Promise<UploadResult> {
        if (!this.authClient) throw new Error('Service not initialized.');

        const res = await this.drive.files.create({
            requestBody: {
                name: options?.name || 'Untitled',
                parents: options?.parents ?? null,
            },
            media: {
                mimeType: options?.mimeType || 'application/octet-stream',
                body: stream,
            },
            fields: 'id, name, mimeType, webViewLink, webContentLink',
        });

        return {
            id: res.data.id!,
            name: res.data.name!,
            mimeType: res.data.mimeType!,
            webViewLink: res.data.webViewLink!,
            webContentLink: res.data.webContentLink!,
        };
    }

    async uploadFileFromBuffer(
        buffer: Buffer,
        options: { name: string; parents?: string[]; mimeType?: string },
    ): Promise<UploadResult> {
        const stream = Readable.from(buffer);
        return this.uploadFileFromStream(stream, options);
    }

    // ---------------------------
    // Metadata / download
    // ---------------------------

    async getFileMetadata(fileId: string): Promise<DriveFileMetadata> {
        if (!this.authClient) throw new Error('Service not initialized.');

        const res = await this.drive.files.get({
            fileId,
            fields: 'id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink, webContentLink',
        });

        return res.data as DriveFileMetadata;
    }

    async downloadFileAsBuffer(fileId: string): Promise<Buffer> {
        if (!this.authClient) throw new Error('Service not initialized.');

        const res = await this.drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' },
        );
        return Buffer.from(res.data as ArrayBuffer);
    }

    // ---------------------------
    // Permissions
    // ---------------------------

    async createPermission(
        fileId: string,
        permission: {
            role: 'owner' | 'writer' | 'commenter' | 'reader';
            type: 'user' | 'group' | 'domain' | 'anyone';
            emailAddress?: string;
        },
    ) {
        if (!this.authClient) throw new Error('Service not initialized.');
        return this.drive.permissions.create({ fileId, requestBody: permission });
    }

    async makeFilePublicReadable(fileId: string) {
        await this.createPermission(fileId, { role: 'reader', type: 'anyone' });
    }

    // ---------------------------
    // Folder helpers
    // ---------------------------

    async createFolder(name: string, parents?: string[]) {
        if (!this.authClient) throw new Error('Service not initialized.');
        const res = await this.drive.files.create({
            requestBody: {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parents || null,
            },
            fields: 'id, name',
        });
        return { id: res.data.id!, name: res.data.name };
    }

    async moveFile(fileId: string, fromParents: string[], toParents: string[]) {
        if (!this.authClient) throw new Error('Service not initialized.');
        const addParents = toParents.join(',');
        const removeParents = fromParents.join(',');
        const res = await this.drive.files.update({
            fileId,
            addParents,
            removeParents,
            fields: 'id, parents',
        });
        return res.data;
    }

    getWebViewLink(fileId: string) {
        return `https://drive.google.com/file/d/${fileId}/view`;
    }

    getWebContentLink(fileId: string) {
        return `https://drive.google.com/uc?id=${fileId}&export=download`;
    }
}
