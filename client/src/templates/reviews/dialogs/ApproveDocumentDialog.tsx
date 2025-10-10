
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { Document } from "@/types";
import { useDocumentUI } from "@/stores/document/useDocumentUi";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document;
}

const ApproveDocumentDialog = ({
    open = false,
    onOpenChange,
    document,
}: Props) => {
    const { t } = useTranslation();
    const { setCurrentDocument } = useDocumentUI();

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentDocument(null);
        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("reviewApproval.dialogs.approve.title", { entity: document.title })}
                        </DialogTitle>
                    </div>
                    <DialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t("reviewApproval.dialogs.approve.description", { entity: document.title })
                        }}
                    />
                    <p className="mt-3 text-primary">
                        {t("reviewApproval.dialogs.approve.message")}
                    </p>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        {t("reviewApproval.dialogs.approve.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        onClick={() => {
                        }}
                        isLoading={false}
                        loadingText={t("reviewApproval.dialogs.approve.actions.confirm.loading")}
                    >
                        {t("reviewApproval.dialogs.approve.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ApproveDocumentDialog;