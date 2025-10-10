import { FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Eye, FileText, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DocumentReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReviewStatus } from "@/lib/review";
import { Badge } from "@/components/ui/badge";
import { reviewStatusColors } from "@/constants/color";

interface ReviewItemProps {
    item: DocumentReview
}

const ReviewItem: FC<ReviewItemProps> = ({ item }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const status = getReviewStatus(item);

    const statusLabel =
        {
            IN_REVIEW: t("review.inProgress"),
            APPROVED: t("review.approved"),
            EXPIRED: t("review.rejected"),
            PENDING: t("review.pending"),
        }[status] || t("review.pending");

    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Link to={`/review-approval/${item.id}`}>
            <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 rounded-lg relative hover:cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                        {/* ================= LEFT SIDE ================= */}
                        <div className="flex-1 space-y-3">
                            {/* ---------- Title & Status ---------- */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                                <h3 className="font-semibold text-xl text-gray-800">
                                    {item.document.title}
                                </h3>
                                <Badge
                                    className={`absolute  right-2 top-2 text-sm px-3 py-1 ${reviewStatusColors[status]}`}
                                >
                                    {statusLabel}
                                </Badge>
                            </div>

                            {/* ---------- Description ---------- */}
                            {item.document.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.document.description}
                                </p>
                            )}

                            {/* ---------- Metadata ---------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">
                                        {t("review.reviewer")}:{" "}
                                        <span className="font-normal">{item.reviewer.name}</span>
                                    </span>
                                </div>

                                {formattedDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">
                                            {t("review.due")}:{" "}
                                            <span className="font-normal">{formattedDate}</span>
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">
                                        {t("review.version")}:{" "}
                                        <span className="font-normal">
                                            {item.document.versions[0]?.version || "v1"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                                        {item.document.isoClause.code} – {item.document.isoClause.name}
                                    </span>
                                </div>
                            </div>

                            {/* ---------- Comment ---------- */}
                            {item.isCompleted && item.comment && (
                                <div className="mt-3 border-l-4 border-gray-300 bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-700 italic">
                                        “{item.comment.trim()}”
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ================= RIGHT SIDE ================= */}
                        <div className="hidden flex-col items-stretch justify-between sm:justify-center space-y-3 w-full lg:w-44">
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/documents/review/${item.documentId}`);
                                }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                {t("review.button.viewDoc")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ReviewItem;
