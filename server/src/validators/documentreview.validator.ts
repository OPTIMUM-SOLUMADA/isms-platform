import Joi from "joi";

export const documentTypeCreateSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Name is required",
    }),
    description: Joi.string().optional().default(""),
});

export const documentTypeUpdateSchema = Joi.object({
    name: Joi.string().trim().optional().messages({
        "string.empty": "Name is required",
    }),
    description: Joi.string().optional().default(""),
});
