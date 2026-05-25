import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Sesion, EstadoSesion } from '@/types';
import { Calendar, Clock, ChefHat, Loader2, Plus, X } from 'lucide-react';

const ESTADO_ESTILOS: Record<EstadoSesion, string> = {
    pendiente: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    confirmada: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    cancelada: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    completada: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300',
};

export default function MisSesiones() {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelando, setCancelando] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const data = await api.get<Sesion[]>('/sessions');
                if (!cancelled) setSesiones(data);
            } catch {
                if (!cancelled) setError('No se pudieron cargar las sesiones.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, []);

    const handleCancelar = async (id: string) => {
        setCancelando(id);
        try {
            await api.patch(`/sessions/${id}`, { estado: 'cancelada' });
            const data = await api.get<Sesion[]>('/sessions');
            setSesiones(data);
        } catch {
            setError('No se pudo cancelar la sesión.');
        } finally {
            setCancelando(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Premium</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mis sesiones</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Sesiones agendadas con chefs profesionales.</p>
                </div>
                <Link
                    to="/premium/agendar"
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Agendar
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {sesiones.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl">
                    <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <p className="text-stone-400 mb-4">No tienes sesiones agendadas.</p>
                    <Link
                        to="/premium/agendar"
                        className="text-amber-600 dark:text-amber-400 text-sm font-medium hover:underline"
                    >
                        Agendar una sesión →
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sesiones.map((sesion) => (
                        <div
                            key={sesion.id}
                            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_ESTILOS[sesion.estado]}`}>
                                            {sesion.estado.charAt(0).toUpperCase() + sesion.estado.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ChefHat className="w-4 h-4 text-amber-500" />
                                        <p className="font-semibold text-stone-900 dark:text-stone-100">{sesion.chefNombre}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(sesion.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> {sesion.hora}
                                        </span>
                                    </div>
                                    {sesion.notas && (
                                        <p className="text-sm text-stone-400 mt-2 italic">"{sesion.notas}"</p>
                                    )}
                                </div>
                                {sesion.estado === 'pendiente' && (
                                    <button
                                        onClick={() => handleCancelar(sesion.id)}
                                        disabled={cancelando === sesion.id}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                    >
                                        {cancelando === sesion.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}