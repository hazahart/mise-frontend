import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, push, onValue, off, serverTimestamp, set } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

interface Mensaje {
    id: string;
    texto: string;
    autorId: string;
    autorNombre: string;
    creadoEn: number;
}

interface UsuarioInfo {
    fotoUrl: string | null;
    nombre: string;
}

export default function ChatChef() {
    const { chatId } = useParams<{ chatId: string }>();
    const { usuario, firebaseUser } = useAuth();
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [loading, setLoading] = useState(true);
    const [texto, setTexto] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [usuarioInfo, setUsuarioInfo] = useState<UsuarioInfo | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const usuarioDelChat = mensajes.find(m => m.autorId !== firebaseUser?.uid);

    useEffect(() => {
        if (!usuarioDelChat) return;
        api.get<UsuarioInfo>(`/users/${usuarioDelChat.autorId}`)
            .then(data => setUsuarioInfo(data))
            .catch(() => null);
    }, [usuarioDelChat]);

    useEffect(() => {
        if (!chatId) return;

        const mensajesRef = ref(rtdb, `chats/${chatId}/messages`);

        onValue(mensajesRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setMensajes([]);
            } else {
                const lista = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...(val as Omit<Mensaje, 'id'>),
                }));
                lista.sort((a, b) => a.creadoEn - b.creadoEn);
                setMensajes(lista);
            }
            setLoading(false);
        });

        return () => off(mensajesRef);
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const handleEnviar = async () => {
        const msg = texto.trim();
        if (!msg || enviando || !chatId || !firebaseUser || !usuario) return;
        setTexto('');
        setEnviando(true);

        try {
            const mensajesRef = ref(rtdb, `chats/${chatId}/messages`);
            await push(mensajesRef, {
                texto: msg,
                autorId: firebaseUser.uid,
                autorNombre: usuario.nombre,
                creadoEn: serverTimestamp(),
            });

            const chefChatRef = ref(rtdb, `chef_chats/${firebaseUser.uid}/${chatId}`);
            await set(chefChatRef, {
                usuarioId: chatId.split('_')[0],
                usuarioNombre: usuarioDelChat?.autorNombre ?? 'Usuario',
                ultimoMensaje: msg,
                actualizadoEn: serverTimestamp(),
            });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">

            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-200 dark:border-stone-700">
                <Link
                    to="/chef/mis-chats"
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                    {usuarioInfo?.fotoUrl ? (
                        <img
                            src={usuarioInfo.fotoUrl}
                            alt={usuarioInfo.nombre}
                            className="w-10 h-10 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">
                            {usuarioDelChat?.autorNombre?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                            {usuarioDelChat?.autorNombre ?? 'Usuario'}
                        </p>
                        <p className="text-xs text-stone-400">Usuario</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                    </div>
                ) : mensajes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                        <p className="text-stone-400 text-sm">No hay mensajes aún.</p>
                    </div>
                ) : (
                    mensajes.map((msg) => {
                        const esMio = msg.autorId === firebaseUser?.uid;
                        return (
                            <div key={msg.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${esMio
                                    ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-br-sm'
                                    : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-bl-sm'
                                    }`}>
                                    {!esMio && (
                                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">{msg.autorNombre}</p>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.texto}</p>
                                    <p className={`text-xs mt-1 ${esMio ? 'text-stone-400 dark:text-stone-700' : 'text-stone-400'}`}>
                                        {new Date(msg.creadoEn).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleEnviar()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                    />
                    <button
                        onClick={handleEnviar}
                        disabled={!texto.trim() || enviando}
                        className="px-4 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {enviando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>

        </div>
    );
}