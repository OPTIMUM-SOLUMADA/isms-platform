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
        createSuccess
    } = useUser();

    useEffect(() => {
        if (createSuccess) {
            onOpenChange(false);
        }
    }, [createSuccess, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='bg-gray-50'>
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