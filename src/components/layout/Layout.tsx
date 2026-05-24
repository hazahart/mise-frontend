import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            <Navbar
                onMenuClick={() => setSidebarOpen(prev => !prev)}
                menuOpen={sidebarOpen}
            />
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <main className="md:ml-60 mt-16 p-4 md:p-8 min-h-[calc(100vh-4rem)]">
                <Outlet/>
            </main>
        </div>
    );
}