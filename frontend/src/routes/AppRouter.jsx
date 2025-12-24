import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer'; // <--- Importamos el Footer
import WhatsAppButton from '../components/WhatsAppButton';

// Importamos las páginas
import Home from '../pages/Home'; 
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login'; 
import ProductDetail from '../pages/ProductDetail'; 

// COMPONENTE: Protege rutas privadas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// COMPONENTE: Evita que un logueado entre al Login de nuevo
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
  return isAuthenticated ? <Navigate to="/admin" replace /> : children;
};

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <WhatsAppButton />

        {/* El flex-grow en este div empuja al footer hacia abajo si hay poco contenido */}
        <div className="grow">
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            
            {/* Nueva ruta para la Ficha de Seguridad */}
            <Route path="/producto/:id" element={<ProductDetail />} />

            {/* RUTA DE LOGIN */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* RUTA PRIVADA ADMIN */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* IMPORTANTE: El Footer fuera de Routes para que sea global */}
        <Footer />
      </div>
    </Router>
  );
};

export default AppRouter;