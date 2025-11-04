import { useEffect, useMemo, useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useGetMyExpiredReviewsAndReviewsDueSoon } from '@/hooks/queries/useReviewMutation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { getDateFnsLocale } from '@/lib/date';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { DueDateProgress } from '@/components/DueDateProgress';
import { DocumentReview } from '@/types';
import { cn } from '@/lib/utils';

export default function ReviewsAlertDrawer() {
    const [open, setOpen] = useState(false);

    const { data, isLoading, isSuccess } = useGetMyExpiredReviewsAndReviewsDueSoon();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const shouldOpenAlert = useMemo(() => {
        if (!data) return false;
        return data.dueSoon.length > 0 || data.expired.length > 0;
    }, [data]);

    useEffect(() => {
        if (shouldOpenAlert && isSuccess) {
            setOpen(true);
        }
    }, [isSuccess, shouldOpenAlert]);

    function handleNavigateToReview(id: string) {
        // close drawer
        setOpen(false);
        navigate(`/review-approval/${id}`)
    }

    function handleSeeReviews() {
        setOpen(false);
        navigate({
            pathname: "/reviews",
            search: createSearchParams({
                tab: "PENDING",
            }).toString()
        });
    }

    function handleSeeExpiredReviews() {
        setOpen(false);
        navigate({
            pathname: "/reviews",
            search: createSearchParams({
                tab: "EXPIRED",
            }).toString()
        });
    }

    if (isLoading) {
        return null;
    }

    if (!data) return null;

    const total = data.dueSoon.length + data.expired.length;

    return (
        <Drawer open={open} onOpenChange={setOpen} direction='bottom'>
            <DrawerContent className='outline-none border-none ml-auto max-w-lg rounded-t-[40px]'>
                <div className="flex flex-col grow mx-auto max-w-fullh-full">

                    <DrawerHeader>
                        <DrawerTitle>{t("reviewsAlert.title")} ({total})</DrawerTitle>
                        <DrawerDescription>{t("reviewsAlert.subtitle")}</DrawerDescription>
                    </DrawerHeader>

                    {/* Expired review */}
                    {data.expired.length > 0 && (
                        <div className="space-y-0">
                            <div className="flex items-center justify-between p-5">
                                <h2 className="text-theme-2 font-semibold text-sm">{t("reviewsAlert.expiredReviews.title")} ({data.expired.length})</h2>

                                {pathname !== "/reviews" && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleSeeExpiredReviews}
                                        size='sm'
                                    >
                                        {t("expiredReviews.actions.viewAll.label")}
                                        <ArrowRight className='ml-2 w-4 h-4' />
                                    </Button>
                                )}
                            </div>
                            <ScrollArea className={cn(
                                "flex-1 max-h-[250px] overflow-auto bg-gray-100 !scroll-py-5 px-5",
                                data.dueSoon.length === 0 && "max-h-[600px]"
                            )}>
                                <div className="grid grid-cols-1 gap-3">
                                    {data.expired.map((review) => (
                                        <ExpiredReviewItem key={review.id} review={review} onViewClick={handleNavigateToReview} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <div className="w-full my-2 px-5">
                        <hr className='' />
                    </div>

                    {/* Due soon review */}
                    {data.dueSoon.length > 0 && (
                        <div className="space-y-0">
                            <div className="flex items-center justify-between p-5">
                                <h2 className="text-theme-2 font-semibold text-sm">{t("reviewsAlert.upcomingReviews.title")} ({data.dueSoon.length})</h2>
                                {pathname !== "/reviews" && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleSeeReviews}
                                        size='sm'
                                    >
                                        {t("reviewsAlert.upcomingReviews.actions.viewAll.label")}
                                        <ArrowRight className='ml-2 w-4 h-4' />
                                    </Button>
                                )}
                            </div>
                            <ScrollArea className={cn(
                                "flex-1 max-h-[250px] overflow-auto bg-gray-100 scroll-py-5 px-5",
                                data.expired.length === 0 && "max-h-[600px]"
                            )}>
                                <div className="grid grid-cols-1 gap-3">
                                    {data.dueSoon.map((review) => (
                                        <DueSoonReviewItem key={review.id} review={review} onViewClick={handleNavigateToReview} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}


                    <DrawerFooter className='items-center gap-2 flex flex-row justify-center mt-5'>
                        <DrawerClose asChild>
                            <Button variant="outline">{t("reviewsAlert.actions.close.label")}</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    );
}


interface ReviewItemProps {
    review: DocumentReview;
    onViewClick?: (id: string) => void
}

export function DueSoonReviewItem({ review, onViewClick }: ReviewItemProps) {

    const { t } = useTranslation();

    return (
        <article
            className="w-full border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white"
        >
            <div className="flex justify-between items-start">
                <div className='space-y-1'>
                    <h3 className="text-sm font-medium">{review.document?.title}</h3>
                </div>
                <div className="flex flex-col gap-1">
                    <DueDateProgress
                        createdAt={review.createdAt}
                        dueDate={review.dueDate}
                    />
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                    {t("reviewsAlert.upcomingReviews.item.important", {
                        date: format(review.dueDate, "PPpp", {
                            locale: getDateFnsLocale(),
                        }),
                    })}
                </p>
                <Button
                    type="button"
                    className='rounded-md truncate'
                    variant='outline'
                    size='sm'
                    onClick={() => onViewClick?.(review.id)}
                >
                    {t("reviewsAlert.upcomingReviews.item.actions.reviewNow.label")}
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                </Button>
            </div>
        </article>
    );
}

export function ExpiredReviewItem({ review, onViewClick }: ReviewItemProps) {

    const { t } = useTranslation();

    return (
        <article
            className="w-full border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white space-y-2"
        >
            <div className="flex justify-between items-start gap-4">
                <div className='flex items-start gap-4'>
                    <AlertCircle className="w-4 h-4 text-theme-danger/70 hidden" />
                    <div className="space-y-0">
                        <h3 className="text-sm font-medium">{review.document?.title}</h3>
                        <p className="text-xs text-gray-700 max-w-52">
                            {t("reviewsAlert.expiredReviews.item.important", {
                                date: format(review.dueDate, "PPpp", {
                                    locale: getDateFnsLocale(),
                                }),
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <DueDateProgress
                        createdAt={review.createdAt}
                        dueDate={review.dueDate}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    className='rounded-md truncate'
                    variant='outline'
                    size='sm'
                    onClick={() => onViewClick?.(review.id)}
                >
                    {t("reviewsAlert.expiredReviews.item.actions.reviewNow.label")}
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                </Button>
            </div>
        </article>
    );
}