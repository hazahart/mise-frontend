import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import type { Usuario } from '@/types';

const FOTOS = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&q=80',
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
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
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch {
            setError('Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setLoadingGoogle(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await result.user.getIdToken(true);
            const usuario = await api.get<Usuario>('/users/me');
            if (!usuario.onboardingCompletado) {
                navigate('/onboarding');
            } else {
                navigate('/');
            }
        } catch {
            setError('No se pudo iniciar sesión con Google.');
        } finally {
            setLoadingGoogle(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex flex-1 flex-col justify-between px-14 py-12 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${FOTOS[fotoActual]})`, opacity: transitioning ? 0 : 1 }}
                />
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${FOTOS[fotoSiguiente]})`, opacity: transitioning ? 1 : 0 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/30" />
                <p className="font-serif text-2xl font-semibold tracking-wide text-amber-200/90 relative z-10">Mise</p>
                <div className="relative z-10">
                    <h1 className="font-serif text-5xl font-bold leading-tight mb-5 text-stone-100">
                        Tu cocina,<br />
                        <span className="italic text-amber-400/90">elevada</span>
                    </h1>
                    <p className="text-stone-300 text-base leading-relaxed max-w-sm font-light">
                        Recetas de chefs profesionales, sugerencias con IA y sesiones personalizadas — todo en un solo lugar.
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
                            <div key={i} className={`h-0.5 rounded-full transition-all duration-500 ${i === fotoActual ? 'w-6 bg-amber-400' : 'w-2 bg-stone-600'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 md:flex-none md:w-[480px] bg-stone-50 dark:bg-stone-900 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-9 py-10">
                    <p className="text-xs font-medium tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-3">
                        Bienvenido de vuelta
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50 mb-1">Iniciar sesión</h2>
                    <p className="text-stone-400 dark:text-stone-500 text-sm mb-8">Ingresa tus datos para continuar</p>

                    <button
                        onClick={handleGoogle}
                        disabled={loadingGoogle}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 mb-5"
                    >
                        {loadingGoogle ? (
                            <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continuar con Google
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                        <span className="text-xs text-stone-400">o</span>
                        <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                    </div>

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
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-3 rounded-xl text-sm font-medium bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Cargando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-7">
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}