import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { UserProvider, useUserContext } from "./context/UserContext";
import { CartProvider } from "./context/CartContext"; // Importamos CartProvider

// Importa tus componentes aquí...
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
import PerfilMascota from "./components/pages/PerfilMascota";
import EstadoDispensador from "./components/pages/EstadoDispensador";
import PerfilPage from "./components/pages/PerfilPage";
import RecuperarContrasena from './components/RecuperarContrasena';
import ConfirmacionPedido from "./components/ConfirmacionPedido";
import Dispensador from "./components/pages/Dispensador";

// Importa los componentes de administración
import AdminLayout from "./components/Admin/components/adminLayout";
import Dashboard from "./components/admin/components/Dashboard";
import BuscarUsuario from "./components/admin/components/BuscarUsuario";
import ListaUsuarios from "./components/admin/components/ListaUsuarios";
import BuscarIoT from "./components/admin/components/BuscarIot";
import ListaIots from "./components/admin/components/ListaIots";
import ConfiguracionDatos from "./components/admin/components/ConfiguracionDatos";
import PersonalizacionPanel from "./components/Admin/components/PersonalizacionPanel";
import HistorialActividades from "./components/Admin/components/HistorialActividades";
import AdminCRUDUsuarios from "./components/admin/components/AdminCRUDUsuarios";
import AdminCRUDTienda from "./components/admin/components/AdminCRUDTienda";
import AdminCRUDPedidos from "./components/admin/components/AdminCRUDPedidos"
import AdminCRUDPreguntas from "./components/admin/components/AdminCRUDPreguntas";

// Importa Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <UserProvider> {/* Envuelve toda la aplicación con UserProvider */}
      <CartProvider> {/* Añadimos CartProvider para manejar el estado del carrito */}
        <Router>
          <NavigationBar /> {/* NavigationBar ya no necesita props */}

          <Routes>
            {/* Página principal */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <InfoSection />
                  <CarouselSection />
                  <PurchaseProcess />
                </>
              }
            />

            {/* Rutas públicas */}
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/confirmacion/:id" element={<ConfirmacionPedido />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/subir-imagen" element={<SubirImagen />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/politicas" element={<Politicas />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/testimonios" element={<Testimonios />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contraseña" element={<RecuperarContrasena />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas (solo accesibles si el usuario está autenticado) */}
            <Route
              path="/cliente"
              element={
                <ProtectedRoute>
                  <Cliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil-mascota"
              element={
                <ProtectedRoute>
                  <PerfilMascota />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Estado-Dispensador"
              element={
                <ProtectedRoute>
                  <Dispensador />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion-dispensador"
              element={
                <ProtectedRoute>
                  <ConfiguracionDispensador />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil-usuario"
              element={
                <ProtectedRoute>
                  <PerfilPage />
                </ProtectedRoute>
              }
            />

            {/* 🔹 Rutas del Admin (protegidas y solo accesibles para administradores) */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="buscar-usuario" element={<BuscarUsuario />} />
              <Route path="lista-usuario" element={<ListaUsuarios />} />
              <Route path="buscar-iot" element={<BuscarIoT />} />
              <Route path="listado-iot" element={<ListaIots />} />
              <Route path="configuracion-datos" element={<ConfiguracionDatos />} />
              <Route path="personalizacion-panel" element={<PersonalizacionPanel />} />
              <Route path="historial" element={<HistorialActividades />} />
              <Route path="crud-usuarios" element={<AdminCRUDUsuarios />} />
              <Route path="crud-tienda" element={<AdminCRUDTienda />} />
              <Route path="crud-pedidos" element={<AdminCRUDPedidos />} />
              <Route path="crud-preguntas" element={<AdminCRUDPreguntas />} />
            </Route>
          </Routes>
          <Footer />

          {/* Ícono flotante de WhatsApp */}
          <a
            href="https://wa.me/7717492349"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#25D366",
              borderRadius: "50%",
              padding: "15px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease",
              zIndex: 9999,
            }}
            className="whatsapp-icon"
          >
            <FaWhatsapp size={50} style={{ color: "white", fontSize: "30px" }} />
          </a>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext(); // Obtén el usuario del contexto

  if (!user) {
    return <Navigate to="/login" />; // Redirige al login si no hay usuario
  }

  return children; // Renderiza el componente protegido si el usuario está autenticado
};

// Componente para rutas protegidas de administrador
const AdminProtectedRoute = ({ children }) => {
  const { user } = useUserContext(); // Obtén el usuario del contexto

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />; // Redirige al login si no hay usuario o no es admin
  }

  return children; // Renderiza el componente protegido si el usuario es admin
};
export default App;