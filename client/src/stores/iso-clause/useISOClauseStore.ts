


import { create } from "zustand";
import type { ISOClause } from "@/types";
import { Pagination } from "@/types/pagination";

interface IsoClausestate {
    isoClauses: ISOClause[];
    setIsoClauses: (docs: ISOClause[]) => void;

    isoClause: ISOClause | null;
    setIsoClause: (doc: ISOClause | null) => void;

    query: string;
    setQuery: (page: string) => void;

    // CRUD
    push: (doc: ISOClause) => void;
    replace: (id: string, newDoc: ISOClause) => void;
    remove: (id: string) => void;

    // pagination
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
}

const useISOClauseStore = create<IsoClausestate>((set) => ({
    isoClauses: [],
    setIsoClauses: (docs) => set({ isoClauses: docs }),

    isoClause: null,
    setIsoClause: (doc) => set({ isoClause: doc }),

    query: '',
    setQuery: (query) => set({ query }),

    push: (doc) => set((state) => ({ isoClauses: [...state.isoClauses, doc] })),
    replace: (id, newDoc) => set((state) => ({ isoClauses: state.isoClauses.map((doc) => (doc.id === id ? newDoc : doc)) })),
    remove: (id) => set((state) => ({ isoClauses: state.isoClauses.filter((doc) => doc.id !== id) })),

    pagination: { page: 1, limit: 11, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),
}));

export default useISOClauseStore;