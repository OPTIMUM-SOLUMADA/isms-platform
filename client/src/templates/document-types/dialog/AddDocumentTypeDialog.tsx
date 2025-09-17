import { useTranslation } from "react-i18next";
import { useCreateDocumentType } from "@/hooks/queries/useDocumentTypeMutations";
import AddDocumentTypeForm, { AddDocumentTypeFormData } from "../forms/AddDocumentTypeForm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void
}
const AddDocumentTypeDialog = ({
    open,
    onOpenChange
}: Props) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const {
        mutate: create,
        isPending,
        error,
    } = useCreateDocumentType();

    const handleCreate = (data: AddDocumentTypeFormData) => {
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
                    <SheetTitle>{t("documentType.forms.add.title")}</SheetTitle>
                    <SheetDescription>
                        {t("documentType.forms.add.subtitle")}
                    </SheetDescription>
                </SheetHeader>

                <AddDocumentTypeForm
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

export default AddDocumentTypeDialog

