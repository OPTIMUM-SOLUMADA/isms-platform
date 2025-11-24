import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

// shadcn/ui components (assumes your project has these available)
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type NetworkErrorProps = {
    /** Whether to show the retry button */
    showRetry?: boolean;
    /** Callback for retry action */
    onRetry?: () => void;
    /** Additional className to style the wrapper */
    className?: string;
};

/**
 * NetworkError
 * Small, reusable component to display a network / offline error state.
 * Uses Tailwind + shadcn/ui + lucide-react icons. Written in TypeScript.
 */
export default function NetworkError({
    showRetry = true,
    onRetry = () => window.location.reload(),
    className = "",
}: NetworkErrorProps) {
    const {t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`max-w-lg mx-auto ${className}`}
        >
            <Card className="flex items-center gap-4 p-4 md:p-6">
                <div className="flex-shrink-0">
                    <div className="p-2">
                        <img src="/network-error.png" alt="Network Error Illustration" className="mt-6 w-full max-w-32 object-cover h-auto" />
                    </div>
                </div>

                <CardContent className="p-0">
                    <CardTitle className="flex items-center gap-3 text-base md:text-lg">
                        <WifiOff className="h-5 w-5 text-muted-foreground" />
                        <span>{t("networkError.title")}</span>
                    </CardTitle>

                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                        {t("networkError.description")}
                    </CardDescription>

                    {showRetry && (
                        <div className="mt-4 flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={onRetry}
                                aria-label="Retry network request"
                                className="inline-flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {t("networkError.actions.retry.label")}
                            </Button>

                            {/* small helper text to indicate how to troubleshoot */}
                            <span className="text-xs text-muted-foreground">
                                {t("networkError.troubleshootHint")}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
        </div>
    );
}
