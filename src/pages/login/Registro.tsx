import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const FOTOS = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80',
];

export default function Registro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fotoActual, setFotoActual] = useState(0);
    const [fotoSiguiente, setFotoSiguiente] = useState(1);
    const [transitioning, setTransitioning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setTransitioning(true);
            setTimeout(() => {
                setFotoActual(prev => (prev + 1) % FOTOS.length);
                setFotoSiguiente(prev => (prev + 1) % FOTOS.length);
                setTransitioning(false);
            }, 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmar) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/onboarding');
        } catch {
            setError('No se pudo crear la cuenta. Intenta con otro correo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex flex-1 flex-col justify-between px-14 py-12 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${FOTOS[fotoActual]})`,
                        opacity: transitioning ? 0 : 1,
                    }}
                />
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${FOTOS[fotoSiguiente]})`,
                        opacity: transitioning ? 1 : 0,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/30" />
                <p className="font-serif text-2xl font-semibold tracking-wide text-amber-200/90 relative z-10">
                    Mise
                </p>
                <div className="relative z-10">
                    <h1 className="font-serif text-5xl font-bold leading-tight mb-5 text-stone-100">
                        Empieza hoy,<br />
                        <span className="italic text-amber-400/90">cocina mejor</span>
                    </h1>
                    <p className="text-stone-300 text-base leading-relaxed max-w-sm font-light">
                        Crea tu cuenta gratis y accede al catálogo completo de recetas de chefs profesionales.
                    </p>
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                    {[
                        'Catálogo curado por chefs profesionales',
                        'Sugeridor IA con tus ingredientes disponibles',
                        'Chat y sesiones personalizadas con chefs',
                    ].map(f => (
                        <div key={f} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <span className="text-stone-300 text-sm font-light">{f}</span>
                        </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                        {FOTOS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-0.5 rounded-full transition-all duration-500 ${i === fotoActual ? 'w-6 bg-amber-400' : 'w-2 bg-stone-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 md:flex-none md:w-[480px] bg-stone-50 dark:bg-stone-900 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-9 py-10">
                    <p className="text-xs font-medium tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-3">
                        Crea tu cuenta
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50 mb-1">
                        Registrarse
                    </h2>
                    <p className="text-stone-400 dark:text-stone-500 text-sm mb-8">
                        Es gratis, siempre
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="tu@correo.com"
                                className="w-full px-4 py-3 rounded-xl text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Mínimo 8 caracteres"
                                minLength={8}
                                className="w-full px-4 py-3 rounded-xl text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                value={confirmar}
                                onChange={e => setConfirmar(e.target.value)}
                                required
                                placeholder="Repite tu contraseña"
                                minLength={8}
                                className="w-full px-4 py-3 rounded-xl text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-3 rounded-xl text-sm font-medium bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Cargando...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-7">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}