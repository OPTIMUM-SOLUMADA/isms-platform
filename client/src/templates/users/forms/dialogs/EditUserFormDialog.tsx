import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditUserForm from '../EditUserForm';
import { useTranslation } from 'react-i18next';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from "react";
import { User } from "@/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}
const EditUserFormDialog = ({
    open,
    onOpenChange,
    user,
}: Props) => {

    const { t } = useTranslation();
    const { departments } = useDepartment();
    const {
        updateUser,
        updateError,
        updateSuccess,
        isUpdating,
    } = useUser();

    useEffect(() => {
        if (updateSuccess) {
            onOpenChange(false);
        }
    }, [updateSuccess, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='bg-gray-50'>
                <DialogHeader>
                    <DialogTitle>{t("user.forms.update.title")}</DialogTitle>
                    <DialogDescription>{t("user.forms.update.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditUserForm
                    user={user}
                    departments={departments}
                    onSubmit={updateUser}
                    onCancel={() => onOpenChange(false)}
                    isPending={isUpdating}
                    error={updateError}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditUserFormDialog