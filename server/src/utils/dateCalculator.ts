import { ReviewFrequency } from '@prisma/client';

/**
 * Calculate next review date based on frequency from today
 * @param frequency ReviewFrequency enum value
 * @returns Date object representing the next review date
 */
export function calculateNextReviewDate(frequency: ReviewFrequency): Date {
  const today = new Date();
  const nextReviewDate = new Date(today);

  switch (frequency) {
    case ReviewFrequency.QUARTERLY:
      nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
      break;
    case ReviewFrequency.SEMI_ANNUAL:
      nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
      break;
    case ReviewFrequency.YEARLY:
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
      break;
    case ReviewFrequency.BIENNIAL:
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 2);
      break;
    case ReviewFrequency.AS_NEEDED:
      // For AS_NEEDED, set to 1 year by default (can be manually changed)
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
      break;
    default:
      // Default to quarterly if unknown
      nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
  }

  return nextReviewDate;
}
