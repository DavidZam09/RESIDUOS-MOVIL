import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './../styles.css'; // Archivo de estilos para el componente
import Toolbar from './Toolbar';

function ScanQR() {
  const [qrData, setQrData] = useState(null); // Estado para almacenar los datos del QR
  const navigate = useNavigate();
  const scannerRef = useRef(null); // Referencia para el escáner

  // Obtener el usuarioId del localStorage
  const usuarioId = localStorage.getItem('userId');

  const updateNiveles = async (pointsToAdd) => {
    try {
      if (!usuarioId) {
        console.error('Usuario no autenticado. No se encontró userId en el localStorage.');
        return;
      }

      const updateResponse = await fetch('http://localhost:5000/api/niveles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          puntos_acumulados: pointsToAdd,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.success) {
        console.log('Niveles actualizados correctamente.');
        navigate('/dashboard', { state: { pointsToAdd } }); // Redirige al Dashboard
      } else {
        console.error('Error al actualizar los niveles:', updateData.message);
      }
    } catch (error) {
      console.error('Error al actualizar los niveles:', error);
    }
  };

  useEffect(() => {
    // Inicializa el escáner
    const initializeScanner = () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Error al limpiar el escáner antes de inicializar:', error);
        });
      }

      scannerRef.current = new Html5QrcodeScanner(
        'reader', // ID del contenedor donde se renderiza el escáner
        { fps: 10, qrbox: 250 }, // Configuración del escáner
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          if (decodedText) {
            setQrData(decodedText); // Almacena los datos escaneados
            if (decodedText === '10') {
              scannerRef.current.clear().then(() => {
                console.log('Escáner limpiado correctamente antes de actualizar niveles.');
                updateNiveles(10); // Sumar 10 puntos
              }).catch((error) => {
                console.error('Error al limpiar el escáner antes de actualizar niveles:', error);
              });
            }
          }
        },
        (error) => {
          console.error('Error al escanear el código QR:', error);
        }
      );
    };

    initializeScanner();

    // Limpia el escáner al desmontar el componente
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().then(() => {
          console.log('Escáner limpiado correctamente al desmontar.');
        }).catch((error) => {
          console.error('Error al limpiar el escáner al desmontar:', error);
        });
      }
    };
  }, [navigate]);

  return (
    <div className="scan-qr-container">
      <h2>Escanear Código QR</h2>
      <div id="reader" style={{ width: '100%' }}></div>
      {qrData && (
        <div className="qr-result">
          <h3>Datos del QR:</h3>
          <p>{qrData}</p>
        </div>
      )}
      {/* Toolbar */}
      <Toolbar onNavigate={navigate} />
    </div>
  );
}

export default ScanQR;