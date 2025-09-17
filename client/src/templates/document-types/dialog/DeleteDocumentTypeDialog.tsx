
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { DocumentType } from "@/types";
import { useDeleteDocumentType } from "@/hooks/queries/useDocumentTypeMutations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentType;
}
const DeleteDocumentTypeDialog = ({
    open = false,
    onOpenChange,
    documentType,
}: Props) => {
    const { t } = useTranslation();
    const { mutate: deleteDocumentType, isPending } = useDeleteDocumentType();

    function handleClose() {
        onOpenChange(false);
    }

    const confirmDeletion = () => {
        deleteDocumentType(
            { id: documentType.id },
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    const hasDocuments = documentType.documents.length > 0;

    const cannotBeDeleted = hasDocuments;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("components.deleteDialog.title", { entity: documentType.name })}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {t("components.deleteDialog.description", { entity: documentType.name })}
                        <div className="mt-3 text-primary">

                            <p className="text-primary">
                                {t("documentType.forms.delete.dialog.message")}
                            </p>

                            <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                <li>{t("documentType.forms.delete.dialog.relatedItems.documents")}</li>
                            </ul>
                            {cannotBeDeleted ? (
                                <div className="mt-3 bg-amber-100 rounded-lg py-3 px-5 border border-amber-200">
                                    <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                        {hasDocuments && (
                                            <li className="text-amber-600 flex items-start gap-2">
                                                <TriangleAlert className="w-4 h-4 shrink-0" />
                                                {t("documentType.forms.delete.dialog.hasDocuments")}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ) : (
                                <p className="mt-3 text-theme-1 font-semibold flex items-center gap-2">
                                    <Info className="w-4 h-4 shrink-0" />
                                    {t("documentType.forms.delete.dialog.canBeDeleted")}
                                </p>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleClose}>
                        {t("components.deleteDialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={() => {
                            if (cannotBeDeleted) return;
                            confirmDeletion();
                        }}
                        isLoading={isPending}
                        disabled={cannotBeDeleted}
                        loadingText={t("components.deleteDialog.actions.confirm.loading")}
                    >
                        {t("components.deleteDialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDocumentTypeDialog;