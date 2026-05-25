import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Calendar, Clock, ChefHat, Loader2, ArrowLeft } from 'lucide-react';

interface Chef {
    id: string;
    nombre: string;
    especialidad: string | null;
    fotoUrl: string | null;
}

interface Disponibilidad {
    chefId: string;
    fecha: string;
    slotsDisponibles: string[];
}

const DURACIONES = [30, 60, 90, 120];

export default function Agendar() {
    const { chefId } = useParams<{ chefId: string }>();
    const navigate = useNavigate();
    const [chef, setChef] = useState<Chef | null>(null);
    const [fecha, setFecha] = useState('');
    const [slots, setSlots] = useState<string[]>([]);
    const [slotSeleccionado, setSlotSeleccionado] = useState('');
    const [duracion, setDuracion] = useState(60);
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hoy = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!chefId) return;
        api.get<Chef>(`/chefs/${chefId}`).then(setChef).catch(() => null);
    }, [chefId]);

    useEffect(() => {
        if (!fecha || !chefId) return;

        let cancelled = false;

        const fetchSlots = async () => {
            if (!cancelled) setLoadingSlots(true);
            if (!cancelled) setSlotSeleccionado('');
            try {
                const data = await api.get<Disponibilidad>(`/chefs/${chefId}/availability?fecha=${fecha}`);
                if (!cancelled) setSlots(data.slotsDisponibles);
            } catch {
                if (!cancelled) setSlots([]);
            } finally {
                if (!cancelled) setLoadingSlots(false);
            }
        };

        fetchSlots();
        return () => { cancelled = true; };
    }, [fecha, chefId]);

    const handleAgendar = async () => {
        if (!slotSeleccionado || !fecha) {
            setError('Selecciona una fecha y horario.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const hora = new Date(slotSeleccionado).toTimeString().slice(0, 5);
            await api.post('/sessions', {
                chefId,
                fecha,
                hora,
                duracionMin: duracion,
                ...(notas && { notas }),
            });
            navigate('/premium/mis-sesiones');
        } catch {
            setError('No se pudo agendar la sesión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Volver
            </button>

            <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Sesión personalizada</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-6">Agendar sesión</h1>

            {chef && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6 flex items-center gap-4">
                    {chef.fotoUrl ? (
                        <img src={chef.fotoUrl} alt={chef.nombre} className="w-14 h-14 rounded-full object-cover border-2 border-amber-200 dark:border-amber-800" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xl">
                            {chef.nombre.charAt(0)}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <p className="font-semibold text-stone-900 dark:text-stone-100">{chef.nombre}</p>
                        </div>
                        {chef.especialidad && <p className="text-sm text-stone-500 dark:text-stone-400">{chef.especialidad}</p>}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        min={hoy}
                        onChange={e => setFecha(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                    />
                </div>

                {fecha && (
                    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
                            <Clock className="w-4 h-4 inline mr-1" /> Horario disponible
                        </label>
                        {loadingSlots ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                            </div>
                        ) : slots.length === 0 ? (
                            <p className="text-sm text-stone-400 text-center py-4">No hay horarios disponibles para esta fecha.</p>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {slots.map((slot) => {
                                    const hora = new Date(slot).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => setSlotSeleccionado(slot)}
                                            className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${slotSeleccionado === slot
                                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                                                }`}
                                        >
                                            {hora}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Duración</label>
                    <div className="grid grid-cols-4 gap-2">
                        {DURACIONES.map((d) => (
                            <button
                                key={d}
                                onClick={() => setDuracion(d)}
                                className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${duracion === d
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                                    }`}
                            >
                                {d} min
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Notas (opcional)</label>
                    <textarea
                        value={notas}
                        onChange={e => setNotas(e.target.value)}
                        placeholder="¿Qué quieres aprender en esta sesión?"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 resize-none"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-4 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <button
                onClick={handleAgendar}
                disabled={loading || !slotSeleccionado}
                className="w-full mt-6 py-4 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl font-semibold text-base hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Agendando...' : 'Confirmar sesión'}
            </button>
        </div>
    );
}