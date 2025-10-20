import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileCheck, ScanEye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { DocumentReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { getReviewStatus } from "@/lib/review";
import { Badge } from "@/components/ui/badge";
import { reviewStatusColors } from "@/constants/color";
import { DueDateProgress } from "@/components/DueDateProgress";
import { cn } from "@/lib/utils";
import CellNoValue from "@/components/CellNoValue";
import useReviewStore from "@/stores/review/useReviewStore";
import DateLabel from "@/components/DateLabel";

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: DocumentReview[];
    onView?: (review: DocumentReview) => void;
    isLoading?: boolean;
}

const Table = ({
    data,
    onView,
    isLoading = false,
}: UserTableProps) => {
    const { t } = useTranslation();
    const { pagination, setPagination } = useReviewStore();

    // Define columns for UserTable
    const columns: ColumnDef<DocumentReview>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("review.table.columns.document"),
            size: 100,
            cell: ({ row }) => {
                const { document, documentVersion, decision } = row.original;
                if (!document) return;
                return (
                    <div className="flex gap-2 w-full items-center">
                        <div className="p-1">
                            <FileCheck className={cn("h-7 w-7 text-muted-foreground", !!decision && "text-green-600")} />
                        </div>
                        <div className="w-full space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="text-foreground">{document.title}</span>
                                {documentVersion && (
                                    <Badge variant="outline">{documentVersion.version}</Badge>
                                )}
                            </div>
                            <div className="items-center gap-2 text-muted-foreground hidden">
                                {t("review.table.columns.authors")}:
                                {document.authors?.map((author, index) => (
                                    <UserHoverCard key={index} user={author.user} className="w-fit flex-wrap" />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "reviewer",
            header: t("review.table.columns.reviewer"),
            size: 50,
            cell: ({ row }) => {
                const { reviewer } = row.original;
                if (!reviewer) return;
                return (
                    <UserHoverCard user={reviewer} />
                )
            },
        },
        {
            accessorKey: "status",
            header: t("review.table.columns.status"),
            size: 50,
            cell: ({ row }) => {
                const review = row.original;

                const status = getReviewStatus(review);

                const statusLabel = {
                    IN_REVIEW: t("review.inProgress"),
                    APPROVED: t("review.approved"),
                    EXPIRED: t("review.expired"),
                    PENDING: t("review.pending"),
                    REJECTED: t("review.rejected"),
                }[status] || t("review.pending");

                return (
                    <Badge
                        className={`${reviewStatusColors[status]}`}
                    >
                        {statusLabel}
                    </Badge>
                )
            },
        },
        // Due Date
        {
            accessorKey: "dueDate",
            header: t("review.table.columns.dueDate"),
            size: 50,
            cell: ({ row }) => {
                const { dueDate } = row.original;
                if (!dueDate) return;
                return (
                    <DateLabel date={dueDate} />
                );
            },
        },
        {
            accessorKey: "progression",
            header: t("review.table.columns.dueDateProgress"),
            size: 120,
            cell: ({ row }) => {
                const { createdAt, dueDate, decision } = row.original;
                if (!dueDate || !createdAt) return;
                if (decision) return <CellNoValue />;
                return (
                    <div className="w-full pr-2">
                        <DueDateProgress
                            createdAt={createdAt}
                            dueDate={dueDate}
                        />
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: t("review.table.columns.actions"),
            size: 50,
            cell: ({ row }) => {
                const review = row.original;
                return (
                    <Button type="button" variant="outline" size="sm" onClick={() => onView?.(review)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t("review.table.actions.view")}
                    </Button>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [onView, t]);

    return (
        <DataTable
            title={t("review.table.title")}
            columns={columns}
            data={data}
            searchableColumnId="name"
            renderNoData={() => (
                <Card className="shadow-none flex-grow bg-none border-none">
                    <CardContent className="p-12 text-center">
                        <ScanEye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("review.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("review.table.empty.message")}</p>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
            isLoading={isLoading}
            // pagination
            page={pagination.page}
            pageSize={pagination.limit}
            totalCount={pagination.totalPages}

            onPageChange={(page) => setPagination({ ...pagination, page })}
        />
    );
}

export const ReviewTable = React.memo(Table);