import { useCallback, useMemo } from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PasswordStrengthProps {
    value: string // the password string to evaluate
}

export default function PasswordStrength({ value }: PasswordStrengthProps) {
    const { t } = useTranslation();

    const checkStrength = useCallback((pass: string) => {

        const requirements = [
            {
                regex: /.{8,}/,
                text: t("common.password.requirements.minLength"), // e.g. "At least 8 characters"
            },
            {
                regex: /[0-9]/,
                text: t("common.password.requirements.number"), // e.g. "At least 1 number"
            },
            {
                regex: /[a-z]/,
                text: t("common.password.requirements.lowercase"), // e.g. "At least 1 lowercase letter"
            },
            {
                regex: /[A-Z]/,
                text: t("common.password.requirements.uppercase"), // e.g. "At least 1 uppercase letter"
            },
        ];

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }))
    }, [t]);

    const strength = useMemo(() => checkStrength(value), [value, checkStrength])

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length
    }, [strength])

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border"
        if (score <= 1) return "bg-red-500"
        if (score <= 2) return "bg-orange-500"
        if (score === 3) return "bg-amber-500"
        return "bg-emerald-500"
    }

    const getStrengthText = (score: number) => {
        if (score === 0) return t("common.password.strength.enter") // "Enter a password"
        if (score <= 2) return t("common.password.strength.weak") // "Weak password"
        if (score === 3) return t("common.password.strength.medium") // "Medium password"
        return t("common.password.strength.strong") // "Strong password"
    }

    return (
        <div>
            {/* Password strength bar */}
            <div
                className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label="Password strength"
            >
                <div
                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
            </div>

            {/* Password strength description */}
            <p className="text-foreground mb-2 text-xs font-medium">
                {getStrengthText(strengthScore)}. {t("common.password.strength.mustContain")}
            </p>

            {/* Password requirements list */}
            <ul className="space-y-1.5" aria-label="Password requirements">
                {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <CheckIcon
                                size={16}
                                className="text-emerald-500"
                                aria-hidden="true"
                            />
                        ) : (
                            <XIcon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                            />
                        )}
                        <span
                            className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                        >
                            {req.text}
                            <span className="sr-only">
                                {req.met ? " - Requirement met" : " - Requirement not met"}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
