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

// ==============================
// RUTA PRIVADA
// ==============================

const ProtectedRoute = ({ children }) => {
  const isAuthenticated =
    sessionStorage.getItem("admin_auth") === "true";

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

// ==============================
// RUTA PÚBLICA DE LOGIN
// ==============================

const PublicRoute = ({ children }) => {
  const isAuthenticated =
    sessionStorage.getItem("admin_auth") === "true";

  return isAuthenticated ? (
    <Navigate to="/admin" replace />
  ) : (
    children
  );
};

// ==============================
// ROUTER
// ==============================

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />

        <WhatsAppButton />

        <div className="grow">
          <Routes>
            {/* ============================== */}
            {/* RUTAS PÚBLICAS */}
            {/* ============================== */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/productos"
              element={<Productos />}
            />

            <Route
              path="/producto/:id"
              element={<ProductDetail />}
            />

            {/* ============================== */}
            {/* LOGIN */}
            {/* ============================== */}

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* ============================== */}
            {/* ADMIN */}
            {/* ============================== */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ============================== */}
            {/* 404 */}
            {/* ============================== */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default AppRouter;