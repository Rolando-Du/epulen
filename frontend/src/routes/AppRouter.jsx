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
import Products from "../pages/Products";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductDetail from "../pages/ProductDetail";

const ProtectedRoute = ({ children }) => {
  const token =
    sessionStorage.getItem("admin_token");

  return token ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
};

const PublicRoute = ({ children }) => {
  const token =
    sessionStorage.getItem("admin_token");

  return token ? (
    <Navigate
      to="/admin"
      replace
    />
  ) : (
    children
  );
};

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />

        <WhatsAppButton />

        <div className="grow">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/productos"
              element={
                <Navigate
                  to="/products"
                  replace
                />
              }
            />

            <Route
              path="/producto/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

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