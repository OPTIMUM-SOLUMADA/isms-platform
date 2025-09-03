import Joi from 'joi';

export const departmentCreateSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
    }),
    description: Joi.string().optional().default(''),
});
