import React, { memo, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Eye, FilePlus, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import type { Document } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/use-permissions";
import { UserAvatar } from "@/components/user-avatar";
import { UserHoverCard } from "../../users/hovercard/UserHoverCard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getFileIconByName } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { documentStatusColors } from "@/constants/color";
import DownloadDocument from "../actions/DownloadDocument";
import PublishDocument from "../actions/PublishDocument";
import { documentStatus } from "@/constants/document";
import UnpublishDocument from "@/templates/documents/actions/UnpublishDocument";
import { formatDate } from "@/lib/date";
import { useDocumentUI } from "@/stores/document/useDocumentUi";

interface DocumentActionsCell {
    doc: Document;
    onDelete?: (user: Document) => Promise<boolean>;
    onView?: (user: Document) => void;
}

const DocumentActionsCell = memo(({ doc, onView }: DocumentActionsCell) => {
    const { t } = useTranslation();
    const { hasActionPermission, hasActionPermissions } = usePermissions();
    const navigate = useNavigate();
    const { openDelete, setCurrentDocument } = useDocumentUI();

    const handleDelete = async () => {
        setCurrentDocument(doc);
        openDelete();
    };

    const handleOpenEdit = async () => {
        navigate(`edit/${doc.id}`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={!hasActionPermissions(["user.read", "user.update", "user.delete"])}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {hasActionPermission("user.read") && (
                        <DropdownMenuItem onClick={() => onView?.(doc)}>
                            <Eye className="mr-2 h-4 w-4" /> {t("user.table.actions.view")}
                        </DropdownMenuItem>
                    )}
                    {hasActionPermission("user.update") && (
                        <DropdownMenuItem onClick={handleOpenEdit}>
                            <Edit className="mr-2 h-4 w-4" /> {t("user.table.actions.edit")}
                        </DropdownMenuItem>
                    )}
                    {hasActionPermission("user.delete") && (
                        <DropdownMenuItem className="text-theme-danger" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> {t("user.table.actions.delete")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
});

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: Document[];
    onEdit?: (user: Document) => Promise<void>;
    onDelete?: (user: Document) => Promise<boolean>;
    onView?: (user: Document) => void;
    onCreateNewDocument: () => void;
    isLoading?: boolean;
}

const Table = ({
    data,
    onCreateNewDocument,
    onView,
    isLoading = false,
}: UserTableProps) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();

    // Define columns for UserTable
    const columns: ColumnDef<Document>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("document.table.columns.name"),
            enableHiding: false,
            size: 220,
            cell: ({ row }) => {
                const doc = row.original;
                const users = row.original.owners?.map((o) => o.user);
                return (
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:text-theme-2 hover:cursor-pointer relative group"
                        onClick={() => onView?.(doc)}
                    >
                        {getFileIconByName(doc.fileUrl!)}
                        <div className="text-sm ml-1 flex items-center line-clamp-1 whitespace-nowrap">
                            {doc.title}
                        </div>

                        <div className="absolute -bottom-2 flex items-center justify-center -space-x-2">
                            {users.slice(0, 2).map((user, index) => (
                                <UserHoverCard
                                    key={index}
                                    user={user}
                                    currentUserId={currentUser?.id}
                                    className=""
                                >
                                    <div className="flex items-center gap-2 group-hover:border-red-300">
                                        <UserAvatar className="size-4" id={user.id} name={user.name} />
                                    </div>
                                </UserHoverCard>
                            ))}

                            {users.length > 2 && (
                                <div className="size-4 relative z-10 rounded-full bg-gray-300 flex items-center justify-center text-xxs font-medium text-gray-700 border border-white">
                                    +{users.length - 2}
                                </div>
                            )}
                        </div>
                    </button>
                );
            },
        },
        {
            accessorKey: "type",
            enableSorting: true,
            header: t("document.table.columns.type"),
            cell: ({ row }) => {
                return <span>{row.original.type.name}</span>;
            },
        },
        {
            accessorKey: "isoClause",
            enableSorting: true,
            size: 180,
            header: t("document.table.columns.isoClause"),
            cell: ({ row }) => {
                return <span className="w-full text-center">{row.original.isoClause.code}</span>;
            },
        },
        {
            accessorKey: "status",
            enableSorting: true,
            header: t("document.table.columns.status"),
            cell: ({ row }) => {
                return <span className={cn("px-1 py-0.5 rounded", documentStatusColors[row.original.status.toLowerCase()])}>
                    {t(`common.document.status.${row.original.status.toLowerCase()}`)}
                </span>;
            },
        },
        {
            accessorKey: "version",
            enableSorting: true,
            size: 30,
            header: () => <span className="block text-center w-full">{t("document.table.columns.version")}</span>,
            cell: ({ row }) => {
                const currentVersion = row.original.versions?.find(v => v.isCurrent);

                return currentVersion ? (
                    <div className="w-full flex">
                        <Badge variant="outline" className="mx-auto">{currentVersion.version}</Badge>
                    </div>
                ) : (
                    <>-</>
                )
            },
        },
        {
            accessorKey: "reviewDue",
            enableSorting: true,
            header: () => <span className="w-full text-center">{t("document.table.columns.reviewDue")}</span>,
            cell: ({ row }) => {
                const date = row.original.nextReviewDate;
                return date ? (
                    <span className="text-center block">
                        {formatDate(date)}
                    </span>
                ) : null;
            },
        },
        {
            id: "actions",
            enableSorting: false,
            size: 40,
            header: () => <span className="block text-center w-full">{t("document.table.columns.actions")}</span>,
            cell: ({ row }) => {
                const doc = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {/* Download */}
                        <DownloadDocument
                            documentId={doc.id}
                        />
                        {/* Publish */}
                        {!doc.published ? (
                            <PublishDocument
                                documentId={doc.id}
                                className="normal-case w-28"
                                disabled={doc.status !== documentStatus.APPROVED}
                            >
                                {t("document.table.actions.publish")}
                            </PublishDocument>
                        ) : (
                            <UnpublishDocument
                                documentId={doc.id}
                                className="normal-case w-28"
                            >
                                {t("document.table.actions.unpublish")}
                            </UnpublishDocument>
                        )}
                        <DocumentActionsCell
                            doc={doc}
                            onView={onView}
                        />
                    </div>
                );
            },
            enableHiding: false,
        },
    ], [t, currentUser, onView]);

    return (
        <DataTable
            title={t("document.table.title")}
            columns={columns}
            data={data}
            searchableColumnId="name"
            enableRowSelection
            isLoading={isLoading}
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Files className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("document.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("document.table.empty.message")}</p>
                        <Button onClick={onCreateNewDocument}>
                            <FilePlus className="h-4 w-4 mr-2" />
                            {t("document.table.empty.actions.add.label")}
                        </Button>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
        />
    );
}

export const DocumentTable = React.memo(Table);