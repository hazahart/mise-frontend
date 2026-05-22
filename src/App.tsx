import {Routes, Route} from 'react-router-dom';
import Login from '@/pages/login/Login';
import Registro from '@/pages/login/Registro';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registro" element={<Registro/>}/>
            <Route path="/" element={<div className="p-8">Home — en construcción</div>}/>
            <Route path="*" element={<div className="p-8">404</div>}/>
        </Routes>
    );
}

export default App;