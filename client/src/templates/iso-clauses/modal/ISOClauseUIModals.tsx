import { useISOClauseUIStore } from "@/stores/iso-clause/useISOClauseUIStore";
import AddISOClauseDialog from "../dialog/AddISOClauseDialog";
import DeleteISOClauseDialog from "../dialog/DeleteISOClauseDialog";
import EditISOClauseDialog from "../dialog/EditISOClauseDialog";

export const ISOClauseUIModals = () => {
    const {
        isAddOpen,
        closeAdd,
        isDeleteOpen,
        isEditOpen,
        closeDelete,
        closeEdit,
        currentISOClause,
        setCurrentISOClause
    } = useISOClauseUIStore();

    function handleCloseDelete() {
        closeDelete();
        clear();
    }
    function handleCloseEdit() {
        closeEdit();
        clear();
    }

    function clear() {
        setTimeout(() => setCurrentISOClause(null), 1000);
    }

    return (
        <>
            <AddISOClauseDialog onOpenChange={closeAdd} open={isAddOpen} />
            {currentISOClause && (
                <DeleteISOClauseDialog
                    isoClause={currentISOClause}
                    open={isDeleteOpen}
                    onOpenChange={handleCloseDelete}
                />
            )}
            {currentISOClause && (
                <EditISOClauseDialog
                    isoClause={currentISOClause}
                    open={isEditOpen}
                    onOpenChange={handleCloseEdit}
                />
            )}
        </>
    );
};