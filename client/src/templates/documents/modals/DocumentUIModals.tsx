
import { useDocumentUI } from "@/stores/document/useDocumentUi";
import DeleteDocumentDialog from "../dialog/DeleteDocumentDialog";

export const DocumentUIModals = () => {
    const {
        isDeleteOpen,
        currentDocument,
        openDelete,
        closeDelete,
    } = useDocumentUI();

    return (
        <>
            {currentDocument && (
                <DeleteDocumentDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => (open ? openDelete() : closeDelete())}
                    document={currentDocument}
                />
            )}
        </>
    );
};
