import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddDepartmentForm from "@/templates/departments/AddDepartmentForm";
import { useCreateDepartment } from "@/hooks/queries/departmentMutations";

interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void
}
const AddDepartmentFormDialog = ({
    open,
    onOpenChange
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
                    <DialogTitle>{t("department.forms.add.title")}</DialogTitle>
                    <DialogDescription>{t("department.forms.add.subtitle")}</DialogDescription>
                </DialogHeader>
                <AddDepartmentForm
                    onSubmit={createDepartment}
                    error={error?.response?.data.code}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>)
};

export default AddDepartmentFormDialog

