
import i18n from "@/i18n/config";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";

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



export const getDateFnsLocale = () => {
    const lng = i18n.language;
    switch (lng) {
        case "fr":
            return fr;
        case "en":
        default:
            return enUS;
    }
};


export const defaultFormat = (date: string | Date) => {
    return format(date, "dd/MM/yyyy");
}