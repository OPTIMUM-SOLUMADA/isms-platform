import React, { useState } from 'react';
import {
    User,
    Calendar,
    MapPin,
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
    TrendingUp,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    location: string;
    joinedDate: string;
    lastActive: string;
    permissions: string[];
    documentsOwned: number;
    reviewsCompleted: number;
    recentActivity: {
        id: string;
        action: string;
        document: string;
        timestamp: string;
    }[];
}

const userData: UserData = {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Information Security',
    role: 'ISMS Manager',
    location: 'New York, NY',
    joinedDate: '2023-01-15',
    lastActive: '2025-01-12T14:30:00Z',
    permissions: ['manage_all', 'approve_documents', 'manage_users', 'audit_access'],
    documentsOwned: 45,
    reviewsCompleted: 23,
    recentActivity: [
        {
            id: '1',
            action: 'Approved document',
            document: 'Information Security Policy v2.1',
            timestamp: '2025-01-12T14:30:00Z'
        },
        {
            id: '2',
            action: 'Created document',
            document: 'Access Control Procedure v1.6',
            timestamp: '2025-01-12T10:15:00Z'
        },
        {
            id: '3',
            action: 'Completed review',
            document: 'Risk Assessment Framework',
            timestamp: '2025-01-11T16:45:00Z'
        }
    ]
};

export default function UserProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location
    });

    const [notifications, setNotifications] = useState({
        reviews: true,
        approvals: true,
        updates: false,
        security: true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log('Saving user data:', formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            location: userData.location
        });
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const completionRate = Math.round((userData.reviewsCompleted / (userData.reviewsCompleted + 5)) * 100);

    return (
        <div className="space-y-6">
            {/* Hero Section with Profile */}
            <div className="relative bg-gradient-to-r from-theme via-green-800 to-indigo-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white/20">
                            <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                                {getInitials(userData.name)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white text-blue-600 hover:bg-gray-100"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                {userData.role}
                            </Badge>
                            <div className="flex items-center text-blue-100">
                                <Building className="h-4 w-4 mr-1" />
                                {userData.department}
                            </div>
                            <div className="flex items-center text-blue-100">
                                <MapPin className="h-4 w-4 mr-1" />
                                {userData.location}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <FileText className="h-6 w-6 text-blue-200" />
                                    <span className="text-2xl font-bold">{userData.documentsOwned}</span>
                                </div>
                                <p className="text-blue-100 text-sm">Documents Owned</p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="h-6 w-6 text-green-300" />
                                    <span className="text-2xl font-bold">{userData.reviewsCompleted}</span>
                                </div>
                                <p className="text-blue-100 text-sm">Reviews Completed</p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="h-6 w-6 text-yellow-300" />
                                    <span className="text-2xl font-bold">{completionRate}%</span>
                                </div>
                                <p className="text-blue-100 text-sm">Completion Rate</p>
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
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Joined</p>
                                            <p className="text-sm text-gray-600">{new Date(userData.joinedDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Last Active</p>
                                            <p className="text-sm text-gray-600">{formatTimestamp(userData.lastActive)}</p>
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
                            <div className="space-y-4">
                                {userData.recentActivity.map((activity, index) => (
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
                            </div>
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
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {userData.permissions.map((permission) => (
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
                        </CardContent>
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