import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddDepartmentForm from "@/templates/departments/AddDepartmentForm";
import { useDepartment } from "@/contexts/DepartmentContext";

interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void
}
const AddDepartmentFormDialog = ({
    open,
    onOpenChange 
}: Props) => {
    const { t } = useTranslation();
    
    const { createError, isCreating, createDepartment, 
        createSuccess } 
    = useDepartment();

    useEffect (() => {
        if (createSuccess) {
            onOpenChange(false);
        }
    }, [createSuccess, onOpenChange, ]);

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='card-header-bg'>
            <DialogHeader>
                <DialogTitle>{t("department.forms.add.title")}</DialogTitle>
                <DialogDescription>{t("department.forms.add.subtitle")}</DialogDescription>
            </DialogHeader>
            <AddDepartmentForm
                onSubmit={createDepartment}
                error={createError}
                isPending={isCreating}
            />
        </DialogContent>
    </Dialog>)
};

export default AddDepartmentFormDialog

