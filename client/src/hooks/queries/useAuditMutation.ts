import { AuditService } from "@/services/auditService";
import { AuditLog } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchAudits = (filter?: any) => {
  return useQuery<AuditLog[], ApiAxiosError>({
    queryFn: async () => (await AuditService.getAll()).data,
    queryKey: ["audits", filter],
    staleTime: 1000 * 60,
  });
};

// get stats
type Stats = {
  total: number;
  success: number;
  failure: number;
  today: number;
};

export const useFetchStats = () => {
  return useQuery<Stats, ApiAxiosError>({
    queryFn: async () => (await AuditService.getStats()).data,
    queryKey: ["stats"],
    staleTime: 1000 * 60,
  });
};

export const useExportAudits = () => {
  return useMutation<Blob, ApiAxiosError, { filter?: any }>({
    mutationFn: async (payload) => {
      const response = await AuditService.exportExcel(payload.filter);
      return response.data;
    },
  });
};
