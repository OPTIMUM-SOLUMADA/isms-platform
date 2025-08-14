import { Shield } from 'lucide-react';
import { PropsWithChildren } from 'react';
export default function AuthLayout({
    children
}: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-600 p-3 rounded-full">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ISMS SOLUMADA</h1>
                    <p className="text-gray-600">ISO 27001 Information Security Management System</p>
                </div>

                {children}

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2025 ISMS Portal. All rights reserved.</p>
                    <p className="mt-1">ISO 27001 Compliance Management System</p>
                </div>
            </div>
        </div>
    );
}