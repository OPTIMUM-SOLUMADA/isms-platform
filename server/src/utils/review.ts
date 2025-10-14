import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import type { ReviewFrequency } from '@prisma/client';

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
        case 'AS_NEEDED':
            return null;
        default:
            return null;
    }
}
