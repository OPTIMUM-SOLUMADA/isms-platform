import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import EditDepartmentForm, { EditDepartmentFormData } from "@/templates/departments/forms/EditDepartmentForm";
import type { DepartmentRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateDepartmentRole } from "@/hooks/queries/useDepartmentRoleMutations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    departmentRole: DepartmentRole;
}
const EditDepartmentRoleFormDialog = ({
    open,
    onOpenChange,
    departmentRole,
}: Props) => {
    const { t } = useTranslation();

    const {
        mutate: createDepartmentRole,
        isPending,
        error,
    } = useUpdateDepartmentRole();

    const { user } = useAuth();

    function handleUpdate(data: EditDepartmentFormData) {
        createDepartmentRole(data, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='card-header-bg'>
                <SheetHeader>
                    <SheetTitle>{t("department.forms.edit.title")}</SheetTitle>
                    <SheetDescription>{t("department.forms.edit.subtitle")}</SheetDescription>
                </SheetHeader>
                <EditDepartmentForm
                    defaultValues={departmentRole}
                    onSubmit={handleUpdate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>)
};

export default EditDepartmentRoleFormDialog

