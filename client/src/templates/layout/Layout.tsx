import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

function Layout() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useLocalStorage(`sidebar-open-${user?.id}`, true);
    const { pathname } = useLocation();

    const expand = useMemo(() => [
        '/document-editor/',
        '/patch-document-version/',
    ].some(p => pathname.startsWith(p)
    ), [pathname]);

    return (
        <div className="h-screen bg-muted flex">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto p-6 flex flex-col flex-grow">
                    <div className={cn("max-w-8xl mx-auto flex flex-col flex-grow w-full h-full", expand && "max-w-full")}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;