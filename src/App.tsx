import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/login/Login';
import Registro from '@/pages/login/Registro';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
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
import MisSesiones from '@/pages/premium/MisSesiones';
import Agendar from '@/pages/premium/Agendar';
import SeleccionarChefAgendar from '@/pages/premium/SeleccionarChefAgendar';
import MisRecetas from '@/pages/chef/MisRecetas';
import NuevaReceta from '@/pages/chef/NuevaReceta';
import EditarReceta from '@/pages/chef/EditarReceta';
import MisChats from '@/pages/chef/MisChats';
import ChatChef from '@/pages/chef/ChatChef';
import MisSesionesChef from '@/pages/chef/MisSesioneschef';
import Perfil from '@/pages/perfil/Perfil';
import Categorias from '@/pages/categorias/Categorias';
import Onboarding from '@/pages/onboarding/Onboarding';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/context/AuthContext';
import Categoria from './pages/categorias/Categoria';
import MiDisponibilidad from './pages/chef/MiDisponibilidad';

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
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/categoria/:id" element={<Categoria />} />
                    <Route path="/receta/:id" element={<RecetaDetalle />} />
                    <Route path="/suscripcion" element={<Subscription />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/suscripcion/exito" element={<SubscriptionSuccess />} />
                        <Route path="/suscripcion/cancelado" element={<SubscriptionCancelled />} />
                    </Route>

                    <Route element={<PremiumRoute />}>
                        <Route path="/premium/recetas-del-dia" element={<RecetasDelDia />} />
                        <Route path="/premium/sugeridor" element={<SugeridorIA />} />
                        <Route path="/premium/chat" element={<SeleccionarChef />} />
                        <Route path="/premium/chat/:chefId" element={<Chat />} />
                        <Route path="/premium/mis-sesiones" element={<MisSesiones />} />
                        <Route path="/premium/agendar" element={<SeleccionarChefAgendar />} />
                        <Route path="/premium/agendar/:chefId" element={<Agendar />} />
                    </Route>

                    <Route element={<ChefRoute />}>
                        <Route path="/chef/mis-recetas" element={<MisRecetas />} />
                        <Route path="/chef/nueva-receta" element={<NuevaReceta />} />
                        <Route path="/chef/editar/:id" element={<EditarReceta />} />
                        <Route path="/chef/mis-chats" element={<MisChats />} />
                        <Route path="/chef/chat/:chatId" element={<ChatChef />} />
                        <Route path="/chef/mis-sesiones" element={<MisSesionesChef />} />
                        <Route path="/chef/disponibilidad" element={<MiDisponibilidad />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;