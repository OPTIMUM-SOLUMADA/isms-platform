import {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    startOfDay,
    endOfDay,
    isWithinInterval,
    subHours,
} from 'date-fns';
import type { ReviewFrequency } from '@prisma/client';

const NOTIFY_BEFORE_DAYS = 2;

export function getNextReviewDate(
    lastReviewDate: Date | null,
    frequency: ReviewFrequency,
): Date | null {
    const base = lastReviewDate ?? new Date();

    switch (frequency) {
        case 'DAILY':
            return addDays(base, 1);
        case 'WEEKLY':
            return addWeeks(base, 1);
        case 'MONTHLY':
            return addMonths(base, 1);
        case 'QUARTERLY':
            return addMonths(base, 3);
        case 'SEMI_ANNUAL':
            return addMonths(base, 6);
        case 'YEARLY':
            return addYears(base, 1);
        case 'BIENNIAL':
            return addYears(base, 2);
        // case 'AS_NEEDED':
        //     return null;
        default:
            return null;
    }
}

/**
 * Determines if a reviewer should be notified today based on the review frequency.
 */
export function shouldNotifyReview({
    frequency,
    dueDate,
    lastNotifiedAt,
    now = new Date(),
}: {
    frequency: ReviewFrequency;
    dueDate: Date;
    lastNotifiedAt?: Date | null;
    now?: Date;
}): boolean {
    const targetStart = startOfDay(addDays(now, NOTIFY_BEFORE_DAYS));
    const targetEnd = endOfDay(addDays(now, NOTIFY_BEFORE_DAYS));

    switch (frequency) {
        case 'DAILY':
            // Notify every day if not already notified today
            return (
                !lastNotifiedAt &&
                isWithinInterval(dueDate, {
                    start: subHours(dueDate, 12),
                    end: dueDate,
                })
            );

        default:
            // For other frequencies, notify if within 2 days before due date
            return isWithinInterval(dueDate, { start: targetStart, end: targetEnd });
    }
}

export function stripHtmlAndClamp(text: string, maxLength: number): string {
    // 1. Remove all HTML tags
    const noHtml = text.replace(/<[^>]+>/g, '');

    // 2. Normalize whitespace
    const trimmed = noHtml.replace(/\s+/g, ' ').trim();

    // 3. Clamp if needed
    if (trimmed.length <= maxLength) return trimmed;

    return trimmed.slice(0, maxLength) + '…';
}
