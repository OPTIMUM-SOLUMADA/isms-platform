import { useDocumentTypeUIStore } from "@/stores/document-type/useDocumentTypeUIStore";
import EditDocumentTypeDialog from "../dialog/EditDocumentTypeDialog";
import AddDocumentTypeDialog from "../dialog/AddDocumentTypeDialog";
import DeleteDocumentTypeDialog from "../dialog/DeleteDocumentTypeDialog";

export const DocumentTypeUIModals = () => {
    const {
        isAddOpen,
        closeAdd,
        isDeleteOpen,
        isEditOpen,
        closeDelete,
        closeEdit,
        currentDocumentType,
        setCurrentDocumentType
    } = useDocumentTypeUIStore();

    function handleCloseDelete() {
        closeDelete();
        setCurrentDocumentType(null);
    }
    function handleCloseEdit() {
        closeEdit();
        setCurrentDocumentType(null);
    }

    return (
        <>
            <AddDocumentTypeDialog onOpenChange={closeAdd} open={isAddOpen} />
            {currentDocumentType && (
                <DeleteDocumentTypeDialog
                    documentType={currentDocumentType}
                    open={isDeleteOpen}
                    onOpenChange={handleCloseDelete}
                />
            )}
            {currentDocumentType && (
                <EditDocumentTypeDialog
                    documentType={currentDocumentType}
                    open={isEditOpen}
                    onOpenChange={handleCloseEdit}
                />
            )}
        </>
    );
};