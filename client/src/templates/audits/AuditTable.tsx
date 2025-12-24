import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Files, ChevronLeft, ChevronRight } from "lucide-react";
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
import AuditDetailsViewer from "./AuditDetailsViewer";
import { AuditTarget } from "./AuditTarget";
import { Button } from "@/components/ui/button";

// Table component using the reusable DataTable
interface TableProps {
    data: AuditLog[];
    onView?: (audit: AuditLog) => void;
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

const Table = ({
    data = [],
    isLoading = false,
    pagination,
}: TableProps) => {
    const { t } = useTranslation();

    console.log("data", data);
    
    // Define columns for UserTable
    const columns: ColumnDef<AuditLog>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("auditLog.table.columns.timestamp"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div className="text-sm space-y-1">
                        <div className="font-medium">
                            {format(audit.timestamp!, "P", { locale: getDateFnsLocale() })}
                        </div>
                        <div className="opacity-70 text-xs">
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
                            "border-0 flex items-center gap-1 w-fit p-1 text-xs font-medium uppercase",
                            color,
                        )}
                    >
                        {t(`auditLog.status.${audit.status}`)}
                    </Badge>
                );
            },
        },
        // {
        //     accessorKey: "ip",
        //     enableSorting: true,
        //     header: t("auditLog.table.columns.ipAddress"),
        //     enableHiding: false,
        //     size: 100,
        //     cell: ({ row }) => {
        //         const { ipAddress } = row.original;
        //         if (!ipAddress) return <CellNoValue />;
        //         return <span className="font-mono opacity-90">{ipAddress.split(',')[0]}</span>;
        //     },
        // },
        {
            accessorKey: "target",
            enableSorting: true,
            header: t("auditLog.table.columns.targets"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const { targets } = row.original;
                if (targets.length === 0) return <CellNoValue />;
                return <div className="flex items-center flex-wrap gap-1 divide-x">
                    {targets.map((target, index) => (
                        <AuditTarget key={index} id={target.id} type={target.type} />
                    ))}
                </div>;
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
                    <AuditDetailsViewer details={details} />
                )
            },
        },
        // {
        //     accessorKey: "userAgent",
        //     enableSorting: true,
        //     header: t("auditLog.table.columns.userAgent"),
        //     enableHiding: false,
        //     cell: ({ row }) => {
        //         const { userAgent } = row.original;
        //         if (!userAgent) return <CellNoValue />;
        //         // show json
        //         return (
        //             <div className="line-clamp-1 text-xs">{userAgent}</div>
        //         )
        //     },
        // },

    ], [t]);

    return (
        <div className="flex flex-col gap-4 flex-grow">
            <DataTable
                title={t("Audits list") + " (" + (pagination?.total || data.length) + ")"}
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
            
            {pagination && pagination.totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {t("common.pagination.page", { defaultValue: "Page" })} {pagination.currentPage} {t("common.pagination.of", { defaultValue: "of" })} {pagination.totalPages}
                                {" "}
                                <span className="text-gray-400">
                                    ({t("common.pagination.total", { defaultValue: "Total" })}: {pagination.total})
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1 || isLoading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    {t("common.pagination.previous", { defaultValue: "Previous" })}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages || isLoading}
                                >
                                    {t("common.pagination.next", { defaultValue: "Next" })}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
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