import fs from 'fs';
import { UPLOAD_PATH, DOCUMENT_UPLOAD_PATH } from '@/configs/upload';
import { PUBLIC_PATH } from '@/configs/public';
import { env } from '@/configs/env';

/**
 * Initialize storage directories for file uploads
 * 
 * For Render deployment with persistent disk:
 * - Set STORAGE_PATH=/var/data in environment variables
 * - Mount persistent disk at /var/data in Render dashboard
 * - This ensures files survive container restarts
 * 
 * For local development:
 * - STORAGE_PATH is not set, defaults to ./uploads in project root
 * 
 * This function creates all necessary directories at startup
 */
export const initializeStorageDirectories = () => {
    console.log('[storage-init] Initializing storage directories...');
    
    // Log the storage configuration
    if (env.STORAGE_PATH) {
        console.log(`[storage-init] Using persistent storage at: ${env.STORAGE_PATH}`);
        console.log(`[storage-init] Upload path: ${UPLOAD_PATH}`);
    } else {
        console.log(`[storage-init] Using local storage (development mode)`);
        console.log(`[storage-init] Upload path: ${UPLOAD_PATH}`);
    }
    
    try {
        // Create main uploads directory
        if (!fs.existsSync(UPLOAD_PATH)) {
            fs.mkdirSync(UPLOAD_PATH, { recursive: true });
            console.log(`[storage-init] ✓ Created uploads directory: ${UPLOAD_PATH}`);
        } else {
            console.log(`[storage-init] ✓ Uploads directory exists: ${UPLOAD_PATH}`);
        }
        
        // Create documents subdirectory
        if (!fs.existsSync(DOCUMENT_UPLOAD_PATH)) {
            fs.mkdirSync(DOCUMENT_UPLOAD_PATH, { recursive: true });
            console.log(`[storage-init] ✓ Created documents directory: ${DOCUMENT_UPLOAD_PATH}`);
        } else {
            console.log(`[storage-init] ✓ Documents directory exists: ${DOCUMENT_UPLOAD_PATH}`);
        }
        
        // Ensure public directory exists (for static assets)
        if (!fs.existsSync(PUBLIC_PATH)) {
            fs.mkdirSync(PUBLIC_PATH, { recursive: true });
            console.log(`[storage-init] ✓ Created public directory: ${PUBLIC_PATH}`);
        } else {
            console.log(`[storage-init] ✓ Public directory exists: ${PUBLIC_PATH}`);
        }
        
        // Verify write permissions
        const testFile = `${UPLOAD_PATH}/.write-test`;
        try {
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            console.log('[storage-init] ✓ Write permissions verified');
        } catch (err) {
            console.error('[storage-init] ✗ WARNING: No write permission to storage directory!');
            throw new Error(`Cannot write to storage directory: ${UPLOAD_PATH}`);
        }
        
        console.log('[storage-init] Storage initialization complete!');
    } catch (error) {
        console.error('[storage-init] ✗ Failed to initialize storage directories:', error);
        throw error;
    }
};
