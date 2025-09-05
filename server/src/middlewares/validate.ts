import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // return all errors, not just the first
            allowUnknown: false, // disallow extra fields
        });

        if (error) {
            return res.status(400).json({
                errors: error.details.map((err) => err.message),
            });
        }

        req[property] = value;
        
        return next();
    };
