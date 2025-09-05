import { AddReviewFormData } from "@/templates/forms/Review/AddReviewForm";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { documentReviewService } from "@/services/documentreviewService";
import { createContext, useState, ReactNode, useCallback, useMemo, useContext, useEffect } from "react";
import { users } from "@/mocks/user";

type Viewer = {
  id: string;
  documentId: string;
  reviewerId: string;
  comment?: string;
  createdAt: Date;
};

type ViewerContextType = {
  viewers: Viewer[];
  isLoading: boolean;

  createViewer: (data: AddReviewFormData) => Promise<Viewer>;
  selectedViewer: Viewer | null;
  setSelectedViewer: (viewer: Viewer) => void;
};

const ViewerContext = createContext<ViewerContextType | undefined>(undefined);

export const ViewerProvider = ({ children }: { children: ReactNode }) => {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [selectedViewer, _setSelectedViewer] = useState<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: viewersResponse, refetch: refetchViewers } = useQuery<any, ApiAxiosError>({
      queryKey: ['viewers'],
      queryFn: async () => await documentReviewService.list(),
      refetchInterval: 15000,
      staleTime: 1000 * 60,
  })

  useEffect(() => {
    if (viewersResponse) {
      setViewers(viewersResponse.data);
      setIsLoading(false);
    }
  }, [viewersResponse])

  const createViewerMutation = useMutation<any, ApiAxiosError, AddReviewFormData>({
      mutationFn: async (data) => await documentReviewService.create(data),
      onSuccess: (res) => {
          setViewers((prev) => [...prev, res.data]);
      },
      onError: (err) => {
          console.error(err);
      },
  });

  const createViewer = useCallback(
    async (data: AddReviewFormData): Promise<Viewer> => {
      const res = await createViewerMutation.mutateAsync(data);
      setViewers((prev) => [...prev, res.data]);
      return res.data; // ✅ renvoie bien un Viewer
    }, [createViewerMutation]
  )

  const  setSelectedViewer = useCallback((viewer: Viewer) => {
    _setSelectedViewer(viewer);
  }) 
  // async (
  //   data: Omit<Viewer, "id" | "createdAt">
  // ): Promise<Viewer> => {
  //   console.log("data", data);
    
  //   // ⚡ Ici tu peux remplacer par un appel API vers ton backend
  //   const newViewer: Viewer = {
  //     ...data,
  //     id: Math.random().toString(36).substring(2, 9),
  //     createdAt: new Date(),
  //   };

  //   setViewers((prev) => [...prev, newViewer]);

  //   return newViewer;
  // };
  const values = useMemo(
    () => ({
      viewers,
      isLoading,
      fetchUsers: refetchViewers,
      createViewer,
      setSelectedViewer
    })
    , [viewers, createViewer]
  );

  return (
    <ViewerContext.Provider value={values}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error("useViewer must be used within a ViewerProvider");
  }
  return context;
};
