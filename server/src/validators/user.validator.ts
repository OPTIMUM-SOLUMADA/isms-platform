import { RoleType } from "@prisma/client";
import Joi from "joi";

const roleValues = Object.values(RoleType);

export const userCreateSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Name is required",
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email address"
    }),
    role: Joi.string().valid(...roleValues).required().messages({
        "string.empty": "Role is required",
        "any.only": "Invalid role"
    }),
    departmentId: Joi.string().uuid().required().messages({
        "string.empty": "Department is required",
    }),
});
