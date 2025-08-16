import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/templates/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/templates/layout/AuthLayout';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoggingIn, error } = useAuth();

    if (error) console.log(error);

    return (
        <AuthLayout>
            <Card className="shadow-lg">
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
                        onSubmit={login}
                        onForgotPassword={() => navigate("/forgot-password")}
                        error={error}
                        isPending={isLoggingIn}
                    />
                </CardContent>
            </Card>
        </AuthLayout>
    );
}