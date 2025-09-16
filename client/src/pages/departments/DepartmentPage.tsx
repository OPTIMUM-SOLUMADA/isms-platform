import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useDepartmentUI } from '@/stores/department/useDepartmentUI';
import useDepartmentStore from '@/stores/department/useDepatrmentStore';
import { DepartmentTable } from '@/templates/departments/table/DepartmentTable';
import WithTitle from '@/templates/layout/WithTitle';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next'

const DepartmentPage = () => {
    const { t } = useTranslation();
    const { departments } = useDepartmentStore();
    const { isLoading } = useDepartment();
    const { openAdd } = useDepartmentUI();

    return (
        <WithTitle title={t('department.title')}>
            <div className="space-y-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="page-title">{t("department.title")}</h1>
                        <p className="page-description">{t("department.subtitle")}</p>
                    </div>

                    <Button className="flex items-center space-x-2" onClick={openAdd}>
                        <Plus className="h-4 w-4" />
                        <span>{t("department.actions.add.label")}</span>
                    </Button>
                </div>

                <Card className='flex-grow flex flex-col'>
                    <DepartmentTable
                        data={departments}
                        isLoading={isLoading}
                    />
                </Card>
            </div>
        </WithTitle>
    )
}

export default DepartmentPage   