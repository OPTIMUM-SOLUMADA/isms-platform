import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '@/utils/validation';

/**
 * Middleware to validate ObjectId parameters in route params
 * Usage: validateObjectIdParam('userId'), validateObjectIdParam('id')
 */
export function validateObjectIdParam(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const paramValue = req.params[paramName];

        if (!paramValue) {
            return res.status(400).json({
                error: `Missing required parameter: ${paramName}`,
                code: 'ERR_MISSING_PARAMETER',
            });
        }

        if (!isValidObjectId(paramValue)) {
            return res.status(400).json({
                error: `Invalid ${paramName}: ${paramValue}`,
                code: 'ERR_INVALID_OBJECT_ID',
            });
        }

        next();
    };
}

/**
 * Middleware to validate multiple ObjectId parameters
 * Usage: validateObjectIdParams(['userId', 'documentId'])
 */
export function validateObjectIdParams(paramNames: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const paramName of paramNames) {
            const paramValue = req.params[paramName];

            if (!paramValue) {
                return res.status(400).json({
                    error: `Missing required parameter: ${paramName}`,
                    code: 'ERR_MISSING_PARAMETER',
                });
            }

            if (!isValidObjectId(paramValue)) {
                return res.status(400).json({
                    error: `Invalid ${paramName}: ${paramValue}`,
                    code: 'ERR_INVALID_OBJECT_ID',
                });
            }
        }

        next();
    };
}
