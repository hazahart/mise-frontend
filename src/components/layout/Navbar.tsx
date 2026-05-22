import {Link, useNavigate} from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useAuth} from '@/context/AuthContext';
import {Search, LogOut} from 'lucide-react';

export default function Navbar() {
    const {usuario, firebaseUser} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16
      bg-white dark:bg-stone-900
      border-b border-stone-200 dark:border-stone-800
      flex items-center px-6 gap-4 z-50">

            <Link to="/" className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400 min-w-[160px]">
                Mise
            </Link>

            <div className="flex-1 max-w-lg relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4"/>
                <input
                    type="text"
                    placeholder="Buscar recetas, categorías..."
                    className="w-full pl-10 pr-4 py-2 rounded-full text-sm
            bg-stone-50 dark:bg-stone-800
            border border-stone-200 dark:border-stone-700
            text-stone-900 dark:text-stone-100
            placeholder:text-stone-400
            outline-none focus:border-amber-500 transition-colors"
                />
            </div>

            <div className="ml-auto flex items-center gap-3">
                {firebaseUser ? (
                    <>
                        {usuario?.rol === 'premium' && (
                            <span
                                className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                ⭐ Premium
              </span>
                        )}
                        <div
                            className="w-9 h-9 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-200 dark:text-stone-900 font-semibold text-sm">
                            {usuario?.nombre?.charAt(0).toUpperCase() ?? firebaseUser.email?.charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        >
                            <LogOut className="w-5 h-5"/>
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/registro"
                            className="text-sm font-medium bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 px-4 py-2 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                        >
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}