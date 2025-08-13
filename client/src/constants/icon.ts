import { AlertTriangle, CheckCircle, Clock, GitBranch, XCircle } from "lucide-react";

export const documentStatusIcons = {
    draft: Clock,
    review: AlertTriangle,
    approved: CheckCircle,
    expired: AlertTriangle
};

export const reviewStageIcons = {
    pending: Clock,
    'in-review': GitBranch,
    approved: CheckCircle,
    rejected: XCircle
};
