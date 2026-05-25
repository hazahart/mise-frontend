import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Clock, Loader2, Check } from 'lucide-react';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SLOTS_OPCIONES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function MiDisponibilidad() {
    const [slots, setSlots] = useState<string[]>(['09:00', '11:00', '13:00', '16:00', '18:00']);
    const [diasDisponibles, setDiasDisponibles] = useState<number[]>([1, 2, 3, 4, 5]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        api.get<{ slotsDisponibles: string[]; diasDisponibles: number[] }>('/chefs/me/disponibilidad')
            .then(data => {
                if (!cancelled) {
                    if (data.slotsDisponibles?.length) setSlots(data.slotsDisponibles);
                    if (data.diasDisponibles?.length) setDiasDisponibles(data.diasDisponibles);
                }
            })
            .catch(() => null)
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const toggleSlot = (slot: string) => {
        setSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort()
        );
    };

    const toggleDia = (dia: number) => {
        setDiasDisponibles(prev =>
            prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia].sort()
        );
    };

    const handleGuardar = async () => {
        if (slots.length === 0) {
            setError('Selecciona al menos un horario.');
            return;
        }
        if (diasDisponibles.length === 0) {
            setError('Selecciona al menos un día.');
            return;
        }
        setGuardando(true);
        setError(null);
        try {
            await api.patch('/chefs/me/disponibilidad', { slots, diasDisponibles });
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch {
            setError('No se pudo guardar la disponibilidad.');
        } finally {
            setGuardando(false);
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
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chef</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mi disponibilidad</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Configura los días y horarios en que puedes recibir sesiones.</p>
            </div>

            {exito && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Disponibilidad actualizada correctamente.
                </div>
            )}

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-4">
                <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Días disponibles</h2>
                <div className="grid grid-cols-7 gap-2">
                    {DIAS.map((dia, i) => (
                        <button
                            key={i}
                            onClick={() => toggleDia(i)}
                            className={`py-2 rounded-xl text-xs font-medium border-2 transition-all ${diasDisponibles.includes(i)
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'
                                }`}
                        >
                            {dia.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-6">
                <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Horarios disponibles</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {SLOTS_OPCIONES.map(slot => (
                        <button
                            key={slot}
                            onClick={() => toggleSlot(slot)}
                            className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${slots.includes(slot)
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <button
                onClick={handleGuardar}
                disabled={guardando}
                className="w-full py-4 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl font-semibold text-sm hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
                {guardando ? 'Guardando...' : 'Guardar disponibilidad'}
            </button>
        </div>
    );
}