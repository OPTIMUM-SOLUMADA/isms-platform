import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import AddDepartmentFormDialog from "../dialog/AddDepartmentDialog";

export const DepartmentUIModals = () => {
  const { isAddOpen, closeAdd } = useDepartmentUI();

  return (
    <>
      <AddDepartmentFormDialog onOpenChange={closeAdd} open={isAddOpen} />
      {/* <EditDepartmentFormDialog open={isEditOpen} />
      <DeleteDepartmentDialog open={isDeleteOpen} /> */}
    </>
  );
};