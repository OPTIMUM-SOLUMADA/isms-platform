import React, { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, FileText, User } from 'lucide-react';
import { useGetCompletedReviewByDocument } from '@/hooks/queries/useReviewMutation';
import { Document } from '@/types';

interface ChangeLogProps {
    document: Document;
}

const ChangeLogTimeline: React.FC<ChangeLogProps> = memo(({ document }) => {
    const { data = [] } = useGetCompletedReviewByDocument(document.id);
    return (
        <ScrollArea className="h-[600px] w-full">
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
                {data
                    .map((item) => (
                        <div key={item.id} className="mb-8 ml-6 relative">
                            {/* Timeline circle */}
                            <span
                                className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${item.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                            ></span>

                            {/* Timeline content */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div>
                                    <h3 className="flex items-center gap-1 text-base font-semibold">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        {item.document.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        <User className="inline w-3 h-3 mr-1" /> {item.reviewer.name} ({item.reviewer.email})
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        <Clock className="inline w-3 h-3 mr-1" /> Due{' '}
                                        {formatDistanceToNow(parseISO(item.dueDate), { addSuffix: true })}
                                    </p>
                                    <p className="text-sm mt-1">
                                        <span className="font-semibold">Version:</span> {item.documentVersion.version}{' '}
                                        | <span className="font-semibold">ISO:</span> {item.document.isoClause.name} (
                                        {item.document.isoClause.code})
                                    </p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <Badge variant={item.isCompleted ? 'outline' : 'secondary'}>
                                        {item.isCompleted ? 'Reviewed' : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </ScrollArea>
    );
});

export default ChangeLogTimeline;
