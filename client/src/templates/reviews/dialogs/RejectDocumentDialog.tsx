import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { DocumentReview } from "@/types";
import { useDocumentUI } from "@/stores/document/useDocumentUi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useSubmitReview } from "@/hooks/queries/useReviewMutation";
import { useToast } from "@/hooks/use-toast";
import RTERichText from "@/components/RTERichText";
import { isEmptyHtml } from "@/lib/rte";

const rejectSchema = z.object({
    comment: z
        .string()
        .min(5, "Please provide at least 5 characters for your reason.")
        .max(3000, "Comment is too long."),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: DocumentReview;
    onSuccess?: () => void;
}

const RejectDocumentDialog = ({
    open = false,
    onOpenChange,
    item,
    onSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { setCurrentDocument } = useDocumentUI();
    const { toast } = useToast();
    const { document } = item;

    const { mutate: submitReview, isPending } = useSubmitReview(item.id);

    const form = useForm<RejectFormValues>({
        resolver: zodResolver(rejectSchema),
        defaultValues: { comment: "" },
    });

    const commentValue = form.watch("comment");

    function handleOpenChange(value: boolean) {
        if (!value) {
            form.reset();
            setCurrentDocument(null);
        }
        onOpenChange(value);
    }

    async function handleSubmit(values: RejectFormValues) {
        submitReview({
            decision: "REJECT",
            comment: values.comment,
        }, {

            onSuccess: () => {
                toast({
                    title: t("reviewApproval.dialogs.reject.toast.success.title"),
                    description: t("reviewApproval.dialogs.reject.toast.success.description"),
                    variant: "success"
                });
                handleOpenChange(false);
                onSuccess?.();
            },
            onError: () => {
                toast({
                    title: t("reviewApproval.dialogs.reject.toast.error.title"),
                    description: t("reviewApproval.dialogs.reject.toast.error.description"),
                    variant: "success"
                });
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6 mt-4"
                    >
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-6 h-6 text-theme-danger" />
                                <DialogTitle>
                                    {t("reviewApproval.dialogs.reject.title", {
                                        entity: document?.title,
                                    })}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="mt-3 text-primary">
                                {t("reviewApproval.dialogs.reject.message")}
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("reviewApproval.dialogs.reject.form.reason.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <RTERichText
                                            placeholder={t(
                                                "reviewApproval.dialogs.reject.form.reason.placeholder"
                                            )}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        {t("reviewApproval.dialogs.reject.description")}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleOpenChange(false)}
                            >
                                {t("reviewApproval.dialogs.reject.actions.cancel.label")}
                            </Button>

                            <LoadingButton
                                type="submit"
                                isLoading={isPending}
                                disabled={isEmptyHtml(commentValue)}
                                loadingText={t(
                                    "reviewApproval.dialogs.reject.actions.confirm.loading"
                                )}
                            >
                                {t("reviewApproval.dialogs.reject.actions.confirm.label")}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default RejectDocumentDialog;
