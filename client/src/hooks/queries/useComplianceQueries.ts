import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplianceService } from "@/services/complianceService";
import type { ApiAxiosError } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { ComplianceClause } from "@/types";

// -----------------------------
// Fetch all compliance clauses
// -----------------------------
export const useFetchCompliance = () => {
  const query = useQuery<ComplianceClause[], ApiAxiosError>({
    queryKey: ["compliance-clauses"],
    queryFn: () => ComplianceService.getClauses().then(res => res.data),
    staleTime: 1000 * 60 * 2,
  });

  return query;
};

// -----------------------------
// Get Compliance by ID
// -----------------------------
export const useGetCompliance = (id?: string) => {
  return useQuery<ComplianceClause, ApiAxiosError>({
    queryKey: ["compliance-clauses", id],
    queryFn: () => {
      if (!id) throw new Error("Clause ID is required");
      return ComplianceService.getClauseById(id).then(res => res.data);
    },
    enabled: !!id,
  });
};

// -----------------------------
// Create Compliance Clause
// -----------------------------
export const useCreateCompliance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ComplianceClause, ApiAxiosError, Partial<ComplianceClause>>({
    mutationFn: (data) => ComplianceService.createClause(data).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Clause created successfully", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["compliance-clauses"] });
    },
    onError: () => {
      toast({ title: "Failed to create clause", variant: "destructive" });
    },
  });
};

// -----------------------------
// Update Compliance Clause
// -----------------------------
export const useUpdateCompliance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ComplianceClause, ApiAxiosError, { id: string; data: Partial<ComplianceClause> }>({
    mutationFn: ({ id, data }) => ComplianceService.updateClause(id, data).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Clause updated successfully", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["compliance-clauses"] });
    },
    onError: () => {
      toast({ title: "Failed to update clause", variant: "destructive" });
    },
  });
};

// -----------------------------
// Delete Compliance Clause
// -----------------------------
export const useDeleteCompliance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, ApiAxiosError, { id: string }>({
    mutationFn: ({ id }) => ComplianceService.deleteClause(id).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Clause deleted successfully", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["compliance-clauses"] });
    },
    onError: () => {
      toast({ title: "Failed to delete clause", variant: "destructive" });
    },
  });
};
