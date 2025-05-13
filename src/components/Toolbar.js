import React, { useContext, useEffect } from 'react';
import { FaHome, FaBell, FaCamera } from 'react-icons/fa';
import './../styles.css';
import { NotificationsContext } from '../context/NotificationsContext';

function Toolbar({ onNavigate }) {
  const { unreadCount, setUnreadCount } = useContext(NotificationsContext); // Acceder al contexto

  useEffect(() => {
    // Función para obtener alertas desde el servicio externo y hacer el insert
    const fetchAndInsertAlerts = async () => {
      try {
        // Obtener el usuario_id desde el localStorage
        const usuario_id = localStorage.getItem('userId');
        if (!usuario_id) {
          console.error('No se encontró el usuario_id en el localStorage');
          return;
        }

        // Obtener alertas desde el servicio externo
        const response = await fetch('http://127.0.0.1:9000/alertas');
        if (!response.ok) {
          throw new Error('Error al obtener las alertas del servicio externo');
        }
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // Transformar y insertar cada alerta en el servicio interno
          for (const alert of data.data) {
            const transformedAlert = {
              mensaje: alert.mensaje,
              ip: alert.ip,
              ubicacion: `${alert.ubicacion.ciudad}, ${alert.ubicacion.pais}`,
              usuario_id: parseInt(usuario_id, 10), // Convertir el usuario_id a número
            };

            await fetch('http://127.0.0.1:5000/api/alertas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(transformedAlert),
            });
          }
        }

        // Obtener el conteo de alertas no leídas desde el servicio interno
        const unreadResponse = await fetch('http://127.0.0.1:5000/api/alertassinleer');
        if (!unreadResponse.ok) {
          throw new Error('Error al obtener el conteo de alertas no leídas');
        }
        const unreadData = await unreadResponse.json();

        if (unreadData.success) {
          setUnreadCount(unreadData.data.length); // Actualizar el contador de notificaciones no leídas
        }
      } catch (err) {
        console.error('Error al procesar las alertas:', err);
      }
    };

    // Configurar el polling para verificar nuevas alertas cada 10 segundos
    const interval = setInterval(fetchAndInsertAlerts, 10000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [setUnreadCount]);

  return (
    <div className="toolbar">
      <div className="toolbar-item" onClick={() => onNavigate('/dashboard')}>
        <FaHome size={24} />
        <p>Inicio</p>
      </div>
      <div className="toolbar-scan" onClick={() => onNavigate('/scan')}>
        <FaCamera size={24} />
      </div>
      <div
        className="toolbar-item"
        onClick={() => onNavigate('/notifications')}
        style={{ position: 'relative' }}
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
        <p>Notificaciones</p>
      </div>
    </div>
  );
}

export default Toolbar;