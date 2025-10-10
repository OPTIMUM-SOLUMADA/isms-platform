import { FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Eye, FileText, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DocumentReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReviewItemProps {
    item: DocumentReview
}

const ReviewItem: FC<ReviewItemProps> = ({ item }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Link to={`/review-approval/${item.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex-1">
                            {/* Title & Description */}
                            <h3 className="font-semibold text-lg mb-1">
                                {item.document.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                                {item.document.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>
                                        {t("review.reviewer")}: {item.reviewer.name}
                                    </span>
                                </div>
                                {item.reviewDate && (
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {t("review.due")}:{" "}
                                            {new Date(item.reviewDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-1">
                                    <FileText className="h-4 w-4" />
                                    <span>{item.document.versions[0]?.version}</span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-3 px-2 py-1 bg-gray-200 rounded">
                                <p className="font-medium text-gray-700">
                                    {t("review.comment")}:
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.comment || "No comments yet"}
                                </p>
                            </div>

                            {/* ISO Clause */}
                            <div>
                                <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                                    {item.document.isoClause.code} -{" "}
                                    {item.document.isoClause.name}
                                </span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-stretch space-y-2 w-40 mt-10">
                            <Button disabled className="h-50">
                                {item.status === "IN_REVIEW"
                                    ? t("review.inProgress")
                                    : item.status === "APPROVED"
                                        ? t("review.approved")
                                        : item.status === "EXPIRED"
                                            ? t("review.rejected")
                                            : t("review.pending")}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => navigate(`/documents/review/${item.documentId}`)}
                            >
                                <Eye className="h-4 w-4 mr-1" />
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
