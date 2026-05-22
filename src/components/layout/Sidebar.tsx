import {NavLink} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {Home, Grid2X2, Star, Sparkles, MessageSquare, Calendar, ChefHat, PenSquare} from 'lucide-react';

export default function Sidebar() {
    const {usuario} = useAuth();

    const linkClass = ({isActive}: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
            isActive
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
        }`;

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-60
      bg-white dark:bg-stone-900
      border-r border-stone-200 dark:border-stone-800
      px-4 py-6 flex flex-col gap-1 z-40 overflow-y-auto">

            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest px-3 pb-2">
                Explorar
            </p>

            <NavLink to="/" end className={linkClass}>
                <Home className="w-4 h-4"/> Inicio
            </NavLink>
            <NavLink to="/categorias" className={linkClass}>
                <Grid2X2 className="w-4 h-4"/> Categorías
            </NavLink>

            {usuario && (
                <>
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-widest px-3 pb-2 pt-4">
                        Premium
                    </p>
                    <NavLink to="/premium/recetas-del-dia" className={linkClass}>
                        <Star className="w-4 h-4"/>
                        Recetas del día
                        {usuario.rol === 'free' && (
                            <span
                                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                Pro
              </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/sugeridor" className={linkClass}>
                        <Sparkles className="w-4 h-4"/>
                        Sugeridor IA
                        {usuario.rol === 'free' && (
                            <span
                                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                Pro
              </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/chat" className={linkClass}>
                        <MessageSquare className="w-4 h-4"/>
                        Chat con chef
                        {usuario.rol === 'free' && (
                            <span
                                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                Pro
              </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/mis-sesiones" className={linkClass}>
                        <Calendar className="w-4 h-4"/>
                        Mis sesiones
                        {usuario.rol === 'free' && (
                            <span
                                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                Pro
              </span>
                        )}
                    </NavLink>
                </>
            )}

            {usuario?.rol === 'chef' && (
                <>
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-widest px-3 pb-2 pt-4">
                        Chef
                    </p>
                    <NavLink to="/chef/mis-recetas" className={linkClass}>
                        <ChefHat className="w-4 h-4"/> Mis recetas
                    </NavLink>
                    <NavLink to="/chef/nueva-receta" className={linkClass}>
                        <PenSquare className="w-4 h-4"/> Nueva receta
                    </NavLink>
                </>
            )}
        </aside>
    );
}