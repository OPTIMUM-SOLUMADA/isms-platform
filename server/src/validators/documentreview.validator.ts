import Joi from "joi";

export const documentReviewCreateSchema = Joi.object({
    document: Joi.string().trim().required().messages({
        "string.empty": "Document is required",
    }),
    reviewer: Joi.string().optional().default(""),
    dueDate: Joi.date().iso().optional(),

});

export const documentReviewUpdateSchema = Joi.object({
    document: Joi.string().trim().optional().messages({
        "string.empty": "Document is required",
    }),
    reviewer: Joi.string().optional().default(""),
    dueDate: Joi.date().iso().optional(),
});
