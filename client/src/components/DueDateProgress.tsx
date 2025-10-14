import { FC, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface DueDateProgressProps {
    createdAt: Date | string;
    dueDate: Date | string;
    className?: string;
}

/**
 * Display due date progress between creation and due date.
 * Shows progress bar, color status, and remaining time.
 */
export const DueDateProgress: FC<DueDateProgressProps> = ({
    createdAt,
    dueDate,
    className,
}) => {
    const { t, i18n } = useTranslation();
    const { percent, statusColor, label, isOverdue } = useMemo(() => {
        const start = new Date(createdAt);
        const end = new Date(dueDate);
        const now = new Date();

        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        const percent = Math.min(Math.max((elapsed / total) * 100, 0), 100);

        // determine color based on how close to due
        let statusColor = "bg-green-500";
        if (percent >= 70 && percent < 90) statusColor = "bg-yellow-500";
        else if (percent >= 90) statusColor = "bg-red-500";

        // label showing time left or overdue
        const locale = i18n.language.startsWith("fr") ? fr : enUS;
        const time = formatDistanceToNow(end, { locale });

        const label =
            now > end
                ? t("components.dueDateProgress.overdue", { time })
                : t("components.dueDateProgress.left", { time });

        return { percent, statusColor, label, isOverdue: now > end };
    }, [createdAt, dueDate, t, i18n]);

    return (
        <div className={cn("flex flex-col gap-1 w-full", className)}>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span className={cn("font-medium", isOverdue && "text-red-500")}>{label}</span>
                {!isOverdue && <span>{Math.round(percent)}%</span>}
            </div>

            {!isOverdue && (
                <Progress
                    value={percent}
                    className="h-2 bg-muted"
                    indicatorClassName={statusColor}
                />
            )}
        </div>
    );
};
