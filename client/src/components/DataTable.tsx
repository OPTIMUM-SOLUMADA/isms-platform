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
import { ChevronDown, ArrowUpDown, Trash2 } from "lucide-react";

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
    renderNoData
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
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
                        />
                    ),
                    cell: ({ row }) => (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                            className="translate-y-[2px]"
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
        <Card className={cn("w-full", className)}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {title && <CardTitle className="text-xl">{title}</CardTitle>}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {enableSearch && (
                        <Input
                            placeholder={searchableColumnId ? `Search ${searchableColumnId}...` : "Search..."}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-9 w-full sm:w-64"
                        />
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
                                Supprimer les {table.getFilteredSelectedRowModel().rows.length} sélectionnés
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    View <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table.getAllLeafColumns().map((column) => {
                                    // hide technical columns
                                    if (column.id === "_select") return null;
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id.replace(/_/g, " ")}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-2xl border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() && "cursor-pointer select-none",
                                                        "flex items-center gap-1"
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
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
                                        {renderNoData ? renderNoData() : "No results."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                        selected
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}