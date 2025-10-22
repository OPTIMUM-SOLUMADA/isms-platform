import { FC, PropsWithChildren } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Eye, FileText, FileWarning, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DocumentReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReviewStatus } from "@/lib/review";
import { Badge } from "@/components/ui/badge";
import { reviewStatusColors } from "@/constants/color";
import HtmlContent from "@/components/HTMLContent";
import { EnvelopeClosedIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { UserHoverCard } from "../users/hovercard/UserHoverCard";
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/lib/date";

interface WrapperProps extends PropsWithChildren {
    condition: boolean;
    to: string;
}

const Wrapper = ({ condition, to, children }: WrapperProps) =>
    condition ? <Link to={to} draggable={false}>{children}</Link> : children;


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
            EXPIRED: t("review.expired"),
            PENDING: t("review.pending"),
            REJECTED: t("review.rejected"),
        }[status] || t("review.pending");

    const date = item.reviewDate || item.createdAt || new Date();
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Wrapper condition={!item.isCompleted} to={`/review-approval/${item.id}`} >
            <Card className="hover:shadow-lg from-white to-white hover:from-gray-50 hover:to-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-lg relative hover:cursor-pointer">
                <CardContent className="p-3">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                        <div className="text-muted-foreground shrink-0">
                            <FileWarning />
                        </div>
                        {/* ================= LEFT SIDE ================= */}
                        <div className="flex-1 space-y-3">
                            {/* ---------- Title & Status ---------- */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                                <h3 className="font-semibold text-base text-gray-800">
                                    {item.document?.title}
                                </h3>
                                <div className="d">
                                    <span className="text-sm text-gray-600">
                                        {formatDistanceToNow(item.reviewDate, { locale: getDateFnsLocale() })}
                                    </span>
                                    <Badge
                                        className={`absolute right-2 top-2 text-xs px-2 py-1 ${reviewStatusColors[status]}`}
                                    >
                                        {statusLabel}
                                    </Badge>
                                </div>
                            </div>

                            {/* ---------- Description ---------- */}
                            {item.document?.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.document?.description}
                                </p>
                            )}

                            {/* ---------- Metadata ---------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div className="font-medium flex items-center">
                                        {t("review.authors")}:{" "}
                                        {item.document?.authors.map((author, index) => (
                                            <UserHoverCard key={index} user={author.user} />
                                        ))}
                                    </div>
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
                                            {item.document?.versions[0]?.version || "v1"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                                        {item.document?.isoClause.code} – {item.document?.isoClause.name}
                                    </span>
                                </div>
                            </div>

                            {/* ---------- Comment ---------- */}
                            {item.isCompleted && item.comment && (
                                <Collapsible className="mt-3" asChild>
                                    <div
                                        className="p-3"
                                        draggable={false}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <button
                                                type="button"
                                                className="flex items-center w-full text-left text-sm text-orange-600 hover:text-gray-900 transition-colors"
                                            >
                                                <EnvelopeClosedIcon className="h-4 w-4 mr-2" />
                                                <span className="font-medium">Reviewer's Comment</span>
                                                <EnvelopeOpenIcon className="h-4 w-4 ml-auto opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
                                            </button>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="p-2 text-sm text-gray-600 border-l-4 border border-gray-300 bg-white">
                                            <HtmlContent html={item.comment} />
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
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
        </Wrapper>
    );
};

export default ReviewItem;
