import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            <Navbar/>
            <Sidebar/>
            <main className="ml-60 mt-16 p-8 min-h-[calc(100vh-4rem)]">
                <Outlet/>
            </main>
        </div>
    );
}