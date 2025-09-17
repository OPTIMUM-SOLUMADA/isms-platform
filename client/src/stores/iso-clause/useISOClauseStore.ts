


import { create } from "zustand";
import type { ISOClause } from "@/types";

interface IsoClausestate {
    isoClauses: ISOClause[];
    setIsoClauses: (docs: ISOClause[]) => void;

    isoClause: ISOClause | null;
    setIsoClause: (doc: ISOClause | null) => void;

    page: number;
    setPage: (page: number) => void;

    limit: number;
    setLimit: (limit: number) => void;
}

const useISOClauseStore = create<IsoClausestate>((set) => ({
    isoClauses: [],
    setIsoClauses: (docs) => set({ isoClauses: docs }),

    isoClause: null,
    setIsoClause: (doc) => set({ isoClause: doc }),

    page: 1,
    setPage: (page) => set({ page }),

    limit: 50,
    setLimit: (limit) => set({ limit }),
}));

export default useISOClauseStore;