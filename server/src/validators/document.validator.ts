import { Classification, ReviewFrequency } from '@prisma/client';
import Joi from 'joi';

const reviewFrequencyValues = Object.values(ReviewFrequency);
const classificationValues = Object.values(Classification);

export const documentCreateSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),

    description: Joi.string().optional().allow('', null),

    fileUrl: Joi.string().optional().allow('', null),

    status: Joi.string().valid('DRAFT', 'IN_REVIEW', 'APPROVED', 'EXPIRED').required().messages({
        'any.only': 'Status must be one of DRAFT, IN_REVIEW, APPROVED, EXPIRED',
        'any.required': 'Status is required',
    }),

    version: Joi.string().required().messages({
        'string.empty': 'Version is required',
        'any.required': 'Version is required',
    }),

    // Date saisie par l'utilisateur pour le calcul de nextReviewDate
    documentDate: Joi.string().optional().allow('', null),

    nextReviewDate: Joi.string().optional().allow('', null),

    reviewFrequency: Joi.string()
        .valid(...reviewFrequencyValues)
        .optional()
        .allow('', null),

    owner: Joi.string().min(1).required().messages({
        'string.empty': 'Owner is required',
        'any.required': 'Owner is required',
    }),

    // Accepte string CSV "id1,id2" (FormData) ou array
    authors: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()).min(1),
            Joi.string().min(1),
        )
        .required()
        .messages({
            'any.required': 'Authors are required',
        }),

    type: Joi.string().min(1).required().messages({
        'string.empty': 'Type is required',
        'any.required': 'Type is required',
    }),

    isoClause: Joi.string().min(1).required().messages({
        'string.empty': 'ISO Clause is required',
        'any.required': 'ISO Clause is required',
    }),

    // Accepte string CSV "id1,id2" (FormData) ou array
    reviewers: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()).min(1),
            Joi.string().min(1),
        )
        .required()
        .messages({
            'any.required': 'Reviewers are required',
        }),

    // Accepte string CSV "id1,id2" (FormData) ou array
    departmentRoles: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()).min(1),
            Joi.string().min(1),
        )
        .required()
        .messages({
            'any.required': 'departmentRoles are required',
        }),

    classification: Joi.string()
        .valid(...Object.values(classificationValues))
        .required()
        .messages({
            'string.empty': 'Classification is required',
            'any.required': 'Classification is required',
        }),

    userId: Joi.string().optional().allow('', null),
});
