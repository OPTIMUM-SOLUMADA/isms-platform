import SearchInput from '@/components/SearchInput';
import { useGetPublishedDocuments, useGetRecenltyViewedDocuments } from '@/hooks/queries/useDocumentMutations'
import { getFileIconByName } from '@/lib/icon';
import { PublishedDocumentTable } from '@/templates/documents/table/PublishedDocumentTable';
import WithTitle from '@/templates/layout/WithTitle'
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useISOClause } from '@/contexts/ISOClauseContext';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const PublishedDocumentPage = () => {
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
    const [filterClause, setFilterClause] = useQueryState('isoClause', parseAsString.withDefault('all'));
    const { clauses } = useISOClause();
    const { data: documents, isLoading, isError, error } = useGetPublishedDocuments();
    // get recently viewed
    const { data: recenltyViewedDocuments, isLoading: isRecenltyViewedLoading } = useGetRecenltyViewedDocuments();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const filteredDocuments = useMemo(() => {
        if (!documents) return [];
        return documents.filter((doc) => {

            const c = filterClause === 'all' || doc.isoClauseId === filterClause;
            const s = doc.title.toLowerCase().includes(search);

            return c && s;
        });
    }, [search, filterClause, documents]);

    if (isError) return <div>{error.message}</div>;

    return (
        <WithTitle title={t('publishedDocument.title')}>
            {/* Recently viewed */}
            <div className="grow flex flex-col gap-10">

                <div className="space-y-3">
                    <h1 className="font-normal text-xl text-black">
                        {t('publishedDocument.sections.recentlyViewed.title')}
                    </h1>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,180px),1fr))] gap-5">
                        {isRecenltyViewedLoading && (
                            <>
                                <Skeleton className="aspect-video" />
                                <Skeleton className="aspect-video" />
                            </>
                        )}
                        {recenltyViewedDocuments?.map((item, index) => (
                            <Link to={`/published-documents/view/${item.documentId}`} key={index} className="space-y-3 group hover:bg-black/5 p-2">
                                <div key={item.id} className={cn(
                                    "p-4 aspect-video border bg-white border-gray-200 rounded-md flex items-center justify-center flex-col",
                                    "group-hover:bg-slate-50 [&>svg]:group-hover:scale-110 [&>svg]:transition-all [&>svg]:ease-linear [&>svg]:duration-300",
                                )}>
                                    {getFileIconByName(item.document.fileUrl!, 50)}
                                </div>
                                <div className="">
                                    <h2 className="text-sm font-semibold text-black line-clamp-1">{item.document?.title}</h2>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{item.document?.description}</p>
                                </div>
                            </Link>
                        ))}

                        {/* Empty */}
                        {recenltyViewedDocuments?.length === 0 && (
                            <div className="space-y-3">
                                <div className="p-4 aspect-video border rounded-md flex items-center justify-center flex-col gap-">
                                    <div className="div">
                                        <p className="text-sm text-muted-foreground">
                                            {t('publishedDocument.sections.recentlyViewed.empty')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3 grow flex flex-col">
                    <h1 className="font-normal text-xl text-black">
                        {t('publishedDocument.sections.allDocuments.title')} ({documents?.length})</h1>
                    {/* Filter */}
                    <div className="flex items-center justify-between">
                        <SearchInput
                            placeholder={t('publishedDocument.sections.allDocuments.filters.search.placeholder')}
                            value={search}
                            onValueChange={setSearch}
                        />
                        <div className="flex items-center justify-center gap-2">
                            <div className="mr-2">
                                <Filter size={20} />
                            </div>
                            <Select value={filterClause} onValueChange={setFilterClause}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder={t('document.filter.isoClause.title')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('document.filter.isoClause.placeholder')}</SelectItem>
                                    {clauses.map((item, index) => (
                                        <SelectItem key={index} value={item.id}>
                                            {item.code} - {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Published documents table */}
                    <PublishedDocumentTable
                        data={filteredDocuments}
                        onView={(doc) => navigate(`/published-documents/view/${doc.id}`)}
                        isLoading={isLoading}
                    />
                </div>
            </div>

        </WithTitle>
    )
}

export default PublishedDocumentPage