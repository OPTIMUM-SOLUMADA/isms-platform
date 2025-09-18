import { useTranslation } from "react-i18next";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext";
import { useCreateISOClause } from "@/hooks/queries/useISOClauseMutations";
import AddISOClauseForm, { AddISOClauseFormData } from "../forms/AddISOClauseForm";

interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void
}
const AddISOClauseDialog = ({
    open,
    onOpenChange
}: Props) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const {
        mutate: create,
        isPending,
        error,
    } = useCreateISOClause();

    const handleCreate = (data: AddISOClauseFormData) => {
        create(data, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t("isoClause.forms.add.title")}</SheetTitle>
                    <SheetDescription>
                        {t("isoClause.forms.add.subtitle")}
                    </SheetDescription>
                </SheetHeader>

                <AddISOClauseForm
                    onSubmit={handleCreate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>
    )
};

export default AddISOClauseDialog

