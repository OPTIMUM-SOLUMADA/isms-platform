import { AuditService } from "@/services/auditService";
import { AuditLog } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchAudits = () => {
    return useQuery<AuditLog[], ApiAxiosError>({
        queryFn: async () => (await AuditService.getAll()).data,
        queryKey: ["audits"],
        staleTime: 1000 * 60 * 3
    });
};