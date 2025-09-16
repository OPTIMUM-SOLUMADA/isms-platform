import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import EditDepartmentForm, { EditDepartmentFormData } from "@/templates/departments/forms/EditDepartmentForm";
import { useUpdateDepartment } from "@/hooks/queries/departmentMutations";
import type { Department } from "@/types";

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

    function handleUpdate(data: EditDepartmentFormData) {
        createDepartment(data, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("department.forms.edit.title")}</DialogTitle>
                    <DialogDescription>{t("department.forms.edit.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditDepartmentForm
                    defaultValues={department}
                    onSubmit={handleUpdate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>)
};

export default EditDepartmentFormDialog

