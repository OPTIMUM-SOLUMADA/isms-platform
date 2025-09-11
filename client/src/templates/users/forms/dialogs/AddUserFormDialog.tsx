import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddUserForm from '../AddUserForm';
import { useTranslation } from 'react-i18next';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
const AddUserFormDialog = ({
    open,
    onOpenChange
}: Props) => {

    const { t } = useTranslation();
    const { departments } = useDepartment();
    const {
        createError,
        isCreating,
        createUser,
        createSuccess,
        resetCreate
    } = useUser();

    useEffect(() => {
        if (createSuccess) {
            onOpenChange(false);
            resetCreate();
        }
    }, [createSuccess, onOpenChange, resetCreate]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("user.forms.add.title")}</DialogTitle>
                    <DialogDescription>{t("user.forms.add.subtitle")}</DialogDescription>
                </DialogHeader>
                <AddUserForm
                    departments={departments}
                    onSubmit={createUser}
                    onCancel={() => onOpenChange(false)}
                    isPending={isCreating}
                    error={createError}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddUserFormDialog