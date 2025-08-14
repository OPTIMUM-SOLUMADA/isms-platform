import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ForgotPasswordForm, { type ForgotPasswordFormData } from '@/templates/forms/ForgotPasswordForm';
import AuthService from '@/services/authService';
import { useState } from 'react';
import AuthLayout from '@/templates/layout/AuthLayout';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);

    const handleFormSubmit = async (data: ForgotPasswordFormData) => {
        setError(null);
        setEmail(null)
        setIsPending(true);
        AuthService.resetPassword(data.email).then(res => {
            console.log(res);
            setEmail(data.email);
            setIsSuccess(true);
        }).catch(err => {
            setError(err.response.data.error);
        }).finally(() => {
            setIsPending(false);
        })
    };

    return (
        <AuthLayout>
            {isSuccess ? (
                <Card className="border-0 shadow-lg bg-green-50">
                    <CardContent className="flex flex-col items-center gap-4 py-8">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                        <h2 className="text-xl font-semibold text-green-800 text-center">
                            Request Sent!
                        </h2>
                        <p className="text-center text-green-900">
                            A password reset link has been sent to <strong>{email}</strong>.
                            <br />
                            Please check your inbox and follow the instructions to reset your password.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg border-0">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                            Reset password
                        </CardTitle>
                        <p className="text-sm text-gray-600 text-center">
                            Enter your credentials to access the ISMS portal
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ForgotPasswordForm
                            onSubmit={handleFormSubmit}
                            onClickBack={() => navigate("/login")}
                            isPending={isPending}
                            error={error}
                        />
                    </CardContent>
                </Card>
            )}
        </AuthLayout>
    );
}