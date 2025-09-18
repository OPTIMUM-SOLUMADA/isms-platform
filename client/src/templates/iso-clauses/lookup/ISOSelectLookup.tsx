import { SelectWithButton } from '@/components/SelectWithButton'
import { useSearchIsoClauses } from '@/hooks/queries/useISOClauseMutations';
import useISOClauseStore from '@/stores/iso-clause/useISOClauseStore';
import { ISOClause } from '@/types';
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: string;
    hasError?: boolean;
    onButtonClick?: () => void;
    addLabel?: string;
}

const ISOSelectLookup = ({
    placeholder,
    onChange = () => { },
    value,
    addLabel,
    hasError,
    onButtonClick
}: Props) => {

    const { data: searchResults = [] } = useSearchIsoClauses();
    const { setQuery } = useISOClauseStore();

    const [selected, setSelected] = useState<ISOClause | null>(null);


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
            items={options.map(({ code, name, id }) => ({
                value: id,
                label: `${code} ${name}`,
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

export default ISOSelectLookup