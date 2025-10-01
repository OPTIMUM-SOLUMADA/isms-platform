import { useFetchDepartments } from "@/hooks/queries/useDepartmentMutations";
import { useFetchDocumentTypes } from "@/hooks/queries/useDocumentTypeMutations";
import { useFetchISOClauses } from "@/hooks/queries/useISOClauseMutations";
import { useFetchOwners } from "@/hooks/queries/useOwnerMutations";
import { useFetchUsers } from "@/hooks/queries/useUserMutations";

export function DataInitializer() {
    useFetchDepartments();
    useFetchDocumentTypes();
    useFetchISOClauses();
    useFetchUsers();
    useFetchOwners();

    return null;
}
