import { createContext, useContext, ReactNode } from "react";
import type { ISOClause } from "@/types";
import { isoClauseService } from "@/services/isoClauseService";
import { useQuery } from "@tanstack/react-query";

// Define shape of context
interface ISOClauseContextType {
    clauses: ISOClause[];
    loading: boolean;
    error: string | null;
    refetchClauses: () => Promise<any>;
}

// Create context
const ISOClauseContext = createContext<ISOClauseContextType | undefined>(undefined);

// Provider
export const ISOClauseProvider = ({ children }: { children: ReactNode }) => {

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<ISOClause[], Error>({
        queryKey: ["isoClauses"],
        queryFn: async () => {
            const res = await isoClauseService.list({ limit: 1000, page: 1 });
            return res.data;
        },
        staleTime: 1000 * 60, // cache data for 1 min
    });

    return (
        <ISOClauseContext.Provider
            value={{
                clauses: data ?? [],
                loading: isLoading,
                error: isError ? error.message : null,
                refetchClauses: refetch,
            }}
        >
            {children}
        </ISOClauseContext.Provider>
    );
};

// Custom hook
export const useISOClause = (): ISOClauseContextType => {
    const context = useContext(ISOClauseContext);
    if (!context) {
        throw new Error("useISOClause must be used within ISOClauseProvider");
    }
    return context;
};
