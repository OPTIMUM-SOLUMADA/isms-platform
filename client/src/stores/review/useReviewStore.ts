import { create } from "zustand";
import type { DocumentReview } from "@/types";
import type { Pagination } from "@/types/pagination";

export type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
type Filter = {
    status: FilterStatus;
}

interface Reviewstate {
    reviews: DocumentReview[];
    setReviews: (reviews: DocumentReview[]) => void;
    filter: Filter;
    setFilter: (filter: Filter) => void;
    // Search
    query: string;
    setQuery: (query: string) => void;

    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;

}

const useReviewStore = create<Reviewstate>((set) => ({
    reviews: [],
    setReviews: (reviews) => set({ reviews }),
    // filter
    filter: { status: "ALL" },
    setFilter: (filter) => set({ filter }),

    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),

    query: '',
    setQuery: (query) => set({ query }),

}));

export default useReviewStore;