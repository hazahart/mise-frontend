import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Loader2 } from 'lucide-react';

interface ChatResumen {
    chatId: string;
    usuarioId: string;
    usuarioNombre: string;
    ultimoMensaje: string;
    actualizadoEn: number;
}

export default function MisChats() {
    const { firebaseUser } = useAuth();
    const [chats, setChats] = useState<ChatResumen[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firebaseUser) return;

        const chatsRef = ref(rtdb, `chef_chats/${firebaseUser.uid}`);

        onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setChats([]);
            } else {
                const lista = Object.entries(data).map(([chatId, val]) => ({
                    chatId,
                    ...(val as Omit<ChatResumen, 'chatId'>),
                }));
                lista.sort((a, b) => b.actualizadoEn - a.actualizadoEn);
                setChats(lista);
            }
            setLoading(false);
        });

        return () => off(chatsRef);
    }, [firebaseUser]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chef</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mis chats</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Conversaciones con tus usuarios.</p>
            </div>

            {chats.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl">
                    <MessageSquare className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <p className="text-stone-400">No tienes conversaciones aún.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {chats.map((chat) => (
                        <Link
                            key={chat.chatId}
                            to={`/chef/chat/${chat.chatId}`}
                            className="flex items-center gap-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-lg flex-shrink-0">
                                {chat.usuarioNombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-stone-900 dark:text-stone-100">{chat.usuarioNombre}</p>
                                <p className="text-sm text-stone-400 truncate">{chat.ultimoMensaje}</p>
                            </div>
                            <p className="text-xs text-stone-400 flex-shrink-0">
                                {new Date(chat.actualizadoEn).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}