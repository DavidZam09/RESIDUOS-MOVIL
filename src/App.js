import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ScanQR from './components/ScanQR';
import GenerateQR from './components/GenerateQR';
import Login from './components/Login';
import Notifications from './components/Notifications';
import { NotificationsProvider } from './context/NotificationsContext'; // Importar el proveedor del contexto
import Register from './components/Register';

function App() {
  return (
    <NotificationsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/generate" element={<GenerateQR />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    </NotificationsProvider>
  );
}

export default App;
