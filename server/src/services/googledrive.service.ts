import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { GoogleAuthConfig } from '@/configs/google.config';
import fs from 'fs';

export interface IGoogleDriveService {
    listFiles(): Promise<drive_v3.Schema$FileList>;
    uploadFile(name: string, mimeType: string, data: Buffer): Promise<drive_v3.Schema$File>;
}

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

type Role = 'owner' | 'writer' | 'commenter' | 'reader';

export class GoogleDriveService implements IGoogleDriveService {
    private drive: drive_v3.Drive;
    private workingFolderId: string;

    constructor(tokens: any, workingFolderId?: string) {
        const auth = GoogleAuthConfig.getInstance().getClient();
        auth.setCredentials(tokens);
        this.drive = google.drive({ version: 'v3', auth });
        this.workingFolderId = workingFolderId || '';
    }

    getWorkingDirId() {
        return this.workingFolderId;
    }

    async listFiles() {
        const res = await this.drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, mimeType, parents)',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            corpora: 'user',
            q: 'trashed = false',
        });
        return res.data;
    }

    async getFileById(fileId: string) {
        const res = await this.drive.files.get({
            fileId,
            fields: 'id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink, webContentLink',
        });
        return res.data;
    }

    async getStreamFileById(fileId: string) {
        const res = await this.drive.files.get(
            {
                fileId,
                alt: 'media',
            },
            { responseType: 'stream' },
        );
        return res.data;
    }

    async uploadFile(name: string, mimeType: string, data: Buffer) {
        const fileMetadata = { name };
        const media = {
            mimeType,
            body: Readable.from(data),
        };

        const res = await this.drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id, name',
        });

        return res.data;
    }

    async duplicateFile(fileId: string, data: { name: string; parentId: string }) {
        const res = await this.drive.files.copy({
            fileId,
            requestBody: {
                name: data.name,
                parents: [data.parentId],
            },
            fields: 'id, name, webViewLink, webContentLink',
        });
        return res.data;
    }

    async updateFileName(fileId: string, name: string) {
        const res = await this.drive.files.update({
            fileId,
            requestBody: { name },
            fields: 'id, name, webViewLink, webContentLink',
        });
        return res.data;
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
    // Delete file
    // ---------------------------
    async deleteFile(fileId: string) {
        try {
            if (!this.drive) throw new Error('Service not initialized.');
            await this.drive.files.delete({ fileId });
            return true;
        } catch {
            return false;
        }
    }

    async deleteFiles(fileIds: string[]) {
        for (const fileId of fileIds) await this.deleteFile(fileId);
        return true;
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
            role: Role;
            type: 'user' | 'group' | 'domain' | 'anyone';
            emailAddress?: string;
        },
    ) {
        if (!this.drive) throw new Error('Service not initialized.');
        return this.drive.permissions.create({
            fileId,
            requestBody: permission,
            sendNotificationEmail: false,
        });
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

    async updateFolderName(folderId: string, name: string) {
        if (!this.drive) throw new Error('Service not initialized.');
        const res = await this.drive.files.update({
            fileId: folderId,
            requestBody: { name },
            fields: 'id, name',
        });
        return res.data;
    }

    async deleteFolder(folderId: string) {
        if (!this.drive) throw new Error('Service not initialized.');
        await this.drive.files.delete({ fileId: folderId });
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

    async grantPermissions(documentId: string, emails: string[], role: Role) {
        if (!this.drive) throw new Error('Service not initialized.');
        for (const email of emails) {
            await this.createPermission(documentId, {
                role: role,
                type: 'user',
                emailAddress: email,
            });
        }
    }

    async removePermissions(documentId: string, emails: string[]) {
        if (!this.drive) throw new Error('Service not initialized.');
        for (const email of emails) {
            await this.drive.permissions.delete({
                fileId: documentId,
                permissionId: email,
            });
        }
    }

    // Find folder
    async findFolderById(folderId: string) {
        if (!this.drive) throw new Error('Service not initialized.');
        const res = await this.drive.files.get({
            fileId: folderId,
            fields: 'id, name, mimeType, webViewLink, webContentLink',
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
