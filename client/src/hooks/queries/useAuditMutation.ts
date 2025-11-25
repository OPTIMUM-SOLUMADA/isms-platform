import { downloadBlob } from "@/lib/download";
import { AuditService } from "@/services/auditService";
import { AuditLog } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchAudits = (filter?: any) => {
  return useQuery<{ data: AuditLog[], total: number, page: number, totalPages: number, events: string[]}, ApiAxiosError>({
    queryFn: async () => (await AuditService.getAll(filter)).data,
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
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { filter?: any }>({
    mutationFn: async (payload) => await AuditService.exportExcel(payload.filter),

    onSuccess: (res) => {
      console.log('exported', res);
      const disposition = res.headers["content-disposition"];
      downloadBlob(res.data, disposition);
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    }
  });
};
