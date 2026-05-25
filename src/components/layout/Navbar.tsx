import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
    onMenuClick: () => void;
    menuOpen: boolean;
}

export default function Navbar({ onMenuClick, menuOpen }: NavbarProps) {
    const { usuario, firebaseUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center px-4 md:px-6 gap-3 z-50">

            <button
                onClick={onMenuClick}
                className="md:hidden text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
            >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400 min-w-fit">
                Mise
            </Link>

            <div className="ml-auto flex items-center gap-3">
                {firebaseUser ? (
                    <>
                        {usuario?.rol === 'premium' && (
                            <span className="hidden sm:block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                ⭐ Premium
                            </span>
                        )}
                        <Link to="/perfil">
                            {usuario?.fotoUrl ? (
                                <img
                                    src={usuario.fotoUrl}
                                    alt={usuario.nombre}
                                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-stone-200 dark:border-stone-700"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-200 dark:text-stone-900 font-semibold text-sm flex-shrink-0">
                                    {usuario?.nombre?.charAt(0).toUpperCase() ?? firebaseUser.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="text-sm font-medium bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 px-4 py-2 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                    >
                        Acceder
                    </Link>
                )}
            </div>
        </nav>
    );
}