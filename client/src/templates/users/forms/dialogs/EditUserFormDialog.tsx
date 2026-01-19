import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditUserForm, { UpdateUserFormData } from '../EditUserForm';
import { useTranslation } from 'react-i18next';
import { User } from "@/types";
import { useUpdateUser } from "@/hooks/queries/useUserMutations";
import { useAuth } from "@/contexts/AuthContext";

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
    const { user: activeUser } = useAuth();
    const { mutate: updateUser, isPending, error } = useUpdateUser();

    function handleUpdateUser(data: UpdateUserFormData) {
        updateUser({
            ...data,
            userId: activeUser?.id
        }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("user.forms.update.title")}</DialogTitle>
                    <DialogDescription>{t("user.forms.update.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditUserForm
                    user={user}
                    onSubmit={handleUpdateUser}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    error={error?.response?.data.code}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditUserFormDialog