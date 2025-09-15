import { useDepartmentUI } from "@/stores/useDepartmentUI";
import { AddDepartmentFormDialog } from "@/templates/departments/dialog/AddDepartment";

export const DepartmentUIModal = () => {
  const { isAddOpen, } = useDepartmentUI(); 
  
  return (
    <>
      <AddDepartmentFormDialog open={isAddOpen} />
      {/* <EditDepartmentFormDialog open={isEditOpen} />
      <DeleteDepartmentDialog open={isDeleteOpen} /> */}
    </>
  );
};