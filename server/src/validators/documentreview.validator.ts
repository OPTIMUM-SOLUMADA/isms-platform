import Joi from 'joi';

export const documentReviewCreateSchema = Joi.object({
    document: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
    }),
    reviewer: Joi.string().optional().default(''),
    dueDate: Joi.date().iso().required().messages({
        'string.empty': 'Due date is required',
    }),
});

export const documentReviewUpdateSchema = Joi.object({
    id: Joi.string().trim().optional().messages({
        'string.empty': 'Name is required',
    }),
    description: Joi.string().optional().default(''),
});
