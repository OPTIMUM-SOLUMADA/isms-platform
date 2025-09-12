import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';

function Layout() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useLocalStorage(`sidebar-open-${user?.id}`, true);

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
                    <div className="max-w-8xl mx-auto flex flex-col flex-grow w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;