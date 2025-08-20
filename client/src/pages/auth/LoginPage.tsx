import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/templates/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/templates/layout/AuthLayout';
import { useTranslation } from 'react-i18next';
import WithTitle from '@/templates/layout/WithTitle';

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, isLoggingIn, errorCode } = useAuth();

    return (
        <WithTitle title={t("authentification.login.title")}>
            <AuthLayout>
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900 ">
                            {t('authentification.login.title')}
                        </CardTitle>
                        <p className="text-sm text-gray-600 text-center">
                            {t('authentification.login.subtitle')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <LoginForm
                            onSubmit={login}
                            onForgotPassword={() => navigate("/forgot-password")}
                            error={errorCode}
                            isPending={isLoggingIn}
                        />
                    </CardContent>
                </Card>
            </AuthLayout>
        </WithTitle>
    );
}