import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 flex">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto  p-6  flex flex-col flex-grow ">
                    <div className="max-w-7xl mx-auto flex flex-col flex-grow w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;