import { DocumentReview } from "@/types";
import { create } from "zustand";

type PendingReviewState = {
  reviews: DocumentReview[],
  setReviews: (reviews: DocumentReview[]) => void
};

const usePendingReviewStore = create<PendingReviewState>((set) => ({
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
}));

export default usePendingReviewStore