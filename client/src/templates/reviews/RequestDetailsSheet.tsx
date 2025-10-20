import HtmlContent from "@/components/HTMLContent";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "@/lib/date";
import { DocumentReview } from "@/types";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    item: DocumentReview;
}
const RequestDetailsSheet = ({ item, children }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                        <div className='w-full bg-white max-w-3xl p-4 border-2 border-gray-300 rounded-lg text-sm'>
                            {(item.decision === "REJECT" && item.comment) && (
                                <>
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
                                                {item.reviewDate && (<span className='opacity-70 text-sm'>{formatDate(item.reviewDate)}</span>)}
                                            </div>
                                        )}
                                        <HtmlContent html={item.comment} />
                                    </div>
                                </>
                            )}
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default RequestDetailsSheet