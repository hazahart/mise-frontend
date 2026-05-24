import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { MessageSquare, Loader2 } from 'lucide-react';

interface Chef {
    id: string;
    nombre: string;
    especialidad: string | null;
    fotoUrl: string | null;
    disponible: boolean;
}

export default function SeleccionarChef() {
    const [chefs, setChefs] = useState<Chef[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchChefs = async () => {
            try {
                const data = await api.get<Chef[]>('/chefs');
                if (!cancelled) setChefs(data);
            } catch {
                if (!cancelled) setError('No se pudieron cargar los chefs.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchChefs();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <p className="text-stone-500 dark:text-stone-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chat en vivo</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
                    Chatea con un chef
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">
                    Elige un chef profesional y resuelve tus dudas en tiempo real.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {chefs.map((chef) => (
                    <Link
                        key={chef.id}
                        to={`/premium/chat/${chef.id}`}
                        className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
                    >
                        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xl flex-shrink-0">
                            {chef.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-stone-900 dark:text-stone-100">{chef.nombre}</p>
                            {chef.especialidad && (
                                <p className="text-sm text-stone-400 truncate">{chef.especialidad}</p>
                            )}
                            <span className={`text-xs font-medium mt-1 inline-block ${chef.disponible ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>
                                {chef.disponible ? '● Disponible' : '● No disponible'}
                            </span>
                        </div>
                        <MessageSquare className="w-5 h-5 text-stone-300 dark:text-stone-600 flex-shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    );
}