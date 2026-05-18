import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
    rememberMe: Joi.boolean().optional(),
});

export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
    }),
});

export const changePasswordSchema = Joi.object({
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:_\-#])/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
        }),
    resetToken: Joi.string().required().messages({
        'string.empty': 'Reset token is required',
    }),
    isInvitation: Joi.boolean().optional().default(false),
});

export const verifyResetTokenSchema = Joi.object({
    resetToken: Joi.string().required().messages({
        'string.empty': 'Reset token is required',
    }),
});
