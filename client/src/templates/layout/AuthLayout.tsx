import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col w-full">
            {/* Left Side - Logo + Title */}
            <div className="flex justify-center items-center flex-grow w-full max-w-7xl mx-auto">
                <div className="flex items-center justify-center w-full max-md:hidden">
                    <div className="w-80 h-80 rounded-full bg-gradient-to-b from-gray-100 via-white to-transparent aspect-square">
                        <img
                            src="./auth/iso27001-g.png"
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
            <div className="text-center mt-2 text-sm text-gray-500 py-4">
                <p>© 2025 ISMS Solumada. All rights reserved.</p>
                <p className="mt-1">ISO 27001 Compliance Management System</p>
            </div>
        </div>
    );
}
