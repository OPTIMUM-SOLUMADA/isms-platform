import { ownerService } from "@/services/ownerService"
import useOwnerStore from "@/stores/owner/userOwnserStore";
import { ApiAxiosError } from "@/types/api";
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

export const useFetchOwners = () => {

    const { setOwners } = useOwnerStore();

    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["owners"],
        queryFn: async () => (await ownerService.list()).data
    });

    useEffect(() => {
        if (query.data) {
            setOwners(query.data.documentOwners || []);
        }
    }, [query.data, setOwners]);

    return query;
}