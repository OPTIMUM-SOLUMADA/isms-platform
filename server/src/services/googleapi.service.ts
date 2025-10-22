import fs from 'fs';
import { Readable } from 'stream';
import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
import type { JWT } from 'google-auth-library';

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

export interface ServiceAccountOptions {
    keyFile: string; // Path to your service account JSON file
    scopes?: string[];
}

/**
 * Google Drive Service using a Service Account JSON (server-side only)
 */
export class GoogleDriveService {
    private drive!: drive_v3.Drive;
    private readonly scopes: string[];

    constructor(private readonly opts: ServiceAccountOptions) {
        this.scopes = opts.scopes ?? ['https://www.googleapis.com/auth/drive'];
    }

    /**
     * Initialize the service account auth and create Drive client.
     */
    async initialize(): Promise<void> {
        if (!this.opts.keyFile) {
            throw new Error('A path to the service account JSON file is required.');
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: this.opts.keyFile,
            scopes: this.scopes,
        });

        const client = (await auth.getClient()) as JWT;
        this.drive = google.drive({ version: 'v3', auth: client });
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
        if (!this.drive) throw new Error('Service not initialized.');

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
            supportsAllDrives: true,
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
        if (!this.drive) throw new Error('Service not initialized.');

        const res = await this.drive.files.get({
            fileId,
            fields: 'id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink, webContentLink',
        });

        return res.data as DriveFileMetadata;
    }

    async downloadFileAsBuffer(fileId: string): Promise<Buffer> {
        if (!this.drive) throw new Error('Service not initialized.');

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
        if (!this.drive) throw new Error('Service not initialized.');
        return this.drive.permissions.create({ fileId, requestBody: permission });
    }

    async makeFilePublicReadable(fileId: string) {
        await this.createPermission(fileId, { role: 'reader', type: 'anyone' });
    }

    // ---------------------------
    // Folder helpers
    // ---------------------------

    async createFolder(name: string, parents?: string[]) {
        if (!this.drive) throw new Error('Service not initialized.');
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
        if (!this.drive) throw new Error('Service not initialized.');
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
