import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddDepartmentForm from "@/templates/departments/forms/AddDepartmentForm";
import { useCreateDepartment } from "@/hooks/queries/useDepartmentMutations";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

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
                    <SheetTitle>{t("department.forms.add.title")}</SheetTitle>
                    <SheetDescription>{t("department.forms.add.subtitle")}</SheetDescription>
                </SheetHeader>
                <AddDepartmentForm
                    onSubmit={createDepartment}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>)
};

export default AddDepartmentFormDialog

