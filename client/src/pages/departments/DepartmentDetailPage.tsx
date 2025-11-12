import { Button } from "@/components/ui/button";
import { Calendar, Layers, Plus, User } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/date";
import { useDepartmentRoleUI } from "@/stores/department/useDepartmentRoleUI";
import { DepartmentRoleTable } from "@/templates/departments/table/DepartmentRoleTable";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";
import { useFetchDepartmentRoles } from "@/hooks/queries/useDepartmentRoleMutations";
import { useFetchDepartment } from "@/hooks/queries/useDepartmentMutations";

export default function DepartmentDetailPage() {

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { setCurrentDepartment } = useDepartmentStore();

  const { openAdd } = useDepartmentRoleUI();

  const { data, isLoading } = useFetchDepartmentRoles(id);
  const { data: departmentRes } = useFetchDepartment(id);

  const department = departmentRes?.data;

  const departmentRoles = data?.data?.departmentRoles || [];

  useEffect(() => {
    if (department) {
      setCurrentDepartment(department);
    }

    return () => {
      setCurrentDepartment(null);
    }
  }, [department, setCurrentDepartment]);

  if (isLoading) return <>Loading...</>;

  return (
    <div className="md:flex-row justify-between items-start md:items-center gap-4">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="page-title">{t("department.hovercard.title")}</h1>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <Button className="flex items-center space-x-2" variant="primary" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            <span>{t("user.forms.add.fonction.placeholder")}</span>
          </Button>
        </div>
      </div>

      <Card className='flex-grow flex flex-col'>
        <CardHeader>
          {/* <CardTitle>{department.name}</CardTitle> */}
        </CardHeader>
        <CardContent>
          {department && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("departmentRole.forms.add.name.placeholder")}:</span>
                {department.name}
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("documentType.table.columns.description")}:</span>
                {department.description}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("documentType.table.columns.createdBy")}:</span>
                <div className="flex items-center gap-1">{department.createdBy?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("documentType.table.columns.createdAt")}:</span>
                <div className="flex items-center gap-1">
                  <span>
                    {formatDate(department.createdAt, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      minute: "numeric",
                      hour: "numeric",
                      second: "numeric",
                    }, 'en-US')}
                  </span>
                </div>

              </div>
            </div>

          )}
        </CardContent>
      </Card>
      <Card className='flex-grow flex flex-col'>
        <DepartmentRoleTable
          data={departmentRoles}
        />
      </Card>
    </div>
  );
}
