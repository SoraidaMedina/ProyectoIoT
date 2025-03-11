import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa"; // Ícono de WhatsApp

import SubirImagen from "./components/SubirImagen";
import Contact from "./components/Contact";
import NavigationBar from "./components/Navbar";
import Nosotros from "./components/Nosotros";
import PreguntasFrecuentes from "./components/PreguntasFrecuentes";
import Hero from "./components/Hero";
import InfoSection from "./components/InfoSection";
import CarouselSection from "./components/CarouselSection";
import PurchaseProcess from "./components/PurchaseProcess";
import Tienda from "./components/Tienda";
import Politicas from "./components/Politicas";
import Testimonios from "./components/Testimonios";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Cliente from "./components/pages/Cliente";
import ConfiguracionDispensador from "./components/pages/ConfiguracionDispensador";
import EstadoDispensador from "./components/pages/EstadoDispensador";
import PerfilMascota from "./components/pages/PerfilMascota";

// 🔹 Importamos los componentes del Admin desde `admin/components/`
import AdminLayout from "./components/admin/components/AdminLayout";
import Dashboard from "./components/admin/components/Dashboard";
import BuscarUsuario from "./components/admin/components/BuscarUsuario";
import ListaUsuarios from "./components/admin/components/ListaUsuarios";
import BuscarIoT from "./components/admin/components/BuscarIoT";
import ListaIots from "./components/admin/components/ListaIots";
import ConfiguracionDatos from "./components/admin/components/ConfiguracionDatos";
import PersonalizacionPanel from "./components/admin/components/PersonalizacionPanel";
import HistorialActividades from "./components/admin/components/HistorialActividades";


// Importamos Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Simulación de admin

  const handleLogin = (rol) => {
    setIsAuthenticated(true);
    setIsAdmin(rol === "admin"); // Simulación: Si el rol es admin, activa isAdmin
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const styles = {
    whatsappIcon: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#25D366",
      borderRadius: "50%",
      padding: "15px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      transition: "transform 0.3s ease",
      zIndex: 9999,
    },
    whatsappIconLink: {
      color: "white",
      fontSize: "30px",
    },
  };

  return (
    <Router>
      <NavigationBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        {/* Página principal */}
        <Route path="/" element={
          <>
            <Hero />
            <InfoSection />
            <CarouselSection />
            <PurchaseProcess />
          </>
        } />

        {/* Rutas individuales */}
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/subir-imagen" element={<SubirImagen />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/politicas" element={<Politicas />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/testimonios" element={<Testimonios />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas del Cliente (solo si está autenticado) */}
        {isAuthenticated && (
          <>
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/perfil-mascota" element={<PerfilMascota />} />
            <Route path="/estado-dispensador" element={<EstadoDispensador />} />
            <Route path="/configuracion-dispensador" element={<ConfiguracionDispensador />} />
          </>
        )}

      {/* 🔹 Rutas del Admin (ahora accesibles para todos) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="buscar-usuario" element={<BuscarUsuario />} />
        <Route path="lista-usuario" element={<ListaUsuarios />} />
        <Route path="buscar-iot" element={<BuscarIoT />} />
        <Route path="listado-iot" element={<ListaIots />} />
        <Route path="configuracion-datos" element={<ConfiguracionDatos />} />
        <Route path="personalizacion-panel" element={<PersonalizacionPanel />} />
        <Route path="historial" element={<HistorialActividades />} />
      </Route>


        {/* Redirección si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />

      {/* Ícono flotante de WhatsApp */}
      <a
        href="https://wa.me/7717492349"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.whatsappIcon}
        className="whatsapp-icon"
      >
        <FaWhatsapp size={50} style={styles.whatsappIconLink} />
      </a>
    </Router>
  );
}

export default App;
