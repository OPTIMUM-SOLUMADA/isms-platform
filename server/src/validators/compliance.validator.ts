import Joi from 'joi';
import { ClauseComplianceStatus, ComplianceStatus, NonConformityStatus, ActionStatus } from '@prisma/client';

// -------------------------
// Clause Compliance Validator
// -------------------------
export const updateClauseStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ClauseComplianceStatus))
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Invalid status value',
    }),
  evidence: Joi.string().optional().allow(''),
});

// -------------------------
// Document Compliance Validator
// -------------------------
export const updateDocumentComplianceSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ComplianceStatus))
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Invalid status value',
    }),
  description: Joi.string().optional().allow(''),
});

// -------------------------
// NonConformity Validator
// -------------------------
export const createNonConformitySchema = Joi.object({
  type: Joi.string().trim().required().messages({ 'string.empty': 'Type is required' }),
  description: Joi.string().trim().required().messages({ 'string.empty': 'Description is required' }),
  documentId: Joi.string().optional().allow(''),
  userId: Joi.string().optional().allow(''),
});

export const updateNonConformityStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(NonConformityStatus))
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Invalid status value',
    }),
});

// -------------------------
// Corrective Action Validator
// -------------------------
export const createCorrectiveActionSchema = Joi.object({
  nonConformityId: Joi.string().trim().required().messages({ 'string.empty': 'NonConformity ID is required' }),
  description: Joi.string().trim().required().messages({ 'string.empty': 'Description is required' }),
  ownerId: Joi.string().optional().allow(''),
  dueDate: Joi.date().optional(),
});

export const updateCorrectiveActionStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ActionStatus))
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Invalid status value',
    }),
  completedAt: Joi.date().optional(),
});

// Note: the `validate` middleware validates `req.body` by default. Route params
// (like `:id`) are validated separately if needed with `validate(schema, 'params')`.
