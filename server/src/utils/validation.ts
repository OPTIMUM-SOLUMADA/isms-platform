/**
 * Validate if a string is a valid MongoDB ObjectId
 * MongoDB ObjectId is a 24-character hexadecimal string
 * @param id - The ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidObjectId(id: any): boolean {
    if (!id || typeof id !== 'string') {
        return false;
    }

    // Check if it's "undefined" string or null/empty
    if (id === 'undefined' || id === 'null' || id.trim() === '') {
        return false;
    }

    // MongoDB ObjectId is a 24-character hexadecimal string
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}

/**
 * Validate ObjectId and throw error if invalid
 * @param id - The ID to validate
 * @param fieldName - Name of the field (for error message)
 * @throws Error if invalid
 */
export function validateObjectId(id: any, fieldName: string = 'ID'): void {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid ${fieldName}: ${id}`);
    }
}

/**
 * Safely validate ObjectId for Prisma queries
 * @param id - The ID to validate
 * @returns the ID if valid, or null if invalid
 */
export function safeObjectId(id: any): string | null {
    return isValidObjectId(id) ? id : null;
}
