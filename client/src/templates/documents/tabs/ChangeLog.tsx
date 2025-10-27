import React, { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { CheckCircle2, Clock, FileText, GitPullRequest, MessageCircle, User } from 'lucide-react';
import { useGetCompletedReviewByDocument } from '@/hooks/queries/useReviewMutation';
import { Document, DocumentReview } from '@/types';
import { cn } from '@/lib/utils';
import { defaultFormat, getDateFnsLocale } from '@/lib/date';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import HtmlContent from '@/components/HTMLContent';
import { UserAvatar } from '@/components/user-avatar';

interface ChangeLogProps {
    document: Document;
}

const ChangeLogTimeline: React.FC<ChangeLogProps> = memo(({ document }) => {
    const { data = [] } = useGetCompletedReviewByDocument(document.id);
    return (
        <>
            <ScrollArea className="h-[600px] w-full flex mx-auto">
                <div className="relative border-l border-gray-300 dark:border-gray-700 ml-4 py-4 max-w-md mx-auto">
                    {data
                        .map((item) => (
                            <LogItem key={item.id} item={item} />
                        ))}
                </div>
            </ScrollArea>
        </>
    );
});

interface LogItemProps {
    item: DocumentReview;
}

const LogItem = ({ item }: LogItemProps) => {

    const isApproved = item.decision === "APPROVE";

    return (
        <div className="mb-8 pl-10 relative mx-auto">
            {/* Timeline circle */}
            <div
                className={cn(
                    "absolute left-0 -translate-x-1/2 top-0 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white dark:border-gray-900",
                    "grid place-items-center z-30",
                    isApproved ? "bg-theme" : "bg-theme-2-dark"
                )}
            >
                {isApproved ? (
                    <CheckCircle2 className="w-full h-full text-white" />
                ) : (
                    <GitPullRequest className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Timeline content */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                    <h3 className="flex items-center gap-1 text-sm font-normal">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {item.document.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        <User className="inline w-3 h-3 mr-1" /> {item.reviewer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <Clock className="inline w-3 h-3 mr-1" /> Due{' '}
                        {formatDistanceToNow(parseISO(item.dueDate), { addSuffix: true, locale: getDateFnsLocale() })}
                    </p>
                    <p className="text-sm mt-1">
                        <span>Version:</span> <Badge variant='outline'>{item.documentVersion.version}</Badge>
                    </p>
                </div>
                <div className="mt-2 sm:mt-0 flex flex-col items-end gap-2">
                    <Badge variant={isApproved ? 'default' : 'outline'}>
                        {isApproved ? 'Approved' : 'Changes requested'}
                    </Badge>
                    {!isApproved && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    title='View comment'
                                    className='rounded-full p-2 bg-gray-100 hover:bg-gray-200 hover:text-theme'
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className='w-full max-w-2xl'>
                                <div className="w-full p-2 bg-gray-50 border-gray-100 border">
                                    {item.reviewer && (
                                        <div className='flex items-start justify-between gap-2 py-3'>
                                            <div className="flex items-center gap-2">
                                                <UserAvatar className="size-8" id={item.reviewer.id} name={item.reviewer.name} />
                                                <div className='flex flex-col'>
                                                    <span>{item.reviewer.name}</span>
                                                    <span className='text-muted-foreground text-xs'>{item.reviewer.email}</span>
                                                </div>
                                            </div>
                                            {item.reviewDate && (<span className='opacity-70 text-xs'>{defaultFormat(item.reviewDate)}</span>)}
                                        </div>
                                    )}
                                    <HtmlContent html={item.comment} />
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChangeLogTimeline;
