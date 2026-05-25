import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import type { Usuario } from "@/types";

interface AuthContextType {
    firebaseUser: User | null;
    usuario: Usuario | null;
    loading: boolean;
    refetchUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    usuario: null,
    loading: true,
    refetchUsuario: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUsuario = async () => {
        try {
            await auth.currentUser?.getIdToken(true);
            const data = await api.get<Usuario>("/users/me");
            setUsuario(data);
        } catch {
            setUsuario(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user) {
                await fetchUsuario();
            } else {
                setUsuario(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                usuario,
                loading,
                refetchUsuario: fetchUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}