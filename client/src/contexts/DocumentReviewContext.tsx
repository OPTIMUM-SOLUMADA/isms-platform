import { AddReviewFormData } from "@/templates/reviews/forms/AddReviewForm";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { documentReviewService } from "@/services/documentreviewService";
import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { ReviewItem } from "@/types";

type Viewer = {
  id: string;
  documentId: string;
  reviewerId: string;
  comment?: string;
  createdAt: Date;
};

type ViewerContextType = {
  viewers: ReviewItem[];
  isLoading: boolean;
  createViewer: (data: AddReviewFormData) => Promise<ReviewItem>;
  updateComment: (id: string, comment: string) => Promise<ReviewItem>;
  selectedViewer: ReviewItem | null;
  setSelectedViewer: (viewer: ReviewItem) => void;
};

const ViewerContext = createContext<ViewerContextType | undefined>(undefined);

export const ViewerProvider = ({ children }: { children: ReactNode }) => {
  const [viewers, setViewers] = useState<ReviewItem[]>([]);
  const [selectedViewer, _setSelectedViewer] = useState<ReviewItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: viewersResponse, refetch: refetchViewers } = useQuery<
    any,
    ApiAxiosError
  >({
    queryKey: ["viewers"],
    queryFn: async () => await documentReviewService.list(),
    refetchInterval: 15000,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (viewersResponse) {
      setViewers(viewersResponse.data);
      setIsLoading(false);
    }
  }, [viewersResponse]);

  const createViewerMutation = useMutation<
    any,
    ApiAxiosError,
    AddReviewFormData
  >({
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
    },
    [createViewerMutation]
  );


  const updateCommentMutation = useMutation<
    any,
    ApiAxiosError,
    { id: string; comment: string }
  >({
    mutationFn: async ({ id, comment }) => await documentReviewService.updateComment(id, comment),
    onSuccess: (res) => {
      setViewers((prev) => prev.map((viewer) => (
        viewer.id === res.data.id ? ({ ...viewer, comment: res.data.comment }) : viewer))
      );
    },
    onError: (err) => {
      console.error(err);
    }
  })

  const updateComment = useCallback(
    async (id: string, comment: string): Promise<ReviewItem> => {
      const res = await updateCommentMutation.mutateAsync({ id, comment });
      // setViewers((prev) => prev.map((viewer) => (
      //   viewer.id === res.data.id ? ({ ...viewer, comment: res.data.comment }) : viewer))
      // );
      return res.data; // ✅ renvoie bien un Viewer
    },
    [updateCommentMutation]
  );

  const setSelectedViewer = useCallback((viewer: ReviewItem) => {
    _setSelectedViewer(viewer);
  }, []);

  const values = useMemo(
    () => ({
      viewers,
      isLoading,
      fetchUsers: refetchViewers,
      createViewer,
      updateComment,
      selectedViewer,
      setSelectedViewer,
    }),
    [viewers, createViewer, updateComment, isLoading, refetchViewers, selectedViewer, setSelectedViewer]
  );

  return (
    <ViewerContext.Provider value={values}>{children}</ViewerContext.Provider>
  );
};

export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error("useViewer must be used within a ViewerProvider");
  }
  return context;
};
