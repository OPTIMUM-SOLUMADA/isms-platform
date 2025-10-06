import AddDepartmentRoleFormDialog from "../dialog/AddDepartmentRoleDialog";
import DeleteDepartmentRoleDialog from "../dialog/DeleteDepartmentRoleDialog";
import EditDepartmentRoleFormDialog from "../dialog/EditDepartmentRoleDialog";
import { useDepartmentRoleUI } from "@/stores/department/useDepartmentRoleUI";

export const DepartmentRoleUIModals = () => {
  const {
    isAddOpen,
    closeAdd,
    isDeleteOpen,
    isEditOpen,
    closeDelete,
    currentDepartmentRole,
    closeEdit,
    setCurrentDepartmentRole,
  } = useDepartmentRoleUI();
  
  function handleCloseDelete() {
    closeDelete();
    clear();
  }
  function handleCloseEdit() {
    closeEdit();
    clear();
  }

  function clear() {
    setTimeout(() => setCurrentDepartmentRole(null), 1000);
  }

  return (
    <>
      <AddDepartmentRoleFormDialog onOpenChange={closeAdd} open={isAddOpen} />
      {currentDepartmentRole && (
        <DeleteDepartmentRoleDialog
          departmentRole={currentDepartmentRole}
          open={isDeleteOpen}
          onOpenChange={handleCloseDelete}
        />
      )}
      {currentDepartmentRole && (
        <EditDepartmentRoleFormDialog
          departmentRole={currentDepartmentRole}
          open={isEditOpen}
          onOpenChange={handleCloseEdit}
        />
      )}
    </>
  );
};