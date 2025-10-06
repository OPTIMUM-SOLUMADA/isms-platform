import { SelectWithButton } from '@/components/SelectWithButton';
import { useFetchOwners } from '@/hooks/queries/useOwnerMutations';
import useOwnerStore from '@/stores/owner/userOwnserStore';
import { DocumentOwner } from '@/types';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: string;
    hasError?: boolean;
    onButtonClick?: () => void;
    addLabel?: string;
}

const OwnerLookup = ({
    placeholder,
    onChange = () => { },
    value,
    addLabel,
    hasError,
    onButtonClick
}: Props) => {

    useFetchOwners();
    const { setQuery, owners } = useOwnerStore();

    const [selected, setSelected] = useState<DocumentOwner | null>(null);

    // Merge selected option into results if missing
    const options = useMemo(() => {
        if (!selected) return owners ?? [];
        return owners?.some(o => o.id === selected.id)
            ? owners
            : [selected, ...(owners ?? [])];
    }, [owners, selected]);

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
            allowSearch={false}
        />
    )
}

export default OwnerLookup;