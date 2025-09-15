import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDepartment } from '@/contexts/DepartmentContext';

export interface SelectItemType {
    value: string;
    label: string;
}

interface SelectWithButtonProps {
    items: SelectItemType[];
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    addLabel?: string; // label for "Add new"
    onAdd?: () => void; // when add button clicked
    className?: string;
}

const { openAdd } = useDepartment();

export function SelectWithButton({
    items,
    value,
    placeholder = 'Select an option',
    onChange,
    addLabel = 'Add new',
    onAdd,
    className,
}: SelectWithButtonProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className={cn(className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {items.map(({ label, value }, index) => (
                    <SelectItem key={index} value={value}>
                        {label}
                    </SelectItem>
                ))}
                {onAdd && (
                    <div className="py-1 border-t">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation(); // prevent Select from closing weirdly
                                onAdd();
                                openAdd();
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            {addLabel}
                        </Button>
                    </div>
                )}
            </SelectContent>
        </Select>
    );
}
