import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import AddDepartmentFormDialog from "../dialog/AddDepartmentDialog";
import DeleteDepartmentDialog from "../dialog/DeleteDepartmentDialog";

export const DepartmentUIModals = () => {
  const { isAddOpen, closeAdd, isDeleteOpen, closeDelete, currentDepartment, setCurrentDepartment } = useDepartmentUI();

  function handleCloseDelete() {
    closeDelete();
    setCurrentDepartment(null);
  }

  return (
    <>
      <AddDepartmentFormDialog onOpenChange={closeAdd} open={isAddOpen} />
      {/* <EditDepartmentFormDialog open={isEditOpen} /> */}
      {currentDepartment && (
        <DeleteDepartmentDialog
          department={currentDepartment}
          open={isDeleteOpen}
          onOpenChange={handleCloseDelete}
        />
      )}
    </>
  );
};