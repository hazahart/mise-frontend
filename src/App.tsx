import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/login/Login';
import Registro from '@/pages/login/Registro';
import PremiumRoute from '@/components/layout/PremiumRoute';
import ChefRoute from '@/components/layout/ChefRoute';
import Home from '@/pages/home/Home';
import RecetaDetalle from './pages/recipe-detail/RecetasDetalle';
import Subscription from '@/pages/subscription/Subscription';
import SubscriptionSuccess from '@/pages/subscription/SubscriptionSuccess';
import SubscriptionCancelled from '@/pages/subscription/SubscriptionCancelled';
import RecetasDelDia from '@/pages/premium/RecetasDelDia';
import SugeridorIA from './pages/premium/SugeridorIA';
import Chat from '@/pages/premium/Chat';
import SeleccionarChef from '@/pages/premium/SeleccionarChef';
import Onboarding from '@/pages/onboarding/Onboarding';
import { useAuth } from '@/context/AuthContext';
import MisChats from './pages/chef/MisChats';
import ChatChef from './pages/chef/ChatChef';

function OnboardingGuard() {
    const { usuario, loading } = useAuth();
    if (loading) return null;
    if (usuario && !usuario.onboardingCompletado) return <Navigate to="/onboarding" replace />;
    return <Outlet />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route element={<OnboardingGuard />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/categorias" element={<div className="p-4">Categorías</div>} />
                    <Route path="/categoria/:id" element={<div className="p-4">Categoría</div>} />
                    <Route path="/receta/:id" element={<RecetaDetalle />} />
                    <Route path="/suscripcion" element={<Subscription />} />
                    <Route path="/suscripcion/exito" element={<SubscriptionSuccess />} />
                    <Route path="/suscripcion/cancelado" element={<SubscriptionCancelled />} />

                    <Route element={<PremiumRoute />}>
                        <Route path="/premium/recetas-del-dia" element={<RecetasDelDia />} />
                        <Route path="/premium/sugeridor" element={<SugeridorIA />} />
                        <Route path="/premium/chat" element={<SeleccionarChef />} />
                        <Route path="/premium/chat/:chefId" element={<Chat />} />
                        <Route path="/premium/mis-sesiones" element={<div className="p-4">Mis sesiones</div>} />
                    </Route>

                    <Route element={<ChefRoute />}>
                        <Route path="/chef/mis-recetas" element={<div className="p-4">Mis recetas</div>} />
                        <Route path="/chef/nueva-receta" element={<div className="p-4">Nueva receta</div>} />
                        <Route path="/chef/editar/:id" element={<div className="p-4">Editar receta</div>} />
                        <Route path="/chef/mis-chats" element={<MisChats />} />
                        <Route path="/chef/chat/:chatId" element={<ChatChef />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<div className="p-8">404</div>} />
        </Routes>
    );
}

export default App;