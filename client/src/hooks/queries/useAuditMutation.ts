import { AuditService } from "@/services/auditService";
import { AuditLog } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchAudits = () => {
    return useQuery<AuditLog[], ApiAxiosError>({
        queryFn: async () => (await AuditService.getAll()).data,
        queryKey: ["audits"],
        staleTime: 1000 * 60,
    });
};

// get stats
type Stats = {
    total: number;
    success: number;
    failure: number;
    today: number;
}

export const useFetchStats = () => {
    return useQuery<Stats, ApiAxiosError>({
        queryFn: async () => (await AuditService.getStats()).data,
        queryKey: ["stats"],
        staleTime: 1000 * 60,
    });
};