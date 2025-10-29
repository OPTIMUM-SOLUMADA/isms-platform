import { useEffect, useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useGetExpiredReviewsByUser } from '@/hooks/queries/useReviewMutation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getDateFnsLocale } from '@/lib/date';
import { UserHoverCard } from '../users/hovercard/UserHoverCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { DueDateProgress } from '@/components/DueDateProgress';

export default function ExpiredReviewsDrawer() {
    const [open, setOpen] = useState(false);

    const { data: reviews, isLoading, isSuccess } = useGetExpiredReviewsByUser();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        if (reviews?.length && isSuccess) {
            setOpen(true);
        }
    }, [isSuccess, reviews]);

    function handleNavigateToReview(id: string) {
        // close drawer
        setOpen(false);
        navigate(`/review-approval/${id}`)
    }

    function handleSeeReviews() {
        setOpen(false);
        navigate("/reviews?tab=EXPIRED");
    }


    if (isLoading) {
        return null;
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction='bottom'>
            <DrawerContent className='outline-none border-none ml-auto max-w-lg rounded-t-[40px]'>
                <div className="flex flex-col grow mx-auto max-w-fullh-full">

                    <DrawerHeader>
                        <DrawerTitle>{t("expiredReviews.title")} ({reviews?.length})</DrawerTitle>
                        <DrawerDescription>{t("expiredReviews.subtitle")}</DrawerDescription>
                    </DrawerHeader>

                    <ScrollArea className="flex-1 max-h-[600px] overflow-auto">
                        <div className="grid grid-cols-1 gap-5 p-5">
                            {reviews.map((review) => {
                                return (
                                    <div
                                        key={review.id}
                                        className="w-full border hover:border-black/60 hover:bg-green-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow bg-white"
                                    >
                                        <AlertCircle className="w-5 h-5 text-theme-danger/70 mb-2" />
                                        <div className="flex justify-between items-start">
                                            <div className='space-y-1'>
                                                <h3 className="text-base font-semibold">{review.document?.title}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    {t("expiredReviews.item.version")}:
                                                    <Badge variant='outline'>
                                                        {review.document?.versions[review.document?.versions.length - 1]?.version}
                                                    </Badge>
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    {t("expiredReviews.item.reviewer")}:
                                                    <UserHoverCard user={review.reviewer} currentUserId={user?.id} />
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <DueDateProgress
                                                    createdAt={review.createdAt}
                                                    dueDate={review.dueDate}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <p className="text-xs text-amber-700">
                                                {t("expiredReviews.item.important", {
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
                                                onClick={() => handleNavigateToReview(review.id)}
                                            >
                                                {t("expiredReviews.item.actions.reviewNow.label")}
                                                <ArrowUpRight className='ml-2 w-4 h-4' />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <DrawerFooter className='items-center gap-2 flex flex-row justify-center mt-5'>
                        <DrawerClose asChild>
                            <Button variant="outline">{t("expiredReviews.actions.close.label")}</Button>
                        </DrawerClose>
                        <Button
                            variant="outline-destructive"
                            onClick={handleSeeReviews}
                        >
                            {t("expiredReviews.actions.viewAll.label")}
                            <ArrowRight className='ml-2 w-4 h-4' />
                        </Button>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    );
}
