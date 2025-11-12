import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Files } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import type { AuditLog } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/date";
import { UserHoverCard } from "../users/hovercard/UserHoverCard";
import CellNoValue from "@/components/CellNoValue";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auditEventMeta } from "@/constants/auditevent";
import { auditStatusColors } from "@/constants/color";

// Table component using the reusable DataTable
interface TableProps {
    data: AuditLog[];
    onView?: (audit: AuditLog) => void;
    isLoading?: boolean;
}

const Table = ({
    data = [],
    isLoading = false,
}: TableProps) => {
    const { t } = useTranslation();

    // Define columns for UserTable
    const columns: ColumnDef<AuditLog>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("auditLog.table.columns.timestamp"),
            enableHiding: false,
            size: 20,
            cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div className="space-y-0 text-sm">
                        <div className="font-medium">
                            {format(audit.timestamp!, "P", { locale: getDateFnsLocale() })}
                        </div>
                        <div className="opacity-70">
                            {format(audit.timestamp!, "p", { locale: getDateFnsLocale() })}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "user",
            enableSorting: true,
            header: t("auditLog.table.columns.user"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                if (!audit.user) return <CellNoValue />;
                return (
                    <UserHoverCard user={audit.user!} />
                );
            },
        },
        {
            accessorKey: "action",
            enableSorting: true,
            header: t("auditLog.table.columns.action"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                const { color, icon: Icon, labelKey = '' } = auditEventMeta[audit.eventType] || {};
                return (
                    <Badge
                        className={cn(
                            "border-0 flex items-center gap-1 w-fit p-1",
                            color
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {t(labelKey)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "types",
            enableSorting: true,
            header: t("auditLog.table.columns.types"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                return audit.targets?.map((item, index) => (
                    <Badge key={index} variant="secondary">{item.type}</Badge>
                ));
            },
        },
        {
            accessorKey: "status",
            enableSorting: true,
            header: t("auditLog.table.columns.status"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                const color = auditStatusColors[audit.status];
                return (
                    <Badge
                        className={cn(
                            "border-0 flex items-center gap-1 w-fit p-1 uppercase",
                            color,
                        )}
                    >
                        {t(`auditLog.status.${audit.status}`)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "ip",
            enableSorting: true,
            header: t("auditLog.table.columns.ipAddress"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const { ipAddress } = row.original;
                if (!ipAddress) return <CellNoValue />;
                return <span className="font-mono opacity-90">{ipAddress.split(',')[0]}</span>;
            },
        },
        {
            accessorKey: "details",
            enableSorting: true,
            header: t("auditLog.table.columns.details"),
            enableHiding: false,
            size: 200,
            cell: ({ row }) => {
                const { details } = row.original;
                if (!details) return null;
                // show json
                return (
                    <DetailsCell details={details} />
                )
            },
        },

    ], [t]);

    return (
        <DataTable
            title={t("Audits list") + " (" + data.length + ")"}
            columns={columns}
            data={data}
            searchableColumnId="name"
            enableRowSelection={false}
            isLoading={isLoading}
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Files className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("auditLog.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("auditLog.table.empty.message")}</p>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
            showHeader={false}
        />
    );
}


interface DetailsCellProps {
    details: Record<string, any>;
}
export const DetailsCell = ({ details }: DetailsCellProps) => {
    const entries = Object.entries(details);
    const hasMore = entries.length > 2;
    const [viewMore, setViewMore] = useState(false);
    const { t } = useTranslation();

    const visibleEntries = viewMore ? entries : entries.slice(0, 2);

    return (
        <ul
            className={cn(
                "list-inside list-disc space-y-0.5 text-sm",
                !viewMore && "max-h-[4.5rem] overflow-hidden",
            )}
        >
            {visibleEntries.map(([key, value], index) => (
                <li key={index}>
                    <span className="font-medium opacity-60">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>{" "}
                    <span className="opacity-90 break-all">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                </li>
            ))}

            {hasMore && !viewMore && (
                <li
                    className="text-primary underline text-right cursor-pointer list-none text-xs"
                    onClick={() => setViewMore(true)}
                >
                    {t("auditLog.table.cells.details.actions.view.label")}
                </li>
            )}
        </ul>
    );
};

export const AuditTable = React.memo(Table);