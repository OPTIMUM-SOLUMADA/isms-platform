import { SelectWithButton } from '@/components/SelectWithButton'
import { useSearchDocumentTypes } from '@/hooks/queries/useDocumentTypeMutations';
import useDocumentTypeStore from '@/stores/document-type/useDocumentTypeStore';
import type { DocumentType } from '@/types';
import { useEffect, useMemo, useState } from 'react'

interface Props {
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: string;
    hasError?: boolean;
    onButtonClick?: () => void;
    addLabel?: string;
}

const DocumentTypeSelect = ({
    placeholder,
    onChange = () => { },
    value,
    addLabel,
    hasError,
    onButtonClick
}: Props) => {

    const { data: searchResults = [] } = useSearchDocumentTypes();
    const { setQuery } = useDocumentTypeStore();

    const [selected, setSelected] = useState<DocumentType | null>(null);


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

export default DocumentTypeSelect