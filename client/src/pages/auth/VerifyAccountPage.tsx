import { createSearchParams, Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/templates/layout/AuthLayout";
import WithTitle from "@/templates/layout/WithTitle";
import { useVerifyAccount } from "@/hooks/queries/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyAccountPage() {
    const { t } = useTranslation();
    const [isVerified, setIsVerified] = useState(false);
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
    const [searchParams, setSearchParams] = useState<string | null>(null);
    // get token from params
    const { token } = useParams();
    const { mutate: verify, isPending, error, isError } = useVerifyAccount();

    console.log(searchParams);

    const handleVerifyAccount = () => {
        if (token) verify({ token }, {
            onSuccess: (res) => {
                setIsVerified(true);
                setSearchParams(
                    createSearchParams({
                        token: res.data.token,
                        invitation: "true",
                    }).toString()
                );
            },
            onError: (err) => {
                if (err.response?.data.code === "ERR_USER_ALREADY_VERIFIED") {
                    setIsAlreadyVerified(true);
                }
                setIsVerified(false);
            },
        });
    }

    if (!token) return null;

    return (
        <WithTitle title={t("authentification.accountVerification.title")}>
            <AuthLayout>
                {!isVerified ? (
                    <Card className="shadow-lg max-w-md mx-auto">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                                {t("authentification.accountVerification.title")}
                            </CardTitle>
                            <p className="text-sm text-gray-600 text-center">
                                {t("authentification.accountVerification.subtitle")}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-gray-500 text-center">
                                {t("authentification.accountVerification.hint")}
                            </p>

                            {!isAlreadyVerified && (
                                <LoadingButton
                                    isLoading={isPending}
                                    onClick={handleVerifyAccount}
                                    disabled={!token}
                                    className="w-full"
                                    loadingText={t("authentification.accountVerification.actions.verify.loading")}
                                >
                                    {t("authentification.accountVerification.actions.verify.label")}
                                </LoadingButton>
                            )}

                            {isError && (
                                <p className="text-sm text-red-600 text-center">
                                    {t(`errors.${error.response?.data.code}`)}
                                </p>
                            )}

                            {isAlreadyVerified && (
                                <Link to={"/login"} className="text-inherit block">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        type="button"
                                    >
                                        {t("authentification.accountVerification.actions.login.label")}
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-lg max-w-md mx-auto">
                        <CardHeader className="space-y-3 pb-4">
                            <div className="flex justify-center">
                                <CheckCircle className="text-green-600 w-12 h-12" />
                            </div>
                            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                                {t("authentification.accountVerification.verified.title")}
                            </CardTitle>
                            <p className="text-sm text-gray-600 text-center">
                                {t("authentification.accountVerification.verified.message")}
                            </p>
                        </CardHeader>
                        {searchParams && (
                            <CardContent className="space-y-4">
                                <Link to={{
                                    pathname: "/reset-password",
                                    search: searchParams,
                                }} className="text-inherit">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        type="button"
                                    >
                                        {t("authentification.accountVerification.verified.actions.definePassword")}
                                    </Button>
                                </Link>
                                <p className="text-xs text-gray-500 text-center">
                                    {t("authentification.accountVerification.verified.hint")}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                )}
            </AuthLayout>
        </WithTitle>
    );
}
