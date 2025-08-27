import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Users, Eye, FilePlus, FileSpreadsheet } from "lucide-react";
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
import { DeleteDialog } from "@/components/DeleteDialog";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/use-permissions";
import { UserAvatar } from "@/components/user-avatar";
import You from "@/components/You";
import { UserHoverCard } from "../hovercard/UserHoverCard";
import { useDocument } from "@/contexts/DocumentContext";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface DocumentActionsCell {
    doc: Document;
    onEdit?: (user: Document) => Promise<void>;
    onDelete?: (user: Document) => Promise<boolean>;
    onView?: (user: Document) => void;
}

const DocumentActionsCell = ({ doc, onEdit, onView }: DocumentActionsCell) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const { hasActionPermission, hasActionPermissions } = usePermissions();
    const { deleteDocument } = useDocument();

    const handleDelete = async () => {
        await deleteDocument({ id: doc.id });
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
                        <DropdownMenuItem onClick={() => onEdit?.(doc)}>
                            <Edit className="mr-2 h-4 w-4" /> {t("user.table.actions.edit")}
                        </DropdownMenuItem>
                    )}
                    {hasActionPermission("user.delete") && (
                        <DropdownMenuItem className="text-red-600" onClick={() => setOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" /> {t("user.table.actions.delete")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteDialog
                entityName={doc.title}
                open={open}
                onOpenChange={setOpen}
                onConfirm={handleDelete}
            />
        </>
    );
};

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: Document[];
    onEdit?: (user: Document) => Promise<void>;
    onDelete?: (user: Document) => Promise<boolean>;
    onCreateNewDocument: () => void;
    isLoading?: boolean;
}

const Table = ({
    data,
    onCreateNewDocument,
    isLoading = false,
}: UserTableProps) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    // Define columns for UserTable
    const columns: ColumnDef<Document>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("document.table.columns.name"),
            enableHiding: false,
            cell: ({ row }) => {
                const doc = row.original;
                return (
                    <button
                        type="button"
                        className="flex items-center gap-3 hover:text-theme-2 hover:cursor-pointer"
                        onClick={() => navigate(`/document/view/${doc.id}`)}
                    >
                        <FileSpreadsheet className="size-6 flex-shrink-0 text-theme" />
                        <div className="text-sm flex items-center line-clamp-1 whitespace-nowrap">
                            {doc.title}
                        </div>
                    </button>
                );
            },
        },
        {
            accessorKey: "owner",
            enableSorting: true,
            header: t("document.table.columns.owner"),
            cell: ({ row }) => {
                const user = row.original.owner;
                return (
                    <UserHoverCard
                        user={user}
                        currentUserId={currentUser?.id}>
                        <div className="flex items-center gap-2 group-hover:bg-red-300">
                            <UserAvatar className="size-6" id={user.id} name={user.name} />
                            <div className="font-medium ">
                                {user.name} {currentUser?.id === user.id && <You />}
                            </div>
                        </div>
                    </UserHoverCard>
                )
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
            header: t("document.table.columns.isoClause"),
            cell: ({ row }) => {
                return <span>{row.original.isoClause.name}</span>;
            },
        },
        {
            accessorKey: "status",
            enableSorting: true,
            header: t("document.table.columns.status"),
            cell: ({ row }) => {
                return <span>{row.original.status}</span>;
            },
        },
        {
            accessorKey: "version",
            enableSorting: true,
            header: t("document.table.columns.version"),
            cell: ({ row }) => {
                const currentVersion = row.original.versions?.find(v => v.isCurrent);

                return currentVersion ? (
                    <Badge variant="outline">{currentVersion.version}</Badge>
                ) : (
                    <>-</>
                )
            },
        },
        {
            accessorKey: "reviewDue",
            enableSorting: true,
            header: t("document.table.columns.reviewDue"),
            cell: ({ row }) => {
                return <span>{row.original.nextReviewDate}</span>;
            },
        },
        {
            id: "actions",
            header: t("document.table.columns.actions"),
            cell: ({ row }) => {
                const doc = row.original;
                return (
                    <DocumentActionsCell
                        doc={doc}
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [t, currentUser]);

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
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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