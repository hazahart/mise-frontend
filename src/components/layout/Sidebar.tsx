import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Home, Grid2X2, Star, Sparkles, MessageSquare, Calendar, ChefHat, PenSquare, X, Users } from 'lucide-react';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { usuario } = useAuth();

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${isActive
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
            : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
        }`;

    const content = (
        <div className="flex flex-col gap-1 px-4 py-6 h-full overflow-y-auto">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest px-3 pb-2">
                Explorar
            </p>
            <NavLink to="/" end className={linkClass} onClick={onClose}>
                <Home className="w-4 h-4" /> Inicio
            </NavLink>
            <NavLink to="/categorias" className={linkClass} onClick={onClose}>
                <Grid2X2 className="w-4 h-4" /> Categorías
            </NavLink>

            {usuario && usuario.rol !== 'chef' && (
                <>
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-widest px-3 pb-2 pt-4">
                        Premium
                    </p>
                    <NavLink to="/premium/recetas-del-dia" className={linkClass} onClick={onClose}>
                        <Star className="w-4 h-4" />
                        Recetas del día
                        {usuario.rol === 'free' && (
                            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                Pro
                            </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/sugeridor" className={linkClass} onClick={onClose}>
                        <Sparkles className="w-4 h-4" />
                        Sugeridor IA
                        {usuario.rol === 'free' && (
                            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                Pro
                            </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/chat" className={linkClass} onClick={onClose}>
                        <MessageSquare className="w-4 h-4" />
                        Chat con chef
                        {usuario.rol === 'free' && (
                            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                Pro
                            </span>
                        )}
                    </NavLink>
                    <NavLink to="/premium/mis-sesiones" className={linkClass} onClick={onClose}>
                        <Calendar className="w-4 h-4" />
                        Mis sesiones
                        {usuario.rol === 'free' && (
                            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
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
                    <NavLink to="/chef/mis-recetas" className={linkClass} onClick={onClose}>
                        <ChefHat className="w-4 h-4" /> Mis recetas
                    </NavLink>
                    <NavLink to="/chef/nueva-receta" className={linkClass} onClick={onClose}>
                        <PenSquare className="w-4 h-4" /> Nueva receta
                    </NavLink>
                    <NavLink to="/chef/mis-chats" className={linkClass} onClick={onClose}>
                        <MessageSquare className="w-4 h-4" /> Mis chats
                    </NavLink>
                    <NavLink to="/chef/mis-sesiones" className={linkClass} onClick={onClose}>
                        <Users className="w-4 h-4" /> Mis sesiones
                    </NavLink>
                </>
            )}
        </div>
    );

    return (
        <>
            <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-60 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex-col z-40">
                {content}
            </aside>

            <AnimatePresence>
                {open && (
                    <div className="md:hidden fixed inset-0 z-40 flex">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={onClose}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="relative w-72 bg-white dark:bg-stone-900 h-full z-50 flex flex-col"
                        >
                            <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200 dark:border-stone-800">
                                <span className="font-serif text-xl font-bold text-amber-700 dark:text-amber-400">Mise</span>
                                <button onClick={onClose} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {content}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}