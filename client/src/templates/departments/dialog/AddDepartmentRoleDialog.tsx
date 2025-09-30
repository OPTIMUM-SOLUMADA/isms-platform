import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddDepartmentRoleForm from "@/templates/departments/forms/AddDepartmentRoleForm";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDepartmentRole } from "@/hooks/queries/useDepartmentRoleMutations";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";

interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void
}
const AddDepartmentRoleFormDialog = ({
    open,
    onOpenChange
}: Props) => {
    const { t } = useTranslation();

    const { currentDepartment } = useDepartmentStore();

    const {
        mutateAsync: createDepartmentRole,
        isPending,
        isSuccess,
        error,
        reset
    } = useCreateDepartmentRole(currentDepartment?.id as string);

    const { user } = useAuth();

    useEffect(() => {
        if (isSuccess) {
            onOpenChange(false);
            reset();
        }
    }, [isSuccess, onOpenChange, reset]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='card-header-bg'>
                <SheetHeader>
                    <SheetTitle>{t("departmentRole.forms.add.title")}</SheetTitle>
                    <SheetDescription>{t("departmentRole.forms.add.subtitle")}</SheetDescription>
                </SheetHeader>
                <AddDepartmentRoleForm
                    onSubmit={createDepartmentRole}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>)
};

export default AddDepartmentRoleFormDialog

