
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useTranslation } from "react-i18next";
import { useUpdateDocumentType } from "@/hooks/queries/useDocumentTypeMutations";
import EditDocumentTypeForm, { type EditDocumentTypeFormData } from "../forms/EditDocumentTypeForm";
import type { DocumentType } from "@/types";

interface Props {
    documentType: DocumentType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
const EditDocumentTypeDialog = ({
    documentType,
    open,
    onOpenChange
}: Props) => {
    const { t } = useTranslation();

    const {
        mutate: update,
        isPending,
        error,
    } = useUpdateDocumentType();

    const handleUpdate = (data: EditDocumentTypeFormData) => {
        const { id, ...rest } = data;

        update({ id, data: rest }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='card-header-bg'>
                <SheetHeader>
                    <SheetTitle>{t("documentType.forms.add.title")}</SheetTitle>
                    <SheetDescription>{t("documentType.forms.add.subtitle")}</SheetDescription>
                </SheetHeader>
                <EditDocumentTypeForm
                    defaultValue={documentType}
                    onSubmit={handleUpdate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </SheetContent>
        </Sheet>
    )
};

export default EditDocumentTypeDialog

