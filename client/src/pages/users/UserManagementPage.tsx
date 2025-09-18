import { useCallback, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserTable } from '@/templates/users/table/UserTable';
import { roles, RolesObject } from '@/constants/role';
import { RoleType, User } from '@/types';
import { UsersStatusObject, userStatus } from '@/constants/status';
import SearchInput from '@/components/SearchInput';
import { useUserUIStore } from '@/stores/user/useUserUIStore';
import { useTranslation } from 'react-i18next';
import WithTitle from '@/templates/layout/WithTitle';
import { usePermissions } from '@/hooks/use-permissions';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { userRoleColors } from '@/constants/color';
import useUserStore from '@/stores/user/useUserStore';
import useDepartmentStore from '@/stores/department/useDepatrmentStore';
import { useFetchUsers } from '@/hooks/queries/useUserMutations';

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const navigate = useNavigate();
  const { hasActionPermission } = usePermissions();

  const { users } = useUserStore();
  const { isLoading } = useFetchUsers();

  const { departments } = useDepartmentStore();

  const {
    openAdd,
    openEdit,
    setCurrentUser
  } = useUserUIStore();

  const filteredUsers = useMemo(() => users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user.department.id === filterDepartment;
    const matchesStatus = filterStatus === 'all' || user.isActive === UsersStatusObject[filterStatus as keyof typeof UsersStatusObject];

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  }), [filterDepartment, filterRole, searchTerm, users, filterStatus]);

  const roleStats: Record<RoleType, number> = {
    ADMIN: users.filter(u => u.role === RolesObject.ADMIN).length,
    CONTRIBUTOR: users.filter(u => u.role === RolesObject.CONTRIBUTOR).length,
    REVIEWER: users.filter(u => u.role === RolesObject.REVIEWER).length,
    VIEWER: users.filter(u => u.role === RolesObject.VIEWER).length
  } as const;

  const handleOpenEditForm = useCallback(async (user: User) => {
    setCurrentUser(user);
    openEdit();
  }, [openEdit, setCurrentUser]);

  const handleOpenView = useCallback((user: User) => {
    navigate(`view/${user.id}`, { state: { user } });
  }, [navigate]);

  const handleOpenMessage = useCallback((user: User) => {
    window.open(`mailto:${user.email}`);
  }, []);

  return (
    <WithTitle title={t("user.title")}>
      <div className="space-y-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">{t("user.title")}</h1>
            <p className="page-description">{t("user.subtitle")}</p>
          </div>
          {hasActionPermission("user.create") && (
            <Button onClick={openAdd} className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>{t("user.actions.add.label")}</span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">{t("user.stats.total.title")}</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {Object.entries(roleStats).map(([role, count]) => (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t(`user.stats.${role.toLowerCase()}.title`)}
                    </p>
                    <p className={cn(
                      "text-2xl font-bold",
                      userRoleColors[role as RoleType],
                      "bg-transparent"
                    )}>{count}</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder={t("user.filters.search.placeholder")}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("user.filters.role.placeholder")}</SelectItem>
                    {roles.map((role, index) => (
                      <SelectItem key={index} value={role}>
                        {t(`user.role.${role.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("user.filters.status.placeholder")}</SelectItem>
                    {userStatus.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {t(`user.status.${status.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("user.filters.department.placeholder")}</SelectItem>
                    {departments.map((dept, index) => (
                      <SelectItem key={index} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <UserTable
          data={filteredUsers}
          onEdit={handleOpenEditForm}
          onAddUser={openAdd}
          onView={handleOpenView}
          onMessage={handleOpenMessage}
          isLoading={isLoading}
        />

      </div>
    </WithTitle>
  );
}