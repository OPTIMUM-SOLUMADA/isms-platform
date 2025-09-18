import { useTranslation } from "react-i18next";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateISOClause } from "@/hooks/queries/useISOClauseMutations";
import EditISOClauseForm, { EditISOClauseFormData } from "../forms/EditISOClauseForm";
import { ISOClause } from "@/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isoClause: ISOClause;
}
const EditISOClauseDialog = ({
    open,
    onOpenChange,
    isoClause,
}: Props) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const {
        mutate: update,
        isPending,
        error,
    } = useUpdateISOClause();

    const handleUpdate = (data: EditISOClauseFormData) => {
        const { id, ...rest } = data;
        update({ id, data: rest }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t("isoClause.forms.edit.title")}</SheetTitle>
                    <SheetDescription>
                        {t("isoClause.forms.edit.subtitle")}
                    </SheetDescription>
                </SheetHeader>

                <EditISOClauseForm
                    defaultValue={isoClause}
                    onSubmit={handleUpdate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                    userId={user?.id}
                />
            </SheetContent>
        </Sheet>
    )
};

export default EditISOClauseDialog

