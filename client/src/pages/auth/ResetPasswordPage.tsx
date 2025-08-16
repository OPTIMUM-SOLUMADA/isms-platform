import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResetPasswordForm, { type ResetFormData } from '@/templates/forms/ResetPasswordForm';
import AuthLayout from '@/templates/layout/AuthLayout';
import { useCallback, useEffect, useState } from 'react';
import AuthService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useChangePassword } from '@/hooks/queries/useAuth';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const { login, error: loginError } = useAuth();
    const {
        mutateAsync: changePassword,
        isPending,
        error: changePasswordError
    } = useChangePassword();

    useEffect(() => {
        if (!token) return;

        AuthService.verifyResetToken(token)
            .then(res => {
                setEmail(res.data.email);
            }).catch(err => {
                setTokenError(err.response.data.error);
            });

    }, [token]);

    const handleFormSubmit = useCallback(
        async (formData: ResetFormData) => {
            if (!email || !token) return;

            try {
                await changePassword({ resetToken: token, password: formData.password });

                if (formData.keepSignedIn) {
                    await login({
                        email: email,
                        password: formData.password
                    });
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Change password failed:", err);
            }
        },
        [email, token, changePassword, login, navigate]
    );

    if (tokenError) return (
        <AuthLayout>
            <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                        Error
                    </CardTitle>
                    <p className="text-sm text-gray-600 text-center my-4">
                        {tokenError}
                    </p>
                </CardHeader>
                <CardContent className='flex'>
                    <Button onClick={() => navigate("/login")} className='mx-auto'>Go back to login</Button>
                </CardContent>
            </Card>
        </AuthLayout>
    )

    return (
        <AuthLayout>
            <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                        Change your password
                    </CardTitle>
                    <p className="text-sm text-gray-600 text-center">
                        Enter your new password, then submit
                    </p>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm
                        onSubmit={handleFormSubmit}
                        isPending={isPending}
                        error={changePasswordError?.response?.data.error || loginError}
                    />
                </CardContent>
            </Card>
        </AuthLayout>
    );
}