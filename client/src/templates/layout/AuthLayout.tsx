import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export default function AuthLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex flex-col w-full">
            <div className="w-full p-6 flex items-center justify-between">
                <img
                    src="/logo/solumada-long.png"
                    alt="logo"
                    className="w-auto h-10 rounded-full object-contain"
                />
                <LanguageSwitcher />
            </div>
            {/* Left Side - Logo + Title */}
            <div className="flex justify-center items-center flex-grow w-full max-w-7xl mx-auto">
                <div className="flex items-center justify-center w-full max-md:hidden">
                    <div className="w-80 h-80 rounded-full bg-gradient-to-b from-gray-100 via-white to-transparent aspect-square">
                        <img
                            src="/auth/iso27001-g.png"
                            alt=""
                            className="object-contain w-full mt-6"
                        />
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8 text-sm text-gray-500">
                <p>{t('authentification.copyright')}</p>
            </div>
        </div>
    );
}
