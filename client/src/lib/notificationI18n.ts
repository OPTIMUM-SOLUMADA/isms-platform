import { Notification } from "@/types";
import { TFunction } from "i18next";

function extractTitleFromMessage(message?: string): string | undefined {
  if (!message) return undefined;
  // Try to extract content inside quotes or Unicode quotes
  const match = message.match(/"([^"]+)"|“([^”]+)”|\u201C([^\u201D]+)\u201D/);
  return match?.[1] || match?.[2] || match?.[3];
}

export function getLocalizedNotification(notification: Notification, t: TFunction) {
  const type = notification.type;
  const docTitle = notification.document?.title || extractTitleFromMessage(notification.message);

  // Detect assignment messages by backend French patterns
  const isAssignment = notification.title === "Nouveau document créé";
  const isReviewer = /réviseur|réviseur|reviewer/i.test(notification.message || "");
  const isAuthor = /auteur|author/i.test(notification.message || "");

  if (isAssignment) {
    if (isReviewer) {
      return {
        title: t("notifications.templates.ASSIGNMENT.reviewer.title"),
        message: t("notifications.templates.ASSIGNMENT.reviewer.message", { title: docTitle }),
      };
    }
    if (isAuthor) {
      return {
        title: t("notifications.templates.ASSIGNMENT.author.title"),
        message: t("notifications.templates.ASSIGNMENT.author.message", { title: docTitle }),
      };
    }
  }

  // Public published special case
  if (notification.title === "Document public publié") {
    return {
      title: t("notifications.templates.PUBLIC_PUBLISHED.title"),
      message: t("notifications.templates.PUBLIC_PUBLISHED.message", { title: docTitle }),
    };
  }

  // Document published
  if (notification.title === "Document publié") {
    return {
      title: t("notifications.templates.DOCUMENT_PUBLISHED.title"),
      message: t("notifications.templates.DOCUMENT_PUBLISHED.message", { title: docTitle }),
    };
  }

  // Generic by type
  const base = t(`notifications.templates.${type}.title`, undefined);
  const baseMsg = t(`notifications.templates.${type}.message`, { title: docTitle });

  // If i18n keys exist, use them; else fallback to original
  const hasBase = typeof base === "string" && !base.includes("notifications.templates");
  const hasMsg = typeof baseMsg === "string" && !baseMsg.includes("notifications.templates");

  return {
    title: hasBase ? base : notification.title,
    message: hasMsg ? baseMsg : notification.message,
  };
}
