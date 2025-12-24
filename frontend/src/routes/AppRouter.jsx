import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Home from "../pages/Home";
import Productos from "../pages/Productos";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductDetail from "../pages/ProductDetail";

// Protege rutas privadas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("admin_auth") === "true";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Evita que un logueado entre al Login de nuevo
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("admin_auth") === "true";
  return isAuthenticated ? <Navigate to="/admin" replace /> : children;
};

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <WhatsAppButton />
        <div className="grow">
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />

            {/* Ruta para el catálogo completo */}
            <Route path="/productos" element={<Productos />} />

            {/* Ruta para la Ficha de Seguridad Individual */}
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRouter;
