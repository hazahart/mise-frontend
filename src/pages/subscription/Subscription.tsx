import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Check, Sparkles, ChefHat, MessageSquare, Star, Zap } from 'lucide-react';

const BENEFICIOS = [
    { icon: Star, texto: 'Acceso a todas las recetas premium' },
    { icon: Sparkles, texto: 'Sugeridor de recetas con IA' },
    { icon: MessageSquare, texto: 'Chat directo con chefs profesionales' },
    { icon: ChefHat, texto: 'Agenda sesiones personalizadas' },
    { icon: Zap, texto: 'Nuevas recetas cada semana' },
    { icon: Check, texto: 'Cancela cuando quieras' },
];

export default function Subscription() {
    const { usuario, firebaseUser } = useAuth();
    const navigate = useNavigate();
    const [planSeleccionado, setPlanSeleccionado] = useState<'monthly' | 'yearly'>('yearly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuscribirse = async () => {
        if (!firebaseUser) {
            navigate('/login');
            return;
        }

        if (usuario?.rol === 'premium') {
            setError(`Ya tienes una suscripción activa${usuario.suscripcionExpira ? ` que vence el ${new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}.`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { checkoutUrl } = await api.post<{ sessionId: string; checkoutUrl: string }>(
                '/payments/create-checkout-session',
                { plan: planSeleccionado }
            );
            if (checkoutUrl) window.location.href = checkoutUrl;
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ocurrió un error al procesar tu solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Plan Premium</span>
                <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-100 mt-2 mb-3">
                    Cocina sin límites
                </h1>
                <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                    Accede a todo el contenido de Mise, conecta con chefs y lleva tu cocina al siguiente nivel.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setPlanSeleccionado('monthly')}
                    className={`relative rounded-2xl p-6 text-left border-2 transition-all ${planSeleccionado === 'monthly'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600'
                        }`}
                >
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">Mensual</p>
                    <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
                        $99 <span className="text-base font-normal text-stone-400">MXN/mes</span>
                    </p>
                    <p className="text-xs text-stone-400 mt-2">Facturado mensualmente</p>
                    {planSeleccionado === 'monthly' && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setPlanSeleccionado('yearly')}
                    className={`relative rounded-2xl p-6 text-left border-2 transition-all ${planSeleccionado === 'yearly'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600'
                        }`}
                >
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                        {planSeleccionado === 'yearly' && (
                            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mr-1">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                            -33%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">Anual</p>
                    <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
                        $799 <span className="text-base font-normal text-stone-400">MXN/año</span>
                    </p>
                    <p className="text-xs text-stone-400 mt-2">Solo $66.58/mes · Ahorra $389 al año</p>
                </button>
            </div>

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-8">
                <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Todo lo que incluye</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {BENEFICIOS.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                                <b.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-sm text-stone-700 dark:text-stone-300">{b.texto}</span>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {usuario?.rol === 'premium' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="font-semibold text-stone-800 dark:text-stone-100">Ya eres miembro Premium</p>
                    {usuario.suscripcionExpira && (
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Tu suscripción vence el {new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    )}
                </div>
            ) : (
                <button
                    onClick={handleSuscribirse}
                    disabled={loading}
                    className="w-full py-4 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl font-semibold text-base hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : `Suscribirse al plan ${planSeleccionado === 'monthly' ? 'mensual' : 'anual'}`}
                </button>
            )}

            <p className="text-center text-xs text-stone-400 mt-4">
                Pago seguro procesado por Stripe · Cancela cuando quieras
            </p>
        </div>
    );
}