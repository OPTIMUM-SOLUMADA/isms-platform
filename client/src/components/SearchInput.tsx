import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onValueChange: (value: string) => void;
}
const SearchInput = ({
    placeholder = "",
    value = "",
    onValueChange
}: SearchInputProps) => {

    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onValueChange(e.target.value)}
                className="pl-10"
            />
        </div>
    )
}

export default SearchInput;