import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChefHat, User, ArrowRight, ArrowLeft, Check, Camera, Loader2 } from 'lucide-react';

type Rol = 'free' | 'chef';

export default function Onboarding() {
    const { firebaseUser, refetchUsuario } = useAuth();
    const navigate = useNavigate();
    const [paso, setPaso] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [nombre, setNombre] = useState('');
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [rol, setRol] = useState<Rol>('free');
    const [bio, setBio] = useState('');
    const [especialidad, setEspecialidad] = useState('');

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !firebaseUser) return;

        setFotoPreview(URL.createObjectURL(file));
        setUploadingFoto(true);

        try {
            const storageRef = ref(storage, `avatars/${firebaseUser.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFotoUrl(url);
        } catch {
            setError('No se pudo subir la foto. Intenta de nuevo.');
        } finally {
            setUploadingFoto(false);
        }
    };

    const handleCompletar = async () => {
        if (!nombre.trim()) {
            setError('El nombre es requerido.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await api.patch('/users/me/onboarding', {
                nombre,
                rol,
                ...(fotoUrl && { fotoUrl }),
                ...(bio && { bio }),
                ...(especialidad && { especialidad }),
            });
            await refetchUsuario();
            navigate('/');
        } catch {
            setError('Ocurrió un error. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <span className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">Mise</span>
                    <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">Configura tu perfil</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${paso > i
                                    ? 'bg-amber-500 text-white'
                                    : paso === i
                                        ? 'bg-stone-900 dark:bg-amber-500 text-white'
                                        : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                                }`}>
                                {paso > i ? <Check className="w-4 h-4" /> : i}
                            </div>
                            {i < 3 && <div className={`w-12 h-0.5 ${paso > i ? 'bg-amber-500' : 'bg-stone-200 dark:bg-stone-700'}`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">

                    {paso === 1 && (
                        <div>
                            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">¿Cómo te llamas?</h2>
                            <p className="text-stone-400 text-sm mb-6">Este será tu nombre en la plataforma.</p>
                            <input
                                type="text"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="Tu nombre completo"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                            />
                        </div>
                    )}

                    {paso === 2 && (
                        <div>
                            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">Agrega una foto</h2>
                            <p className="text-stone-400 text-sm mb-6">Opcional — puedes hacerlo después.</p>

                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-24 h-24">
                                    {fotoPreview ? (
                                        <img
                                            src={fotoPreview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-600 flex items-center justify-center">
                                            <User className="w-8 h-8 text-stone-400" />
                                        </div>
                                    )}
                                    {uploadingFoto && (
                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                                    <Camera className="w-4 h-4" />
                                    {fotoPreview ? 'Cambiar foto' : 'Seleccionar foto'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {paso === 3 && (
                        <div>
                            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">¿Cuál es tu rol?</h2>
                            <p className="text-stone-400 text-sm mb-6">Elige cómo quieres usar Mise.</p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    onClick={() => setRol('free')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${rol === 'free'
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                                        }`}
                                >
                                    <User className="w-6 h-6 text-stone-600 dark:text-stone-300 mb-2" />
                                    <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Usuario</p>
                                    <p className="text-xs text-stone-400 mt-1">Explora y aprende recetas</p>
                                </button>
                                <button
                                    onClick={() => setRol('chef')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${rol === 'chef'
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                                        }`}
                                >
                                    <ChefHat className="w-6 h-6 text-stone-600 dark:text-stone-300 mb-2" />
                                    <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Chef</p>
                                    <p className="text-xs text-stone-400 mt-1">Comparte tus recetas</p>
                                </button>
                            </div>

                            {rol === 'chef' && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={especialidad}
                                        onChange={e => setEspecialidad(e.target.value)}
                                        placeholder="Especialidad (ej: Cocina italiana)"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                                    />
                                    <textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Cuéntanos sobre ti (opcional)"
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-4">{error}</p>
                    )}

                    <div className="flex items-center justify-between mt-6">
                        {paso > 1 ? (
                            <button
                                onClick={() => setPaso(p => p - 1)}
                                className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Atrás
                            </button>
                        ) : <div />}

                        {paso < 3 ? (
                            <button
                                onClick={() => {
                                    if (paso === 1 && !nombre.trim()) {
                                        setError('El nombre es requerido.');
                                        return;
                                    }
                                    if (uploadingFoto) return;
                                    setError(null);
                                    setPaso(p => p + 1);
                                }}
                                disabled={uploadingFoto}
                                className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
                            >
                                Siguiente <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleCompletar}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Completar'} <Check className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}