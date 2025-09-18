import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    VisibilityState,
} from "@tanstack/react-table";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowUpDown, Trash2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import TableSkeletonRow from "./TableSkeletonRow";

// ============================================================================
// Reusable DataTable
// ----------------------------------------------------------------------------
// A generic, column-driven table using @tanstack/react-table and shadcn/ui.
// Features: sorting, pagination, global search, column visibility, row selection.
// ============================================================================

export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** Optional: Which column id to bind the top-right search box to (global if omitted) */
    searchableColumnId?: string;
    /** Optional: initial page size (default 10) */
    pageSize?: number;
    /** Optional: enable checkbox row selection */
    enableRowSelection?: boolean;
    /** Optional: controlled className */
    className?: string;
    /** Optional: search field */
    enableSearch?: boolean;
    title?: string;
    renderNoData?: () => React.ReactNode;
    renderSelectionHeader?: (selectedIds: string[]) => React.ReactNode;
    isLoading?: boolean;

};

export function DataTable<TData, TValue>({
    title,
    columns,
    data,
    searchableColumnId,
    pageSize = 10,
    enableRowSelection = false,
    enableSearch = false,
    className,
    isLoading = false,
    renderNoData
}: DataTableProps<TData, TValue>) {
    const { t } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable<TData>({
        data,
        columns: enableRowSelection
            ? ([
                {
                    id: "_select",
                    header: ({ table }) => (
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                            className="translate-y-[2px]"
                            title={t("components.table.selection.selectAll")}
                        />
                    ),
                    cell: ({ row }) => (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                            className="translate-y-[2px]"
                            title={t("components.table.selection.select")}
                        />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                    size: 48,
                },
                ...columns,
            ])
            : columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize },
        },
        meta: {
            label: ""
        }
    });

    const onSearchChange = (value: string) => {
        if (searchableColumnId) {
            table.getColumn(searchableColumnId)?.setFilterValue(value);
        } else {
            setGlobalFilter(value);
        }
    };

    const searchValue = searchableColumnId
        ? (table.getColumn(searchableColumnId)?.getFilterValue() as string) ?? ""
        : globalFilter;

    return (
        <Card className={cn("w-full flex flex-col shadow-none", className)}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {title && <CardTitle className="text-base text-muted-foreground">{title}</CardTitle>}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {enableSearch && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t("components.table.search.placeholder")}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 w-full sm:w-64"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {table.getFilteredSelectedRowModel().rows.length > 0 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => table.resetRowSelection()}
                                className="h-8"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("components.table.actions.deleteSelected.label", {
                                    count: table.getFilteredSelectedRowModel().rows.length
                                })}
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 h-9">
                                    {t("components.table.actions.toggleColumns.placeholder")}{" "}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {t("components.table.actions.toggleColumns.label")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {table.getAllLeafColumns().map((column) => {
                                    if (column.id === "_select") return null;

                                    const label =
                                        (typeof column.columnDef.header === "function"
                                            ? column.columnDef.header(table.getHeaderGroups()[0].headers[0].headerGroup.headers[0].getContext())
                                            : column.columnDef.header) ?? column.id;

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="flex items-center gap-2"
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            onSelect={(event) => event.preventDefault()}
                                            checked={column.getIsVisible()}
                                        >
                                            <span>{label}</span>
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col flex-grow">
                <div className="rounded-lg border overflow-hidden flex flex-col flex-grow bg-white">
                    <div className="flex-grow overflow-auto rounded-lg flex flex-col">
                        <Table className={cn("w-full", !table.getRowModel().rows?.length && "grow")}>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} style={{ width: header.getSize() }}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={cn(
                                                            header.column.getCanSort() && "cursor-pointer select-none",
                                                            "flex items-center justify-between gap-1"
                                                        )}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {header.column.getCanSort() ? (
                                                            <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                                                        ) : null}
                                                    </div>
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="bg-muted/40">
                                {isLoading ? (
                                    Array.from({ length: 8 }).map((_, idx) => (
                                        <TableSkeletonRow key={idx} headers={table.getHeaderGroups()[0].headers} />
                                    ))
                                ) : (
                                    table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={cn("bg-white")}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={table.getAllLeafColumns().length} className="h-full text-center ali">
                                                {renderNoData ? renderNoData() : t("components.table.empty.title")}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        {t("components.table.selection.selected", {
                            count: table.getFilteredSelectedRowModel().rows.length,
                            total: table.getFilteredRowModel().rows.length,
                        })}
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            {t("components.table.pagination.previous")}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            {t("components.table.pagination.next")}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}