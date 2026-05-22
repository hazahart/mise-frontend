import {Routes, Route} from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/login/Login';
import Registro from '@/pages/login/Registro';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registro" element={<Registro/>}/>

            <Route element={<Layout/>}>
                <Route path="/"
                       element={<div className="p-4 text-stone-800 dark:text-stone-100">Home — en construcción</div>}/>
                <Route path="/categorias" element={<div className="p-4">Categorías</div>}/>
                <Route path="/categoria/:id" element={<div className="p-4">Categoría</div>}/>
                <Route path="/receta/:id" element={<div className="p-4">Detalle receta</div>}/>
                <Route path="/suscripcion" element={<div className="p-4">Suscripción</div>}/>
                <Route path="/premium/recetas-del-dia" element={<div className="p-4">Recetas del día</div>}/>
                <Route path="/premium/sugeridor" element={<div className="p-4">Sugeridor IA</div>}/>
                <Route path="/premium/chat" element={<div className="p-4">Chat</div>}/>
                <Route path="/premium/mis-sesiones" element={<div className="p-4">Mis sesiones</div>}/>
                <Route path="/chef/mis-recetas" element={<div className="p-4">Mis recetas</div>}/>
                <Route path="/chef/nueva-receta" element={<div className="p-4">Nueva receta</div>}/>
            </Route>

            <Route path="*" element={<div className="p-8">404</div>}/>
        </Routes>
    );
}

export default App;