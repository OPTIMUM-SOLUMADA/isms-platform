import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: true, // FormData peut contenir des champs non déclarés (ex: multer)
            stripUnknown: false,
        });

        if (error) {
            return res.status(400).json({
                errors: error.details.map((err) => ({ field: err.path, message: err.message })),
            });
        }

        req[property] = value;
        return next();
    };
