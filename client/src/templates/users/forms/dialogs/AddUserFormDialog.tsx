import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddUserForm, { AddUserFormData } from '../AddUserForm';
import { useTranslation } from 'react-i18next';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useEffect } from "react";
import { useCreateUser, useSendInvitation } from "@/hooks/queries/useUserMutations";

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
        mutateAsync: createUser,
        isPending,
        isSuccess,
        reset,
        error
    } = useCreateUser();

    const { mutate: sendInvitation } = useSendInvitation();


    useEffect(() => {
        if (isSuccess) {
            onOpenChange(false);
            reset();
        }
    }, [isSuccess, reset, onOpenChange]);

    async function handleCreateUser(data: AddUserFormData) {
        const res = await createUser(data);
        // request send email invitation
        if (res.data && data.sendInvitationLink) {
            sendInvitation({ id: res.data.id });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("user.forms.add.title")}</DialogTitle>
                    <DialogDescription>{t("user.forms.add.subtitle")}</DialogDescription>
                </DialogHeader>
                <AddUserForm
                    departments={departments}
                    onSubmit={handleCreateUser}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    error={error?.response?.data.code}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddUserFormDialog