import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm, { type LoginFormData } from '@/templates/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoginPending, setIsLoginPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleFormSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoginPending(true);
        const error = await login(data.email, data.password);
        setError(error);
        setIsLoginPending(false);
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
                            onForgotPassword={() => navigate("/forgot-password")}
                            error={error}
                            isPending={isLoginPending}
                        />
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2025 ISMS SOLUMADA.</p>
                    <p className="mt-1">ISO 27001 Compliance Management System</p>
                </div>
            </div>
        </div>
    );
}