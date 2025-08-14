import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email address"
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    })
});


export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email address"
    })
});

export const changePasswordSchema = Joi.object({
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
    resetToken: Joi.string().required().messages({
        "string.empty": "Reset token is required",
    })
});