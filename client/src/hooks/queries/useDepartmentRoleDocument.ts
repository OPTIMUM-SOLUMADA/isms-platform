import { departmentRoleDocumentService } from "@/services/departmentRoleDocumentService"
import { DepartmentRoleDocument } from "@/types"
import { ApiAxiosError } from "@/types/api"
import { useQuery } from "@tanstack/react-query"


export const useFetchDepartmentRoleDocuments = () => {
    return useQuery<DepartmentRoleDocument[], ApiAxiosError>({
        queryKey: ["department-role-documents"],
        queryFn: async () => (await departmentRoleDocumentService.getAll()).data
    })
}