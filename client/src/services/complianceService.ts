import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { ComplianceClause } from "@/types";

const api = API_CONFIG.ENDPOINTS.COMPLIANCE;

export const ComplianceService = {
  // -----------------------------
  // Get all compliance clauses
  // -----------------------------
  getClauses: () => axios.get<ComplianceClause[]>(api.LIST()),

  // -----------------------------
  // Get a single compliance clause by ID
  // -----------------------------
  getClauseById: (id: string) => axios.get<ComplianceClause>(api.GET(id)),

  // -----------------------------
  // Create a new compliance clause
  // -----------------------------
  createClause: (data: Partial<ComplianceClause>) =>
    axios.post<ComplianceClause>(api.CREATE(), data),

  // -----------------------------
  // Update a compliance clause
  // -----------------------------
  updateClause: (id: string, data: Partial<ComplianceClause>) =>
    axios.put<ComplianceClause>(api.UPDATE(id), data),

  // -----------------------------
  // Delete a compliance clause
  // -----------------------------
  deleteClause: (id: string) => axios.delete(api.DELETE(id)),
};

export default ComplianceService;
