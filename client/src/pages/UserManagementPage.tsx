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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from '@/contexts/UserContext';
import AddUserForm, { AddUserFormData } from '@/templates/forms/users/AddUserForm';
import { UserTable } from '@/templates/table/UserTable';
import { roles, RolesObject } from '@/constants/role';
import { User } from '@/types';
import { UsersStatusObject, userStatus } from '@/constants/status';
import SearchInput from '@/components/SearchInput';
import { useUserUI } from '@/contexts/ui/UserUIContext';
import { useTranslation } from 'react-i18next';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useToast } from '@/hooks/use-toast';
import UpdateUserForm from '@/templates/forms/users/EditUserForm';

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const { toast } = useToast();

  const {
    users,
    createUser,
    deleteUser,
    createError,
    isCreating,
    selectedUser,
    setSelectedUser
  } = useUser();

  const { departments } = useDepartment();

  const {
    isAddOpen, openAdd, closeAdd,
    isEditOpen, openEdit, closeEdit
  } = useUserUI();

  const filteredUsers = useMemo(() => users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user.department.id === filterDepartment;
    const matchesStatus = filterStatus === 'all' || user.isActive === UsersStatusObject[filterStatus as keyof typeof UsersStatusObject];

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  }), [filterDepartment, filterRole, searchTerm, users, filterStatus]);

  const roleStats = {
    admin: users.filter(u => u.role === RolesObject.ADMIN).length,
    reviewer: users.filter(u => u.role === RolesObject.REVIEWER).length,
    viewer: users.filter(u => u.role === RolesObject.VIEWER).length
  };

  const handleAddUser = useCallback(async (newUser: AddUserFormData) => {
    const res = await createUser(newUser);
    if (res) {
      closeAdd();
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "success",
      })
    };
  }, [createUser, closeAdd, toast]);

  const handleDeleteUser = useCallback(async (user: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(user.id);
    }
  }, [deleteUser]);

  const handleOpenEditForm = useCallback(async (user: User) => {
    setSelectedUser(user);
    openEdit();
  }, [openEdit, setSelectedUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={openAdd} className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {Object.entries(roleStats).map(([role, count]) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{role}s</p>
                  <p className="text-2xl font-bold">{count}</p>
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
                placeholder='Search by name, email or department'
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
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {userStatus.map((status, index) => (
                    <SelectItem key={index} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
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
        onDelete={handleDeleteUser}
        onAddUser={openAdd}
      />

      {/* Modal to add user */}
      <Dialog open={isAddOpen} onOpenChange={closeAdd}>
        <DialogContent className='bg-gray-50'>
          <DialogHeader>
            <DialogTitle>{t("Add new user")}</DialogTitle>
          </DialogHeader>
          <AddUserForm
            departments={departments}
            onSubmit={handleAddUser}
            onCancel={closeAdd}
            isPending={isCreating}
            error={createError}
          />
        </DialogContent>
      </Dialog>

      {/* Modal to edit user */}
      {selectedUser && (
        <Dialog open={isEditOpen} onOpenChange={closeEdit}>
          <DialogContent className='bg-gray-50'>
            <DialogHeader>
              <DialogTitle>{t("Update user")}</DialogTitle>
            </DialogHeader>
            <UpdateUserForm
              departments={departments}
              onSubmit={handleAddUser}
              onCancel={closeAdd}
              isPending={isCreating}
              error={createError}
              user={selectedUser}
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}