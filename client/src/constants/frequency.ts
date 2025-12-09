export const Frequencies = {
    // DAILY: 'DAILY',
    // WEEKLY: 'WEEKLY',
    // MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    SEMI_ANNUAL: 'SEMI_ANNUAL',
    YEARLY: 'YEARLY',
    BIENNIAL: 'BIENNIAL',
    AS_NEEDED: 'AS_NEEDED',
} as const;


// Derive type from object
export type Frequency = keyof typeof Frequencies;

// Create array of values automatically
export const FrequenciesUnits = Object.values(Frequencies) as [
    // typeof Frequencies.DAILY,
    // typeof Frequencies.WEEKLY,
    // typeof Frequencies.MONTHLY,
    typeof Frequencies.QUARTERLY,
    typeof Frequencies.SEMI_ANNUAL,
    typeof Frequencies.YEARLY,
    typeof Frequencies.BIENNIAL,
    typeof Frequencies.AS_NEEDED
];
