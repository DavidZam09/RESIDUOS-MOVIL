import React, { useEffect } from 'react';
import QRCode from 'qrcode';

function GenerateQR() {
  const qrValue = '20'; // Valor predeterminado del QR

  useEffect(() => {
    const generateAndDownloadQR = async () => {
      try {
        const qrCode = await QRCode.toDataURL(qrValue);
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'codigo-qr.png';
        link.click();
      } catch (error) {
        console.error('Error al generar el código QR:', error);
      }
    };

    generateAndDownloadQR();
  }, []);

  return (
    <div className="generate-qr-container">
      <h2>Generar Código QR</h2>
      <p>El código QR con el valor predeterminado de 10 se ha descargado automáticamente.</p>
    </div>
  );
}

export default GenerateQR;