import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "./ui/loading-button";

interface DeleteDialogProps {
    entityName: string; // e.g., "User", "Post"
    onConfirm: () => Promise<void> | void;
    trigger?: React.ReactNode; // optional trigger button
}

export const DeleteDialog: React.FC<DeleteDialogProps & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}> = ({ entityName, onConfirm, trigger, open: controlledOpen, onOpenChange }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            setLoading(false);
            setOpen(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <DialogTitle>
                            {t("components.deleteDialog.title", { entity: entityName })}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {t("components.deleteDialog.description", { entity: entityName })}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        {t("components.deleteDialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={handleConfirm}
                        isLoading={loading}
                        loadingText={t("components.deleteDialog.actions.confirm.loading")}
                    >
                        {t("components.deleteDialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
