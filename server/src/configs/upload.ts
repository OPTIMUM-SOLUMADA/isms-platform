import path from 'path';
import { env } from './env';

// URL endpoint for serving uploaded files
export const UPLOAD_URL = '/uploads';

// Physical storage path - configurable for Render persistent disk
// Render: Set STORAGE_PATH=/var/data in environment variables
// Local: Defaults to ./uploads in project root
export const UPLOAD_PATH = env.STORAGE_PATH 
    ? path.resolve(env.STORAGE_PATH, 'uploads')
    : path.join(process.cwd(), 'uploads');

// Document-specific upload directory
export const DOCUMENT_UPLOAD_PATH = path.join(UPLOAD_PATH, 'documents');
