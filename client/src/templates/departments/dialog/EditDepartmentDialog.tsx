import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import EditDepartmentForm from "@/templates/departments/forms/EditDepartmentForm";
import { useCreateDepartment } from "@/hooks/queries/departmentMutations";
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
        mutateAsync: createDepartment,
        isPending,
        isSuccess,
        error,
        reset
    } = useCreateDepartment();

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
                    <DialogTitle>{t("department.forms.edit.title")}</DialogTitle>
                    <DialogDescription>{t("department.forms.edit.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditDepartmentForm
                    defaultValues={department}
                    onSubmit={createDepartment}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>)
};

export default EditDepartmentFormDialog

