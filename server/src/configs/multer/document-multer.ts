import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { DOCUMENT_UPLOAD_PATH } from '@/configs/upload';

// Multer configuration for document uploads
// Storage path is configured via STORAGE_PATH env variable (see configs/upload.ts)
// For Render: STORAGE_PATH=/var/data (persistent disk)
// For local dev: defaults to ./uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Directory is created at startup by storage.init.ts
        // No need to check/create here for better performance
        cb(null, DOCUMENT_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const [name] = file.originalname.split('.');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${name}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = [
        'application/pdf',

        // Word
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.oasis.opendocument.text', // .odt

        // Excel
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF or DOC or XLSX allowed'));
    }
};

export const uploadDocument = multer({
    storage,
    fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 },
});
