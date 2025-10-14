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
    departmentId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.empty': 'Department is required',
        }),
    departmentRoleId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.empty': 'Department role is required',
        }),
    sendInvitationLink: Joi.boolean().optional().default(true),
    isActive: Joi.boolean().optional().default(true),
});
