import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface CircleLoadingProps {
    className?: string;
    size?: number; // allow custom size
    text?: string; // optional loading text
}

const CircleLoading = ({ className, size = 40, text }: CircleLoadingProps) => {
    return (
        <div
            className={cn(
                'flex flex-col grow items-center justify-center space-y-2',
                className
            )}
        >
            <div className="p-4 rounded-full bg-muted/30 shadow-inner">
                <Loader
                    size={size}
                    className="animate-spin text-theme-2-muted"
                />
            </div>
            {text && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default CircleLoading;
