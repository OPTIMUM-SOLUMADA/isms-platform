import Joi from 'joi';

export const documentCreateSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),

    description: Joi.string().optional(),

    fileUrl: Joi.string().uri().optional(),

    status: Joi.string().valid('DRAFT', 'IN_REVIEW', 'APPROVED', 'EXPIRED').required().messages({
        'any.only': 'Status must be one of DRAFT, IN_REVIEW, APPROVED, EXPIRED',
        'any.required': 'Status is required',
    }),

    nextReviewDate: Joi.date().iso().optional(),

    reviewFrequency: Joi.number().integer().positive().optional(),

    owners: Joi.array().items(Joi.string()).min(1).required().messages({
        'string.empty': 'Owners is required',
        'any.required': 'Owners is required',
    }),

    type: Joi.string().min(1).required().messages({
        'string.empty': 'Type is required',
        'any.required': 'Type is required',
    }),

    department: Joi.string().min(1).required().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required',
    }),

    isoClause: Joi.string().min(1).required().messages({
        'string.empty': 'ISO Clause is required',
        'any.required': 'ISO Clause is required',
    }),

    reviewers: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'At least one reviewer is required',
        'any.required': 'Reviewers are required',
    }),
});
