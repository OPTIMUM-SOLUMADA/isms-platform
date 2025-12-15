import { useAuth } from "@/contexts/AuthContext";
import { documentReviewService } from "@/services/documentreviewService";
import useReviewStore from "@/stores/review/useReviewStore";
import { DocumentReview, ReviewDecision } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash";
import { useEffect } from "react";

export const useFetchReviews = () => {
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["reviews"],
    queryFn: async () => (await documentReviewService.list()).data,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60,
  });
};

type FetchMyReviewResponse = {
  reviews: DocumentReview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const useFetchMyReviews = () => {
  const { user } = useAuth();
  const { pagination, setPagination, setReviews, filter } = useReviewStore();

  const query = useQuery<FetchMyReviewResponse, ApiAxiosError>({
    queryKey: [
      "reviews",
      user?.id,
      pagination.limit,
      pagination.page,
      filter.status,
    ],
    queryFn: async () =>
      (
        await documentReviewService.getMyReviews(user!.id, {
          ...pagination,
          status: filter.status,
        })
      ).data,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60,
    enabled: !!user,
  });

  useEffect(() => {
    if (query.data) {
      setReviews(query.data.reviews);
      const { pagination: newP } = query.data;
      if (!isEqual(pagination, newP)) {
        setPagination(newP);
      }
    }

    return () => {
      setReviews([]);
    };
  }, [query.data, setReviews, pagination, setPagination]);

  return query;
};

type ReviewStats = {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  expired: number;
};

export const useGetReviewStats = () => {
  const { user } = useAuth();
  return useQuery<ReviewStats, ApiAxiosError>({
    queryKey: ["reviewStats", user?.id],
    queryFn: async () =>
      (await documentReviewService.getMyReviewsStats(user!.id)).data,
    enabled: !!user,
    staleTime: 1000 * 60,
  });
};

export const useGetReview = (id: string | undefined) =>
  useQuery<DocumentReview, ApiAxiosError>({
    queryKey: ["reviews", id],
    queryFn: async () => (await documentReviewService.findById(id!)).data,
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });

export const useSubmitReview = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    ApiAxiosError,
    { decision: ReviewDecision; comment: string }
  >({
    mutationFn: async (payload) =>
      documentReviewService.submitReview(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["other-reviews"] });
    },
  });
};

export const usePatchDocumentReview = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    ApiAxiosError,
    { reviewId: string; patchedVersion: string; userId: string; comment: string; }
  >({
    mutationFn: async (payload) =>
      documentReviewService.patchDocumentReview(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
};

export const useUpdateComment = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { comment: string }>({
    mutationFn: async (payload) =>
      documentReviewService.updateComment(id!, payload.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
};

export const useFetchPendingReviews = () => {
  const { user } = useAuth();
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["pending-reviews", user.id],
    queryFn: async () => (await documentReviewService.getPendingReviews(user.id)).data,
  });
};

export const useMarkAsCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { id: string, userId: string; }>({
    mutationFn: async (payload) =>
      documentReviewService.markAsCompleted(payload.id, payload.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["other-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews-due-soon"] });
      queryClient.invalidateQueries({ queryKey: ["my-expired-and-reviews-due-soon"] });
    },
  });
};

export const useOtherUsersReviews = ({ documentId, versionId }: { documentId?: string, versionId?: string }) => {
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["other-reviews", documentId, versionId],
    queryFn: async () =>
      (await documentReviewService.getOtherUsersReviews(documentId!, versionId!)).data,
    enabled: !!documentId && !!versionId,
  });
}

export const useGetMyReviewsDueSoon = () => {
  const { user } = useAuth();
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["my-reviews-due-soon", user?.id],
    queryFn: async () =>
      (await documentReviewService.getMyReviewsDueSoon(user!.id)).data,
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useGetMyExpiredReviewsAndReviewsDueSoon = () => {
  const { user } = useAuth();
  return useQuery<
    { expired: DocumentReview[]; dueSoon: DocumentReview[] },
    ApiAxiosError
  >({
    queryKey: ["my-expired-and-reviews-due-soon", user?.id],
    queryFn: async () =>
      (await documentReviewService.getExpiredAndDueSoonReviews(user!.id)).data,
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useGetSubmittedReviewByDocument = (documentId: string) => {
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["submitted-review", documentId],
    queryFn: async () =>
      (await documentReviewService.getSubmittedReviews(documentId)).data,
    enabled: !!documentId,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useGetCompletedReviewByDocument = (documentId: string) => {
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["completed-review", documentId],
    queryFn: async () =>
      (await documentReviewService.getCompletedReviews(documentId)).data,
    enabled: !!documentId,
    refetchInterval: 4 * 60 * 1000,
  });
};

export const useGetExpiredReviewsByUser = () => {
  const { user } = useAuth();
  return useQuery<DocumentReview[], ApiAxiosError>({
    queryKey: ["expired-reviews", user?.id],
    queryFn: async () =>
      (await documentReviewService.getExpiredReviews(user?.id)).data,
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000,
  });
};
