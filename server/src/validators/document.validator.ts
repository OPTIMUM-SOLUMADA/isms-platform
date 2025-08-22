import Joi from "joi";


export const documentCreateSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "string.empty": "Title is required",
    }),
    description: Joi.string().optional().default("")
});
