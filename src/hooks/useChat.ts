import { useState, useEffect } from 'react';
import { ref, push, onValue, off, serverTimestamp, set } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export interface Mensaje {
    id: string;
    texto: string;
    autorId: string;
    autorNombre: string;
    creadoEn: number;
}

export function useChat(chefId: string) {
    const { usuario, firebaseUser } = useAuth();
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [loading, setLoading] = useState(true);
    const chatId = firebaseUser ? `${firebaseUser.uid}_${chefId}` : null;

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

    const enviarMensaje = async (texto: string) => {
        if (!chatId || !firebaseUser || !usuario) return;

        const mensajesRef = ref(rtdb, `chats/${chatId}/messages`);
        await push(mensajesRef, {
            texto,
            autorId: firebaseUser.uid,
            autorNombre: usuario.nombre,
            creadoEn: serverTimestamp(),
        });

        const chefChatRef = ref(rtdb, `chef_chats/${chefId}/${chatId}`);
        await set(chefChatRef, {
            usuarioId: firebaseUser.uid,
            usuarioNombre: usuario.nombre,
            usuarioFotoUrl: usuario.fotoUrl ?? null,
            ultimoMensaje: texto,
            actualizadoEn: serverTimestamp(),
        });
    };

    return { mensajes, loading, enviarMensaje, chatId };
}