import { AlertTriangle, CheckCircle, Clock, GitBranch, XCircle } from "lucide-react";

export const documentStatusIcons = {
  DRAFT: Clock,
  REVIEW: AlertTriangle,
  APPROVED: CheckCircle,
  EXPIRED: AlertTriangle,
};

export const reviewStageIcons = {
  PENDING: Clock,
  IN_REVIEW: GitBranch,
  APPROVED: CheckCircle,
  EXPIRED: XCircle,
};
