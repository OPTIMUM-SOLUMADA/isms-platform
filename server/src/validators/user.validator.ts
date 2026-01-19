import { RoleType } from '@prisma/client';
import Joi from 'joi';

const roleValues = Object.values(RoleType);

export const userCreateSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
    }),
    role: Joi.string()
        .valid(...roleValues)
        .required()
        .messages({
            'string.empty': 'Role is required',
            'any.only': 'Invalid role',
        }),
    departmentRoleUsers: Joi.array().items(Joi.string()).min(1).required().messages({
        'string.empty': 'Department role users is required',
        'any.required': 'Department role users is required',
    }),
    sendInvitationLink: Joi.boolean().optional().default(true),
    isActive: Joi.boolean().optional().default(true),
    userId: Joi.string().optional().allow(''),
});
