import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import AddDepartmentFormDialog from "../dialog/AddDepartmentDialog";
import DeleteDepartmentDialog from "../dialog/DeleteDepartmentDialog";
import EditDepartmentFormDialog from "../dialog/EditDepartmentDialog";

export const DepartmentUIModals = () => {
  const { isAddOpen, closeAdd, isDeleteOpen, isEditOpen, closeDelete, currentDepartment, setCurrentDepartment } = useDepartmentUI();

  function handleCloseDelete() {
    closeDelete();
    setCurrentDepartment(null);
  }
  function handleCloseEdit() {
    closeDelete();
    setCurrentDepartment(null);
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