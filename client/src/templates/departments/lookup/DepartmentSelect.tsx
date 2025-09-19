import { SelectWithButton } from '@/components/SelectWithButton'
import { useSearchDepartments } from '@/hooks/queries/useDepartmentMutations';
import useDepartmentStore from '@/stores/department/useDepatrmentStore';
import type { Department } from '@/types';
import { useEffect, useMemo, useState } from 'react'

interface Props {
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: string;
    hasError?: boolean;
    onButtonClick?: () => void;
    addLabel?: string;
}

const DepartmentSelect = ({
    placeholder,
    onChange = () => { },
    value,
    addLabel,
    hasError,
    onButtonClick
}: Props) => {

    const { data: searchResults = [] } = useSearchDepartments();
    const { setQuery } = useDepartmentStore();

    const [selected, setSelected] = useState<Department | null>(null);


    // Merge selected option into results if missing
    const options = useMemo(() => {
        if (!selected) return searchResults ?? [];
        return searchResults?.some(o => o.id === selected.id)
            ? searchResults
            : [selected, ...(searchResults ?? [])];
    }, [searchResults, selected]);

    useEffect(() => {
        return () => setQuery('');
    }, [setQuery]);


    // If the prop value changes (edit mode), update selected
    useEffect(() => {
        if (value) {
            const found = options.find(o => o.id === value);
            if (found) setSelected(found);
        }
    }, [value, options]);

    return (
        <SelectWithButton
            placeholder={placeholder}
            items={options.map(({ name, id }) => ({
                value: id,
                label: name,
            }))}
            onChange={(id) => {
                onChange(id);
                const found = options.find(o => o.id === id);
                if (found) setSelected(found);
            }}
            value={value}
            addLabel={addLabel}
            hasError={hasError}
            onButtonClick={onButtonClick}
            onChangeSearch={setQuery}
        />
    )
}

export default DepartmentSelect