import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles.css'; // Archivo de estilos para el componente

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Almacenar el id y el username en el localStorage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        // Redirigir al Dashboard
        navigate('/dashboard');
      } else {
        setError(data.message); // Muestra el mensaje de error del backend
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Login;