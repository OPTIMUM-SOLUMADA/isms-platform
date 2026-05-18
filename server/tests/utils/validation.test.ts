import { isValidObjectId, validateObjectId, safeObjectId } from '../validation';

describe('ObjectId Validation Utils', () => {
    describe('isValidObjectId', () => {
        it('should return false for undefined', () => {
            expect(isValidObjectId(undefined)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isValidObjectId(null)).toBe(false);
        });

        it('should return false for "undefined" string', () => {
            expect(isValidObjectId('undefined')).toBe(false);
        });

        it('should return false for "null" string', () => {
            expect(isValidObjectId('null')).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(isValidObjectId('')).toBe(false);
        });

        it('should return false for whitespace string', () => {
            expect(isValidObjectId('   ')).toBe(false);
        });

        it('should return false for invalid ObjectId', () => {
            expect(isValidObjectId('invalid')).toBe(false);
        });

        it('should return true for valid ObjectId', () => {
            expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
        });

        it('should return false for non-string types', () => {
            expect(isValidObjectId(123)).toBe(false);
            expect(isValidObjectId({})).toBe(false);
            expect(isValidObjectId([])).toBe(false);
        });
    });

    describe('validateObjectId', () => {
        it('should throw error for invalid ObjectId', () => {
            expect(() => validateObjectId('invalid')).toThrow('Invalid ID: invalid');
        });

        it('should throw error with custom field name', () => {
            expect(() => validateObjectId('invalid', 'userId')).toThrow('Invalid userId: invalid');
        });

        it('should not throw for valid ObjectId', () => {
            expect(() => validateObjectId('507f1f77bcf86cd799439011')).not.toThrow();
        });
    });

    describe('safeObjectId', () => {
        it('should return null for invalid ObjectId', () => {
            expect(safeObjectId('invalid')).toBe(null);
            expect(safeObjectId('undefined')).toBe(null);
        });

        it('should return the ID for valid ObjectId', () => {
            const validId = '507f1f77bcf86cd799439011';
            expect(safeObjectId(validId)).toBe(validId);
        });
    });
});
