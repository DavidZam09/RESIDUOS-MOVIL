import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Toolbar from './Toolbar'; // Importar el Toolbar
import './../styles.css'; // Archivo de estilos para el Dashboard

function Dashboard() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0); // Puntos actuales
  const [level, setLevel] = useState(0); // Nivel actual
  const [isScanQRMounted, setIsScanQRMounted] = useState(true); // Controlar el montaje de ScanQR
  const maxPoints = 100; // Máximo de puntos para subir de nivel
  const usuarioId = localStorage.getItem('userId'); // Obtener el usuarioId del localStorage
  const username = localStorage.getItem('username'); // Obtener el username del localStorage

  useEffect(() => {
    // Desmontar el componente ScanQR al ingresar al Dashboard
    setIsScanQRMounted(false);

    // Función para obtener los niveles del usuario desde el backend
    const fetchNiveles = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/niveles/${usuarioId}`);
        const data = await response.json();

        if (data.success) {
          setLevel(data.data.nivel_actual || 0); // Establecer el nivel actual o 0 si no hay datos
          setPoints(data.data.puntos_acumulados || 0); // Establecer los puntos acumulados o 0 si no hay datos
        } else {
          console.error('Error al obtener los niveles:', data.message);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchNiveles();
  }, [usuarioId]);

  // Calcular el total de puntos acumulados considerando los niveles anteriores
  const totalPoints = points + (level - 1) * maxPoints;

  // Función para manejar el clic en "Canjear puntos"
  const handleRedeemPoints = () => {
    alert('¡Puntos canjeados exitosamente!');
    // Aquí puedes agregar la lógica para canjear puntos, como llamar a un endpoint del backend
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.clear(); // Limpiar el localStorage
    navigate('/'); // Redirigir al login
  };

  return (
    <div className="dashboard-container">
      {/* Botón de Logout */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <h2>Bienvenido {username}</h2>
      <div style={{ width: 200, margin: '20px auto' }}>
        <CircularProgressbar
          value={(points / maxPoints) * 100} // Calcula el porcentaje basado en los puntos actuales
          text={`Nivel ${level}`} // Muestra el nivel actual
          styles={buildStyles({
            textColor: '#000',
            pathColor: '#3b82f6',
            trailColor: '#d6d6d6',
          })}
        />
      </div>
      <p>Puntos acumulados: {totalPoints > 0 ? totalPoints : points}</p>
      <button onClick={handleRedeemPoints} className="redeem-button">
        Canjear puntos
      </button>

      {/* Toolbar */}
      <Toolbar onNavigate={navigate} />
    </div>
  );
}

export default Dashboard;