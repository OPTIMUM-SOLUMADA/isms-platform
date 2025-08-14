import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm, { type LoginFormData } from '@/templates/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import AuthLayout from '@/templates/layout/AuthLayout';

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
        <AuthLayout>
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
        </AuthLayout>
    );
}