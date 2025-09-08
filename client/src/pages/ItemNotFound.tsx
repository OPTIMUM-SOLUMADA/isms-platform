import React from 'react';
import { ArrowLeft, SearchX } from 'lucide-react'; // icon for empty state
import { Button } from '@/components/ui/button'; // shadcn/ui button

interface ItemNotFoundProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onActionClick?: () => void;
}

const ItemNotFound: React.FC<ItemNotFoundProps> = ({
    title = 'Item Not Found',
    description = 'We couldn\'t find what you were looking for.',
    actionLabel,
    onActionClick,
}) => {
    return (
        <div className="flex flex-col flex-grow items-center justify-center text-center p-8 space-y-4">
            <div className="rounded-full bg-muted/30 p-4">
                <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            {actionLabel && (
                <Button onClick={onActionClick} className="mt-2 normal-case" variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default ItemNotFound;
