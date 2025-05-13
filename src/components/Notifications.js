import React, { useEffect, useState, useContext } from 'react';
import './../styles.css'; // Archivo de estilos para el componente
import Toolbar from './Toolbar';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación
import { NotificationsContext } from '../context/NotificationsContext';

function Notifications() {
    const [alerts, setAlerts] = useState([]); // Estado para almacenar las alertas
    const [error, setError] = useState(''); // Estado para manejar errores
    const [selectedAlert, setSelectedAlert] = useState(null); // Estado para la alerta seleccionada
    const navigate = useNavigate(); // Hook para la navegación
    const { setUnreadCount } = useContext(NotificationsContext); // Acceder al contexto

    useEffect(() => {
        // Función para obtener las alertas desde la base de datos
        const fetchAlerts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/alertas');
                if (!response.ok) {
                    throw new Error('Error al obtener las alertas');
                }
                const data = await response.json();

                if (data.success) {
                    setAlerts(data.data); // Almacenar las alertas obtenidas
                    // Actualizar el contador de notificaciones no leídas
                    const unreadCount = data.data.filter(alert => !alert.leido).length;
                    setUnreadCount(unreadCount);
                }
            } catch (err) {
                console.error('Error al obtener las alertas:', err);
                setError('No se pudieron cargar las alertas');
            }
        };

        fetchAlerts();
    }, [setUnreadCount]);

    // Función para manejar la selección de una notificación
    const handleSelectAlert = (alert) => {
        // Traducir "bottle" a "botella" en el mensaje
        markAsRead(alert.id); // Marcar la alerta como leída
        const translatedMessage = alert.mensaje.replace('bottle', 'botella');
        setSelectedAlert({ ...alert, mensaje: translatedMessage });
    };
    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/alertas/${id}/marcar-leida`, {
                method: 'PUT',
            });

            // Actualizar el estado local para reflejar el cambio
            setAlerts(prevAlerts =>
                prevAlerts.map(alert =>
                    alert.id === id ? { ...alert, leido: true } : alert
                )
            );

            // Actualizar el contador de notificaciones no leídas
            setUnreadCount(prevCount => Math.max(prevCount - 1, 0));
        } catch (err) {
            console.error('Error al marcar la alerta como leída:', err);
        }
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setSelectedAlert(null);
    };

    // Función para abrir Google Maps con la dirección dada
    const openInGoogleMaps = () => {
        const address = "Calle 18 #40-07";
        const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <div className="notifications-container">
            <h2>Notificaciones</h2>
            {error && <p className="error-message">{error}</p>}
            {alerts.length === 0 && !error && <p>No hay notificaciones disponibles</p>}
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`notification-item ${alert.leido ? 'read' : 'unread'}`}
                    onClick={() => handleSelectAlert(alert)}
                >
                    <p><strong>Mensaje:</strong> {alert.mensaje}</p>
                    <p><strong>Estado:</strong> {alert.leido ? 'Leído' : 'No leído'}</p>
                    <p><strong>Fecha:</strong> {new Date(alert.fecha_alerta).toLocaleString()}</p>
                </div>
            ))}

            {/* Modal */}
            {selectedAlert && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Bote de basura más cercano</h2>
                        <p><strong>Dirección:</strong> Calle 18 #40-07</p>
                        <h2>Detalles de la Notificacion</h2>
                        <p><strong>Mensaje:</strong> {selectedAlert.mensaje}</p>
                        <p><strong>Ubicación:</strong> {selectedAlert.ubicacion}</p>
                        <p><strong>Fecha:</strong> {new Date(selectedAlert.fecha_alerta).toLocaleString()}</p>
                        <button onClick={closeModal}>Cerrar</button>
                        <button onClick={openInGoogleMaps}>Abrir en Google Maps</button>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <Toolbar onNavigate={navigate} />
        </div>
    );
}

export default Notifications;