import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User, Mail, Star, Calendar, LogOut, AlertTriangle, Loader2, ChefHat } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Perfil() {
    const { usuario, firebaseUser, refetchUsuario } = useAuth();
    const navigate = useNavigate();
    const [cancelando, setCancelando] = useState(false);
    const [confirmarCancelar, setConfirmarCancelar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    const handleCancelarSuscripcion = async () => {
        setCancelando(true);
        setError(null);
        try {
            await api.delete('/payments/subscription');
            await refetchUsuario();
            setExito('Tu suscripción se cancelará al final del período actual.');
            setConfirmarCancelar(false);
        } catch {
            setError('No se pudo cancelar la suscripción. Intenta de nuevo.');
        } finally {
            setCancelando(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (!usuario) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Cuenta</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mi perfil</h1>
            </div>

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-4 mb-6">
                    {usuario.fotoUrl ? (
                        <img src={usuario.fotoUrl} alt={usuario.nombre} className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-200 dark:text-stone-900 font-bold text-xl">
                            {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">{usuario.nombre}</p>
                        <div className="flex items-center gap-2 mt-1">
                            {usuario.rol === 'premium' && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                    ⭐ Premium
                                </span>
                            )}
                            {usuario.rol === 'chef' && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center gap-1">
                                    <ChefHat className="w-3 h-3" /> Chef
                                </span>
                            )}
                            {usuario.rol === 'free' && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400">
                                    Free
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600 dark:text-stone-300">{firebaseUser?.email}</span>
                    </div>
                </div>
            </div>

            {usuario.rol === 'premium' && (
                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-4">
                    <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Suscripción</h2>
                    <div className="flex items-center gap-3 text-sm mb-4">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-stone-600 dark:text-stone-300">Plan Premium activo</span>
                    </div>
                    {usuario.suscripcionExpira && (
                        <div className="flex items-center gap-3 text-sm mb-6">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span className="text-stone-600 dark:text-stone-300">
                                Vence el {new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    )}

                    {exito && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4 text-sm text-green-700 dark:text-green-400">
                            {exito}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {confirmarCancelar ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">¿Cancelar suscripción?</p>
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-300 mb-4">
                                Seguirás teniendo acceso hasta el final del período actual.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancelarSuscripcion}
                                    disabled={cancelando}
                                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {cancelando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Confirmar cancelación
                                </button>
                                <button
                                    onClick={() => setConfirmarCancelar(false)}
                                    className="flex-1 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Mantener
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmarCancelar(true)}
                            className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            Cancelar suscripción
                        </button>
                    )}
                </div>
            )}

            {usuario.rol === 'free' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-stone-800 dark:text-stone-100">Actualiza a Premium</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Accede a todas las funciones exclusivas.</p>
                    </div>
                    <button
                        onClick={() => navigate('/suscripcion')}
                        className="px-4 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                    >
                        Ver planes
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
            </div>
        </div>
    );
}