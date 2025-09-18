import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFetchISOClauses } from '@/hooks/queries/useISOClauseMutations';
import useISOClauseStore from '@/stores/iso-clause/useISOClauseStore';
import { useISOClauseUIStore } from '@/stores/iso-clause/useISOClauseUIStore';
import { ISOClauseTable } from '@/templates/iso-clauses/table/ISOClauseTable';
import WithTitle from '@/templates/layout/WithTitle';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next'

const ISOClausePage = () => {
    const { t } = useTranslation();
    const { isoClauses } = useISOClauseStore();
    const { openAdd } = useISOClauseUIStore();

    const { isLoading } = useFetchISOClauses();

    return (
        <WithTitle title={t('isoClause.title')}>
            <div className="space-y-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="page-title">{t("isoClause.title")}</h1>
                        <p className="page-description">{t("isoClause.subtitle")}</p>
                    </div>

                    <Button className="flex items-center space-x-2" variant="primary" onClick={openAdd}>
                        <Plus className="h-4 w-4" />
                        <span>{t("isoClause.actions.add.label")}</span>
                    </Button>
                </div>

                <Card className='flex-grow flex flex-col'>
                    <ISOClauseTable
                        data={isoClauses}
                        isLoading={isLoading}
                    />
                </Card>
            </div>
        </WithTitle>
    )
}

export default ISOClausePage   