import Joi from 'joi';

// Valid notification types from NotificationType enum
const validNotificationTypes = [
    'REVIEW_NEEDED',
    'REVIEW_OVERDUE',
    'REVIEW_COMPLETED',
    'DOCUMENT_CREATED',
    'DOCUMENT_UPDATED',
    'DOCUMENT_APPROVED',
    'VERSION_CREATED',
    'VERSION_APPROVED',
    'VERSION_REJECTED',
    'USER_INVITED',
    'NONCONFORMITY_CREATED',
    'ACTION_CREATED',
    'COMPLIANCE_CREATED',
    'COMPLIANCE_UPDATED',
];

export const notificationListSchema = Joi.object({
    limit: Joi.number().integer().min(1).optional(),
    page: Joi.number().integer().min(1).optional(),
});

export const notificationCreateSchema = Joi.object({
    userId: Joi.string().required(),
    type: Joi.string()
        .valid(...validNotificationTypes)
        .required()
        .messages({
            'any.only': 'type must be one of: ' + validNotificationTypes.join(', '),
        }),
    title: Joi.string().required(),
    message: Joi.string().required(),
    documentId: Joi.string().optional().allow(''),
});

export const notificationIdParamSchema = Joi.object({
    id: Joi.string().required(),
});
