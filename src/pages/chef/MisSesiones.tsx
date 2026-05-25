import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Sesion, EstadoSesion } from '@/types';
import { Calendar, Clock, Users, Loader2, Check, X } from 'lucide-react';

const ESTADO_ESTILOS: Record<EstadoSesion, string> = {
    pendiente: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    confirmada: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    cancelada: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    completada: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300',
};

export default function MisSesionesChef() {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actualizando, setActualizando] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const data = await api.get<Sesion[]>('/sessions/chef');
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

    const handleActualizar = async (id: string, estado: EstadoSesion) => {
        setActualizando(id);
        try {
            await api.patch(`/sessions/${id}`, { estado });
            const data = await api.get<Sesion[]>('/sessions/chef');
            setSesiones(data);
        } catch {
            setError('No se pudo actualizar la sesión.');
        } finally {
            setActualizando(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chef</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mis sesiones</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Sesiones agendadas por tus usuarios.</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {sesiones.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl">
                    <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <p className="text-stone-400">No tienes sesiones agendadas aún.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sesiones.map((sesion) => (
                        <div key={sesion.id} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_ESTILOS[sesion.estado]}`}>
                                            {sesion.estado.charAt(0).toUpperCase() + sesion.estado.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">
                                            {sesion.usuarioNombre.charAt(0)}
                                        </div>
                                        <p className="font-semibold text-stone-900 dark:text-stone-100">{sesion.usuarioNombre}</p>
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
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleActualizar(sesion.id, 'confirmada')}
                                            disabled={actualizando === sesion.id}
                                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                                        >
                                            <Check className="w-3 h-3" /> Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleActualizar(sesion.id, 'cancelada')}
                                            disabled={actualizando === sesion.id}
                                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                                        >
                                            <X className="w-3 h-3" /> Cancelar
                                        </button>
                                    </div>
                                )}
                                {sesion.estado === 'confirmada' && (
                                    <button
                                        onClick={() => handleActualizar(sesion.id, 'completada')}
                                        disabled={actualizando === sesion.id}
                                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors disabled:opacity-50"
                                    >
                                        {actualizando === sesion.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                        Completada
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