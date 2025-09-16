import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditUserForm from '../EditUserForm';
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { User } from "@/types";
import { useUpdateUser } from "@/hooks/queries/useUserMutations";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";

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
    const { departments } = useDepartmentStore();
    const { mutateAsync: updateUser, isSuccess, isPending, error, reset } = useUpdateUser();

    useEffect(() => {
        if (isSuccess) {
            onOpenChange(false);
            reset();
        }
    }, [isSuccess, onOpenChange, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("user.forms.update.title")}</DialogTitle>
                    <DialogDescription>{t("user.forms.update.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditUserForm
                    user={user}
                    departments={departments}
                    onSubmit={updateUser}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    error={error?.response?.data.code}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditUserFormDialog