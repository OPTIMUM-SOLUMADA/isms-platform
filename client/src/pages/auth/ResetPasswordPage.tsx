import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResetPasswordForm, { type ResetFormData } from '@/templates/forms/ResetPasswordForm';
import AuthLayout from '@/templates/layout/AuthLayout';

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (data: ResetFormData) => {
        console.log(data);
        navigate("/login");
    };

    return (
        <AuthLayout>
            <Card className="shadow-lg border-0">
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
                    />
                </CardContent>
            </Card>
        </AuthLayout>
    );
}