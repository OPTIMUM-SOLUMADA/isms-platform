import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import AddDepartmentFormDialog from "../dialog/AddDepartmentDialog";
import DeleteDepartmentDialog from "../dialog/DeleteDepartmentDialog";
import EditDepartmentFormDialog from "../dialog/EditDepartmentDialog";

export const DepartmentUIModals = () => {
  const {
    isAddOpen,
    closeAdd,
    isDeleteOpen,
    isEditOpen,
    closeDelete,
    currentDepartment,
    closeEdit,
    setCurrentDepartment,
  } = useDepartmentUI();

  function handleCloseDelete() {
    closeDelete();
    clear();
  }
  function handleCloseEdit() {
    closeEdit();
    clear();
  }

  function clear() {
    setTimeout(() => setCurrentDepartment(null), 1000);
  }

  return (
    <>
      <AddDepartmentFormDialog onOpenChange={closeAdd} open={isAddOpen} />
      {currentDepartment && (
        <DeleteDepartmentDialog
          department={currentDepartment}
          open={isDeleteOpen}
          onOpenChange={handleCloseDelete}
        />
      )}
      {currentDepartment && (
        <EditDepartmentFormDialog
          department={currentDepartment}
          open={isEditOpen}
          onOpenChange={handleCloseEdit}
        />
      )}
    </>
  );
};