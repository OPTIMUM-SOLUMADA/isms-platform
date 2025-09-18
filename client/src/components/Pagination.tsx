import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export const Pagination = ({
    page,
    pageSize,
    totalCount,
    onPageChange,
}: {
    table: any;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}) => {
    const { t } = useTranslation();
    const pageCount = Math.ceil(totalCount / pageSize);

    const maxButtons = 5;

    const pages = getPageButtons(page, pageCount, maxButtons);

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                {t("components.table.pagination.previous")}
            </Button>
            {pages.map((p, idx) =>
                p === "…" ? (
                    <span key={idx} className="px-2">…</span>
                ) : (
                    <Button
                        key={p}
                        size="sm"
                        variant={p === page ? "default" : "outline"}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === pageCount}
            >
                {t("components.table.pagination.next")}
            </Button>
        </div>
    );
};

const getPageButtons = (currentPage: number, totalPages: number, maxButtons = 3) => {
    const pages: (number | "…")[] = [];

    if (totalPages <= maxButtons) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    }

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(currentPage + half, totalPages);

    // Adjust if near edges
    if (currentPage <= half) end = maxButtons;
    if (currentPage + half > totalPages) start = totalPages - maxButtons + 1;

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("…");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("…");
    if (end < totalPages) pages.push(totalPages);

    return pages;
};
