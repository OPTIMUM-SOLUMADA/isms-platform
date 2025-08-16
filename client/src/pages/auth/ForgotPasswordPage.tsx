import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ForgotPasswordForm, { type ForgotPasswordFormData } from '@/templates/forms/ForgotPasswordForm';
import AuthService from '@/services/authService';
import { useState } from 'react';
import AuthLayout from '@/templates/layout/AuthLayout';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
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
            {(isSuccess && email) ? (
                <Card className="shadow-lg bg-green-50">
                    <CardContent className="flex flex-col items-center gap-4 py-8">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                        <h2 className="text-xl font-semibold text-green-800 text-center">
                            {t("authentification.forgotPassword.success.title")}
                        </h2>
                        <p
                            className="text-center text-green-900"
                            dangerouslySetInnerHTML={{
                                __html: t("authentification.forgotPassword.success.message", { email })
                            }}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                            {t('authentification.forgotPassword.title')}
                        </CardTitle>
                        <p className="text-sm text-gray-600 text-center">
                            {t('authentification.forgotPassword.subtitle')}
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