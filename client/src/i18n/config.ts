import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';

const resources = {
    en: {
        translation: enTranslations
    },
    fr: {
        translation: frTranslations
    }
};

// Custom language detector using preferences service
const customLanguageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const browserLang = navigator.language.split('-')[0];
            const lang = ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
            callback(lang);
        } catch (error) {
            console.error('Error detecting language:', error);
            callback('en');
        }
    },
    init: () => { },
};

// Initialize i18n
const initializeI18n = async () => {
    await i18n
        .use(customLanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'fr',
            supportedLngs: ['en', 'fr'],

            interpolation: {
                escapeValue: false // React already escapes values
            }
        });
};

// Initialize and export
initializeI18n();

console.log(i18n.language);

export default i18n;