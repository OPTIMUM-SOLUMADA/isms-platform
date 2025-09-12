import React, { useEffect, useState } from 'react';
import {
    User,
    Calendar,
    Building,
    Shield,
    Edit,
    Save,
    X,
    Camera,
    Key,
    Bell,
    FileText,
    Activity,
    Clock,
    Settings,
    Award,
    CheckCircle,
    Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

import { Switch } from '@/components/ui/switch';
import { useParams } from 'react-router-dom';
import { userService } from '@/services/userService';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { roles } from '@/constants/role';
import { depService } from '@/services/departmentService';
import { UserAvatar } from '@/components/user-avatar';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import BackButton from '@/components/BackButton';

interface UserData {
    id: string;
    name: string;
    email: string;
    // phone: string;
    department: {
        id: string;
        name: string;
    };
    role: string;
    // location: string;
    // joinedDate: string;
    // lastActive: string;
    lastLogin: string;
    ownedDocuments: string;
}
interface Department {
    id: string;
    name: string;
}

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        department: ""
    });
    const [departments, setDepartment] = useState<Department[]>([]);

    const [notifications, setNotifications] = useState({
        reviews: true,
        approvals: true,
        updates: false,
        security: true
    });

    const { t } = useTranslation();

    useEffect(() => {

        async function fetchUser() {
            try {
                const res = await userService.getById(id!);
                const data = res.data;

                setUserData(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    role: data.role || '',
                    department: data.department.id || ''
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        async function fetchDepartment() {
            try {
                const allDepart = await depService.list();
                const depart = allDepart.data;
                setDepartment(depart);
            } catch (error) {
                console.error('Error fetching department data:', error);
            }
        }
        fetchUser()
        fetchDepartment()

    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (!userData) return;
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                departmentId: formData.department
            }

            console.log("udp", updateData);

            await userService.update(id!, updateData);
            // Mettre à jour les données locales
            const updatedUser = await userService.getById(userData.id);
            setUserData(updatedUser.data);

            setIsEditing(false);

            // Optionnel: Afficher un message de succès
            console.log('Profil mis à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (!userData) return;
        setFormData({
            name: userData?.name || '',
            email: userData?.email || '',
            role: userData?.role || '',
            department: userData?.department?.id || ''
        });
        setIsEditing(false);
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    // const completionRate = Math.round((userData?.reviewsCompleted / (userData.reviewsCompleted + 5)) * 100);

    return (
        <div className="space-y-6">
            <BreadcrumbNav
                items={[
                    { label: t("user.title"), href: "/documents" },
                    { label: t("user.view.title") },
                ]}
                className="mb-3"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <BackButton />
                <div>
                    <h1 className="page-title">{t("user.view.title")}</h1>
                    <p className="page-description">{t("user.view.subtitle")}</p>
                </div>
            </div>
            {/* Hero Section with Profile */}
            <div className="relative bg-gradient-to-r from-theme via-green-800 to-indigo-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="relative">
                        {userData && (
                            <UserAvatar
                                className="h-24 w-24 border-4 border-white/20"
                                name={userData.name}
                                id={userData.id}
                            />
                        )}
                        <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white text-white hover:bg-gray-100"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{userData?.name || ''}</h1>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                {userData?.role || ''}
                            </Badge>
                            <div className="flex items-center text-blue-100">
                                <Building className="h-4 w-4 mr-1" />
                                {userData?.department?.name || ''}
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Mail className="h-4 w-4 mr-1" />
                                {userData?.email || ''}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <FileText className="h-6 w-6 text-blue-200" />
                                    <span className="text-2xl font-bold">{userData?.ownedDocuments}</span>
                                </div>
                                <p className="text-blue-100 text-sm">Documents Owned</p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="h-6 w-6 text-green-300" />
                                    {/* <span className="text-2xl font-bold">{userData?.reviewsCompleted}</span> */}
                                </div>
                                <p className="text-blue-100 text-sm">Reviews Completed</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="border-b rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <span>Personal Information</span>
                                </CardTitle>
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button onClick={handleCancel} variant="outline" size="sm">
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        // onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, role: value }))
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('user.forms.update.department.placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role, index) => (
                                                <SelectItem key={index} value={role}>
                                                    {t(`user.forms.update.role.options.${role.toLowerCase()}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, department: value }))
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('user.forms.update.department.placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((department) => (
                                                <SelectItem key={department.id} value={department.id}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Joined</p>
                                            {/* <p className="text-sm text-gray-600">{new Date(userData?.joinedDate || '').toLocaleDateString()}</p> */}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Last Active</p>
                                            <p className="text-sm text-gray-600">{formatTimestamp(userData?.lastLogin || '')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-0 shadow-none">
                        <CardHeader className="border-b rounded-t-lg">
                            <CardTitle className="flex items-center space-x-2">
                                <Activity className="h-5 w-5 text-green-600" />
                                <span>Recent Activity</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* <div className="space-y-4">
                                {userData?.recentActivity.map((activity, index) => (
                                    <div key={activity.id} className="flex items-start space-x-4">
                                        <div className={`w-3 h-3 rounded-full mt-2 ${index === 0 ? 'bg-green-500' :
                                            index === 1 ? 'bg-blue-500' : 'bg-gray-400'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{activity.document}</p>
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                            <Button variant="outline" className="w-full mt-4">
                                <FileText className="h-4 w-4 mr-2" />
                                View Full Activity Log
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Permissions */}
                    <Card className="border-0 shadow-none">
                        <CardHeader className="border-b rounded-t-lg">
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                <span>Permissions</span>
                            </CardTitle>
                        </CardHeader>
                        {/* <CardContent className="p-6">
                            <div className="space-y-3">
                                {userData?.permissions.map((permission) => (
                                    <div key={permission} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <span className="text-sm font-medium text-purple-900 capitalize">
                                            {permission.replace('_', ' ')}
                                        </span>
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                            Active
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent> */}
                    </Card>

                    {/* Notification Settings */}
                    <Card className="border-0 shadow-none">
                        <CardHeader className="border-b rounded-t-lg">
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5 text-orange-600" />
                                <span>Notifications</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Review Reminders</p>
                                        <p className="text-xs text-gray-500">Document review notifications</p>
                                    </div>
                                    <Switch
                                        checked={notifications.reviews}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reviews: checked }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Approval Requests</p>
                                        <p className="text-xs text-gray-500">Documents awaiting approval</p>
                                    </div>
                                    <Switch
                                        checked={notifications.approvals}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, approvals: checked }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">System Updates</p>
                                        <p className="text-xs text-gray-500">Important announcements</p>
                                    </div>
                                    <Switch
                                        checked={notifications.updates}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, updates: checked }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Security Alerts</p>
                                        <p className="text-xs text-gray-500">Security-related notifications</p>
                                    </div>
                                    <Switch
                                        checked={notifications.security}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, security: checked }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-none">
                        <CardHeader className="border-b rounded-t-lg">
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5 text-gray-600" />
                                <span>Quick Actions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <Key className="h-4 w-4 mr-2" />
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export My Data
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Award className="h-4 w-4 mr-2" />
                                    View Certificates
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}



