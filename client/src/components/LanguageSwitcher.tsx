import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '@/i18n/config';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const current = i18n.language;
    const [lang, setLang] = useLocalStorage("lang", current);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n]);


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Change language</span>
                    <span>{LANGUAGES.find((l) => l.code === current)?.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {LANGUAGES.filter((l) => l.code !== current).map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLang(lang.code)}
                        className="flex items-center gap-3"
                    >
                        <div className="flex-1">
                            <div className="text-sm font-medium">{lang.label}</div>
                            <div className="text-xs text-muted-foreground">{lang.code}</div>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}