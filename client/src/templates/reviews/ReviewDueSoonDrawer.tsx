import { useEffect, useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useGetMyReviewsDueSoon } from '@/hooks/queries/useReviewMutation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, parseISO } from "date-fns";
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatDate, getDateFnsLocale } from '@/lib/date';
import { UserHoverCard } from '../users/hovercard/UserHoverCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function ReviewAlertDrawer() {
    const [open, setOpen] = useState(false);

    const { data: reviews, isLoading, isSuccess } = useGetMyReviewsDueSoon();
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
        navigate("/reviews");
    }


    if (isLoading) {
        return null;
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction='bottom'>
            <DrawerContent className='outline-none border-none mx-auto max-w-7xl rounded-t-3xl'>
                <div className="flex flex-col grow mx-auto max-w-fullh-full">

                    <DrawerHeader>
                        <DrawerTitle>{t("upcomingReviews.title")} ({reviews?.length})</DrawerTitle>
                        <DrawerDescription>{t("upcomingReviews.subtitle")}</DrawerDescription>
                    </DrawerHeader>

                    <ScrollArea className="flex-1 max-h-[600px] overflow-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5
                        ">
                            {reviews.map((review) => {
                                const dueDate = parseISO(review.dueDate);
                                const timeLeft = formatDistanceToNow(dueDate, { addSuffix: true, locale: getDateFnsLocale() });

                                return (
                                    <div
                                        key={review.id}
                                        className="float-left border hover:border-black/60 hover:bg-green-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow bg-white"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className='space-y-1'>
                                                <h3 className="text-base font-semibold">{review.document?.title}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    {t("upcomingReviews.item.version")}:
                                                    <Badge variant='outline'>
                                                        {review.document?.versions[review.document?.versions.length - 1]?.version}
                                                    </Badge>
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    {t("upcomingReviews.item.reviewer")}:
                                                    <UserHoverCard user={review.reviewer} currentUserId={user?.id} />
                                                </p>
                                            </div>
                                            <span className="text-xs font-normal text-theme-danger animate-pulse">{timeLeft}</span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <p className="text-xs text-muted-foreground">
                                                {t("upcomingReviews.item.important", {
                                                    date: formatDate(review.dueDate, {
                                                        minute: '2-digit',
                                                        hour: '2-digit',
                                                    }),
                                                })}
                                            </p>
                                            <Button
                                                type="button"
                                                className='rounded-md normal-case'
                                                size='sm'
                                                onClick={() => handleNavigateToReview(review.id)}
                                            >
                                                {t("upcomingReviews.item.actions.reviewNow.label")}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <DrawerFooter className='items-center gap-2 flex flex-row justify-center mt-5'>
                        <DrawerClose asChild>
                            <Button variant="outline">{t("upcomingReviews.actions.close.label")}</Button>
                        </DrawerClose>
                        <Button
                            variant="primary"
                            onClick={handleSeeReviews}
                        >
                            {t("upcomingReviews.actions.viewAll.label")}
                            <ArrowRight className='ml-2 w-4 h-4' />
                        </Button>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    );
}
