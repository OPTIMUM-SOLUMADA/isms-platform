import { ReviewDecision } from '@prisma/client';
import Joi from 'joi';

const ReviewDecisions = Object.values(ReviewDecision);

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
        'string.empty': 'Id is required',
    }),
    comment: Joi.string().optional().default('').allow(''),
});

export const documentReviewMakeDecisionSchema = Joi.object({
    decision: Joi.string()
        .valid(...ReviewDecisions)
        .required()
        .messages({
            'string.empty': 'Decision is required',
            'any.only': 'Invalid decision',
        }),
    comment: Joi.string().optional().default('').allow(''),
});
