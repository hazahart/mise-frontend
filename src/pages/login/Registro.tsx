import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría tu lógica para enviar datos al backend
    console.log('Datos a registrar:', { nombre, email, password });
    alert('Estructura de registro lista (revisa la consola)');
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre"
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="emailRegistro">Email:</label>
          <input 
            type="email" 
            id="emailRegistro"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="passwordRegistro">Password:</label>
          <input 
            type="password" 
            id="passwordRegistro"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit">Registrarse</button>

        <div>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>

      </form>
    </div>
  );
};