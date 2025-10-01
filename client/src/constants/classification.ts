export const Classification = {
    CONFIDENTIAL: 'CONFIDENTIAL',
    INTERNAL_USE_ONLY: 'INTERNAL_USE_ONLY',
    PUBLIC: 'PUBLIC',
} as const;

export const classifications = Object.values(Classification) as [
    typeof Classification.CONFIDENTIAL,
    typeof Classification.INTERNAL_USE_ONLY,
    typeof Classification.PUBLIC
];