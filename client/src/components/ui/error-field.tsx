import * as React from 'react';
import { cn } from '@/lib/utils';

interface ErrorFieldProps {
    className?: string;
    value?: string | null;
}

const ErrorField: React.FC<ErrorFieldProps> = ({ value, className }) => {
    return (
        <p className={cn("text-sm text-red-600 text-center", className)}>
            {value}
        </p>
    );
};

export default ErrorField;
