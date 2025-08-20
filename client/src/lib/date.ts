/**
 * Format a date according to locale
 * @param date - Date object or ISO string
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - locale string, defaults to browser or 'en-US'
 */
export function formatDate(
    date: string | Date,
    options?: Intl.DateTimeFormatOptions,
    locale?: string
) {
    const d = typeof date === "string" ? new Date(date) : date;
    const userLocale = locale || typeof window !== "undefined"
        ? navigator.language
        : "en-US";

    return new Intl.DateTimeFormat(userLocale, options).format(d);
}
