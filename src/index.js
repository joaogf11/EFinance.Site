import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);

