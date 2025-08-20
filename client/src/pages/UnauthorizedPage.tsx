import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoHome = () => {
        navigate(-1);
    };

    return (
        <div className="flex items-center justify-center flex-grow bg-gray-50 p-4">
            <Card className="max-w-md w-full shadow-lg rounded-2xl">
                <CardHeader className="flex flex-col items-center gap-2">
                    <AlertCircle className="text-red-500 w-16 h-16" />
                    <CardTitle className="text-2xl text-center">
                        {t("unauthorized.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <CardDescription className="mb-4">
                        {t("unauthorized.subtitle")}
                    </CardDescription>
                    <Button variant="default" onClick={handleGoHome}>
                        {t("unauthorized.actions.goBack.label")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnauthorizedPage;
