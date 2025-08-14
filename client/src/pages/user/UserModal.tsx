import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";

interface UserModalProps {
    user?: User;
    onClose: () => void;
    onSave: (user: User) => void;
}
export default function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [form, setForm] = useState<Omit<User, "id" | "joinedDate" | "permissions">>({
    name: "",
    email: "",
    role: "viewer",
    department: "",
    status: "active",
    lastActive: "",
    documents: 0,
    reviews: 0,
  });

  // si user est défini => remplir le form pour l'édition
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        lastActive: user.lastActive,
        documents: user.documents,
        reviews: user.reviews,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof typeof form, val: string) => {
    setForm((prev)=>({...prev, [field]: val}));
  };

  const handleSubmit = () => {
    // Construction d'un User complet
    const newUser: User = {
      id: user?.id || crypto.randomUUID(), // Génère un ID unique
      joinedDate: user?.joinedDate || new Date().toISOString(),
      permissions: user?.permissions || [],
      ...form
    };
    onSave(newUser);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="department" placeholder="Department" value={form.department} onChange={handleChange} />

          <Select value={form.role} onValueChange={(val) => handleSelectChange("role", val as typeof form.role)}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={form.status} onValueChange={(val) => handleSelectChange("status", val as typeof form.status)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{user ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
