import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Mail, Star, Calendar, LogOut, AlertTriangle, Loader2, ChefHat, Camera, Pencil, Check, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Perfil() {
    const { usuario, firebaseUser, refetchUsuario } = useAuth();
    const navigate = useNavigate();

    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState(usuario?.nombre ?? '');
    const [bio, setBio] = useState(usuario?.bio ?? '');
    const [especialidad, setEspecialidad] = useState(usuario?.especialidad ?? '');
    const [fotoPreview, setFotoPreview] = useState<string | null>(usuario?.fotoUrl ?? null);
    const [fotoUrl, setFotoUrl] = useState<string | null>(usuario?.fotoUrl ?? null);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [cancelando, setCancelando] = useState(false);
    const [confirmarCancelar, setConfirmarCancelar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

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
            setError('No se pudo subir la foto.');
        } finally {
            setUploadingFoto(false);
        }
    };

    const handleGuardar = async () => {
        setGuardando(true);
        setError(null);
        try {
            await api.patch('/users/me', {
                nombre,
                ...(fotoUrl && { fotoUrl }),
                ...(bio && { bio }),
                ...(especialidad && { especialidad }),
            });
            await refetchUsuario();
            setEditando(false);
            setExito('Perfil actualizado correctamente.');
            setTimeout(() => setExito(null), 3000);
        } catch {
            setError('No se pudo actualizar el perfil.');
        } finally {
            setGuardando(false);
        }
    };

    const handleCancelarEdicion = () => {
        setNombre(usuario?.nombre ?? '');
        setBio(usuario?.bio ?? '');
        setEspecialidad(usuario?.especialidad ?? '');
        setFotoPreview(usuario?.fotoUrl ?? null);
        setFotoUrl(usuario?.fotoUrl ?? null);
        setEditando(false);
        setError(null);
    };

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

            {exito && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4 text-sm text-green-700 dark:text-green-400">
                    {exito}
                </div>
            )}

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-4">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {fotoPreview ? (
                                <img src={fotoPreview} alt={usuario.nombre} className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-200 dark:text-stone-900 font-bold text-xl">
                                    {usuario.nombre.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {editando && (
                                <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-400 transition-colors">
                                    {uploadingFoto ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Camera className="w-3 h-3 text-white" />}
                                    <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" disabled={uploadingFoto} />
                                </label>
                            )}
                        </div>
                        <div>
                            {editando ? (
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 mb-1"
                                />
                            ) : (
                                <p className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">{usuario.nombre}</p>
                            )}
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

                    {!editando ? (
                        <button
                            onClick={() => setEditando(true)}
                            className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleGuardar}
                                disabled={guardando || uploadingFoto}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
                            >
                                {guardando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                Guardar
                            </button>
                            <button
                                onClick={handleCancelarEdicion}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                            >
                                <X className="w-3 h-3" /> Cancelar
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600 dark:text-stone-300">{firebaseUser?.email}</span>
                    </div>
                    {!editando && usuario.especialidad && (
                        <div className="flex items-center gap-3 text-sm">
                            <ChefHat className="w-4 h-4 text-stone-400" />
                            <span className="text-stone-600 dark:text-stone-300">{usuario.especialidad}</span>
                        </div>
                    )}
                    {!editando && usuario.bio && (
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">{usuario.bio}</p>
                    )}
                </div>

                {editando && usuario.rol === 'chef' && (
                    <div className="mt-4 space-y-3 border-t border-stone-100 dark:border-stone-700 pt-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Especialidad</label>
                            <input
                                type="text"
                                value={especialidad}
                                onChange={e => setEspecialidad(e.target.value)}
                                placeholder="ej: Cocina italiana"
                                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="Cuéntanos sobre ti"
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 resize-none"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-4">{error}</p>
                )}
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
                                {usuario.suscripcionCancelada
                                    ? `Acceso hasta el ${new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                    : `Vence el ${new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                }
                            </span>
                        </div>
                    )}

                    {usuario.suscripcionCancelada ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-400">
                            Tu suscripción está programada para cancelarse. Seguirás teniendo acceso hasta la fecha indicada.
                        </div>
                    ) : (
                        <>
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
                        </>
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