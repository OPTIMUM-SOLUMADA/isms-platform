import path from 'path';

export const UPLOAD_URL = '/uploads';
export const UPLOAD_PATH = path.join(process.cwd(), 'uploads');
export const DOCUMENT_UPLOAD_PATH = path.join(UPLOAD_PATH, 'documents');
