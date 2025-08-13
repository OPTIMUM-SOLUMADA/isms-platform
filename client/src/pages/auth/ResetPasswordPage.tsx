import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm, { type LoginFormData } from '@/templates/forms/LoginForm';

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (data: LoginFormData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.email);

        navigate("/reset-password");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-600 p-3 rounded-full">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ISMS SOLUMADA</h1>
                    <p className="text-gray-600">ISO 27001 Information Security Management System</p>
                </div>

                {/* Login Card */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                            Sign In
                        </CardTitle>
                        <p className="text-sm text-gray-600 text-center">
                            Enter your credentials to access the ISMS portal
                        </p>
                    </CardHeader>
                    <CardContent>

                        <LoginForm
                            onSubmit={handleFormSubmit}
                        />

                        {/* Demo Credentials */}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2025 ISMS Portal. All rights reserved.</p>
                    <p className="mt-1">ISO 27001 Compliance Management System</p>
                </div>
            </div>
        </div>
    );
}