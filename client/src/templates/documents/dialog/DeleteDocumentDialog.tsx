
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
import type { Document } from "@/types";
import { useDocument } from "@/contexts/DocumentContext";
import { useEffect, useMemo } from "react";
import { useDocumentUI } from "@/stores/useDocumentUi";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document;
}

const DeleteDocumentDialog = ({
    open = false,
    onOpenChange,
    document,
}: Props) => {
    const { t } = useTranslation();
    const { deleteDocument, isDeleting, isDeleted, resetDelete } = useDocument();
    const { setCurrentDocument } = useDocumentUI();

    useEffect(() => {
        if (isDeleted) {
            setCurrentDocument(null);
            onOpenChange(false);
            resetDelete();
        }
    }, [onOpenChange, isDeleted, setCurrentDocument, resetDelete]);

    const canBeDeleted = useMemo(() => !document.published, [document]);

    const relatedItems = [
        t("document.delete.dialog.relatedItems.versions"),
        t("document.delete.dialog.relatedItems.reviews"),
        t("document.delete.dialog.relatedItems.files"),
    ];

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentDocument(null);
        console.log(value);
        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("components.deleteDialog.title", { entity: document.title })}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {t("components.deleteDialog.description", { entity: document.title })}
                        <div className="mt-3 text-primary">

                            <p className="text-primary">
                                {t("document.delete.dialog.message")}
                            </p>

                            <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                {relatedItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            {(!canBeDeleted) ? (
                                <div className="mt-3 bg-amber-100 rounded-lg py-3 px-5 border border-amber-200">
                                    <p className="text-primary">
                                        {t("document.delete.dialog.cannotDeleteDescription")}
                                    </p>

                                    <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                        <li className="text-amber-600 flex items-start gap-2">
                                            <TriangleAlert className="w-4 h-4 shrink-0" />
                                            {t("document.delete.dialog.actions.documentPublished")}
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <p className="mt-3 text-theme-1 font-semibold flex items-center gap-2">
                                    <Info className="w-4 h-4 shrink-0" />
                                    {t("document.delete.dialog.canBeDeleted")}
                                </p>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        {t("components.deleteDialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={() => {
                            if (!canBeDeleted) return;
                            deleteDocument({ id: document.id });
                        }}
                        isLoading={isDeleting}
                        disabled={!canBeDeleted}
                        loadingText={t("components.deleteDialog.actions.confirm.loading")}
                    >
                        {t("components.deleteDialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDocumentDialog