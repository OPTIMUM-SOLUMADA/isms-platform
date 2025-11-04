import Joi from 'joi';

export const markAsCompletedSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.empty': 'User id is required',
    }),
});
