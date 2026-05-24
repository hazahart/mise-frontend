import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';

export default function PremiumRoute() {
    const {firebaseUser, usuario, loading} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin"/>
            </div>
        );
    }

    if (!firebaseUser) {
        return <Navigate to="/login" replace/>;
    }

    if (usuario?.rol === 'free') {
        return <Navigate to="/suscripcion" replace/>;
    }

    return <Outlet/>;
}