import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import EditDepartmentForm, { EditDepartmentFormData } from "@/templates/departments/forms/EditDepartmentForm";
import { useUpdateDepartment } from "@/hooks/queries/useDepartmentMutations";
import type { Department } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department: Department;
}
const EditDepartmentFormDialog = ({
    open,
    onOpenChange,
    department,
}: Props) => {
    const { t } = useTranslation();

    const {
        mutate: createDepartment,
        isPending,
        error,
    } = useUpdateDepartment();

    const { user } = useAuth();

    function handleUpdate(data: EditDepartmentFormData) {
        createDepartment(data, {
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
                    defaultValues={department}
                    onSubmit={handleUpdate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>)
};

export default EditDepartmentFormDialog

