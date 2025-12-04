import { NotificationType } from '@prisma/client';

interface NotificationTemplate {
    title: string;
    message: string;
}

/**
 * Generate notification title and message based on notification type
 */
export function getNotificationTemplate(
    type: NotificationType,
    documentTitle?: string,
    additionalInfo?: string
): NotificationTemplate {
    switch (type) {
        // Review notifications
        case NotificationType.REVIEW_NEEDED:
            return {
                title: 'Revue nécessaire',
                message: documentTitle 
                    ? `Vous avez une revue à consulter pour le document "${documentTitle}"`
                    : 'Vous avez une revue à consulter',
            };

        case NotificationType.REVIEW_OVERDUE:
            return {
                title: 'Revue en retard',
                message: documentTitle
                    ? `La revue du document "${documentTitle}" est en retard`
                    : 'Une revue est en retard',
            };

        case NotificationType.REVIEW_COMPLETED:
            return {
                title: 'Revue terminée',
                message: documentTitle
                    ? `La revue du document "${documentTitle}" a été complétée`
                    : 'Une revue a été complétée',
            };

        // Document notifications
        case NotificationType.DOCUMENT_UPDATED:
            return {
                title: 'Document mis à jour',
                message: documentTitle
                    ? `Le document "${documentTitle}" a été mis à jour`
                    : 'Un document a été mis à jour',
            };

        case NotificationType.DOCUMENT_APPROVED:
            return {
                title: 'Document approuvé',
                message: documentTitle
                    ? `Le document "${documentTitle}" a été approuvé`
                    : 'Un document a été approuvé',
            };

        // Version notifications
        case NotificationType.VERSION_CREATED:
            return {
                title: 'Nouvelle version créée',
                message: documentTitle
                    ? `Une nouvelle version du document "${documentTitle}" a été créée`
                    : 'Une nouvelle version a été créée',
            };

        case NotificationType.VERSION_APPROVED:
            return {
                title: 'Version approuvée',
                message: documentTitle
                    ? `La version du document "${documentTitle}" a été approuvée`
                    : 'Une version a été approuvée',
            };

        case NotificationType.VERSION_REJECTED:
            return {
                title: 'Version rejetée',
                message: documentTitle
                    ? `La version du document "${documentTitle}" a été rejetée`
                    : 'Une version a été rejetée',
            };

        // User & invitation notifications
        case NotificationType.USER_INVITED:
            return {
                title: 'Invitation reçue',
                message: additionalInfo || 'Vous avez été invité à rejoindre la plateforme',
            };

        // Compliance notifications
        case NotificationType.NONCONFORMITY_CREATED:
            return {
                title: 'Non-conformité créée',
                message: documentTitle
                    ? `Une non-conformité a été créée pour le document "${documentTitle}"`
                    : 'Une non-conformité a été créée',
            };

        case NotificationType.ACTION_CREATED:
            return {
                title: 'Action créée',
                message: documentTitle
                    ? `Une action corrective a été créée pour le document "${documentTitle}"`
                    : 'Une action corrective a été créée',
            };

        default:
            return {
                title: 'Notification',
                message: 'Vous avez une nouvelle notification',
            };
    }
}

/**
 * Generate custom message for document assignment
 */
export function getDocumentAssignmentMessage(role: 'author' | 'reviewer', documentTitle: string): NotificationTemplate {
    if (role === 'author') {
        return {
            title: 'Nouveau document créé',
            message: `Vous avez été assigné en tant qu'auteur au document "${documentTitle}"`,
        };
    } else {
        return {
            title: 'Nouveau document créé',
            message: `Vous avez été assigné en tant que réviseur au document "${documentTitle}"`,
        };
    }
}

/**
 * Generate message for public document publication
 */
export function getPublicDocumentMessage(documentTitle: string): NotificationTemplate {
    return {
        title: 'Document public publié',
        message: `Le document public "${documentTitle}" a été publié`,
    };
}

/**
 * Generate message for document publication
 */
export function getDocumentPublishedMessage(documentTitle: string): NotificationTemplate {
    return {
        title: 'Document publié',
        message: `Le document "${documentTitle}" a été publié`,
    };
}
