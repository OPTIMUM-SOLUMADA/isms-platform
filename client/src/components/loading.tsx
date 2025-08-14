import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional: shadcn utility. If you don't have it, replace cn(...) with className string concatenation.
import { Progress } from "@/components/ui/progress"; // optional: remove if you don't use Progress.

/**
 * LoadingSplash — Fullscreen loading screen for ISO/ISMS flows
 * - ShadCN + Tailwind + Lucide + Framer Motion
 * - Green accent to align with ISO-themed styling
 *
 * Props:
 *  - message?: string — main status text
 *  - subMessage?: string — secondary helper text
 *  - progress?: number — 0..100 to show a progress bar
 *  - tips?: string[] — rotating tips shown beneath
 *  - variant?: "light" | "dark" — background theme
 *  - className?: string
 */
export default function LoadingSplash({
    message = "Initializing ISO system…",
    subMessage = "Please wait while we verify modules and policies",
    progress,
    tips = [
        "ISO 27001 controls loading…",
        "Encrypting sensitive configuration…",
        "Validating audit logs…",
    ],
    variant = "light",
    className,
}: {
    message?: string;
    subMessage?: string;
    progress?: number;
    tips?: string[];
    variant?: "light" | "dark";
    className?: string;
}) {
    const [tipIndex, setTipIndex] = React.useState(0);

    React.useEffect(() => {
        if (!tips?.length) return;
        const id = setInterval(() => {
            setTipIndex((i) => (i + 1) % tips.length);
        }, 2500);
        return () => clearInterval(id);
    }, [tips]);

    const isDark = variant === "dark";

    return (
        <div
            role="status"
            aria-busy="true"
            className={cn(
                "fixed inset-0 z-50 grid place-items-center p-6",
                isDark
                    ? "bg-neutral-950 text-neutral-200"
                    : "bg-gradient-to-b from-green-50 to-white text-neutral-800",
                className
            )}
        >
            <div className="w-full max-w-md">
                {/* Card-like container */}
                <div
                    className={cn(
                        "rounded-2xl shadow-xl border p-8 flex flex-col items-center text-center gap-4",
                        isDark ? "border-neutral-800 bg-neutral-900" : "border-green-100 bg-white"
                    )}
                >
                    {/* Animated crest */}
                    <div className="relative h-16 w-16">
                        <motion.div
                            className="absolute inset-0 grid place-items-center"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                        >
                            <Loader2 className={cn("h-16 w-16", isDark ? "text-green-400" : "text-green-600")} />
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 grid place-items-center"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
                        >
                            <ShieldCheck className={cn("h-9 w-9", isDark ? "text-green-300" : "text-green-700")} />
                        </motion.div>
                    </div>

                    {/* Text */}
                    <div className="space-y-1">
                        <h2 className={cn("text-xl font-semibold", isDark ? "text-neutral-100" : "text-neutral-900")}>{message}</h2>
                        <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>{subMessage}</p>
                    </div>

                    {/* Optional progress */}
                    {typeof progress === "number" && (
                        <div className="w-full space-y-2 pt-2">
                            <Progress value={progress} className={cn(isDark ? "bg-neutral-800" : "bg-green-100")} />
                            <div className={cn("text-xs", isDark ? "text-neutral-400" : "text-neutral-600")}>{progress}%</div>
                        </div>
                    )}

                    {/* Rotating tips */}
                    {tips?.length > 0 && (
                        <motion.p
                            key={tipIndex}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className={cn("text-xs pt-2", isDark ? "text-neutral-400" : "text-neutral-600")}
                        >
                            {tips[tipIndex]}
                        </motion.p>
                    )}
                </div>

                {/* Footer hint */}
                <div className={cn("mt-6 text-center text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Securing your ISMS • ISO-inspired loading screen</div>
            </div>
        </div>
    );
}

// Example usage:
// <LoadingSplash variant="light" progress={42} />
// <LoadingSplash message="Verifying controls…" subMessage="Running risk assessment" variant="dark" />
