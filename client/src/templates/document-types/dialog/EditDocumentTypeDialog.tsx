import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useCreateDocumentType } from "@/hooks/queries/useDocumentTypeMutations";
import { AddDocumentTypeFormData } from "../forms/AddDocumentTypeForm";
import EditDocumentTypeForm from "../forms/EditDocumentTypeForm";
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='card-header-bg'>
                <DialogHeader>
                    <DialogTitle>{t("documentType.forms.add.title")}</DialogTitle>
                    <DialogDescription>{t("documentType.forms.add.subtitle")}</DialogDescription>
                </DialogHeader>
                <EditDocumentTypeForm
                    defaultValue={documentType}
                    onSubmit={handleCreate}
                    error={error?.response?.data.code}
                    onCancel={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>
    )
};

export default EditDocumentTypeDialog

