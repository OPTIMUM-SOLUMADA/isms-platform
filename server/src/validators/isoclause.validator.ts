import Joi from 'joi';

export const isoClauseCreateSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
    }),
    description: Joi.string().optional().allow('').default(''),
    code: Joi.string().trim().required().messages({
        'string.empty': 'Code is required',
    }),
    userId: Joi.string().optional().allow(''),
});

export const isoClauseUpdateSchema = Joi.object({
    name: Joi.string().trim().optional().messages({
        'string.empty': 'Name is required',
    }),
    description: Joi.string().optional().allow('').default(''),
    code: Joi.string().trim().optional().messages({
        'string.empty': 'Code is required',
    }),
    userId: Joi.string().optional().allow(''),
});
