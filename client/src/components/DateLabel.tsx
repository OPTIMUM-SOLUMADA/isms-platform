import { defaultFormat } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface Props {
    className?: string;
    date: Date | string;
};

const DateLabel = ({ className, date }: Props) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Calendar className='h-4 w-4' />
            <span>{defaultFormat(date)}</span>
        </div>
    )
}

export default DateLabel