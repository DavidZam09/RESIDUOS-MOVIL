import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles.css'; // Archivo de estilos para el componente

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Usuario registrado exitosamente');
        setError('');
        setTimeout(() => navigate('/'), 2000); // Redirigir al login después de 2 segundos
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (err) {
      console.error('Error al registrar el usuario:', err);
      setError('Error al conectar con el servidor');
      setSuccess('');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrar Usuario</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <button onClick={handleRegister} className="register-button">
          Registrar
        </button>
      </div>
    </div>
  );
}

export default Register;