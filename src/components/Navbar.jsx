import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom"; // Asegúrate de usar NavLink
import { FaSignOutAlt, FaSignInAlt, FaHome, FaStore, FaQuestionCircle, FaUsers, FaEnvelope, FaPaw, FaTachometerAlt, FaUser, FaCog, FaLifeRing } from "react-icons/fa"; // Importar iconos
import logo from "../assets/Logo.png";

// Enlaces públicos con iconos
const publicNavLinks = [
  { name: "Inicio", to: "/", icon: <FaHome className="me-2" /> },
  { name: "Tienda", to: "/tienda", icon: <FaStore className="me-2" /> },
  { name: "Preguntas Frecuentes", to: "/preguntas-frecuentes", icon: <FaQuestionCircle className="me-2" /> },
  { name: "Nosotros", to: "/nosotros", icon: <FaUsers className="me-2" /> },
  { name: "Contacto", to: "/contacto", icon: <FaEnvelope className="me-2" /> },
];

// Enlaces privados con iconos
const privateNavLinks = [
  { name: "Perfil de Mascota", to: "/perfil-mascota", icon: <FaPaw className="me-2" /> },
  { name: "Estado Dispensador", to: "/Estado-Dispensador", icon: <FaTachometerAlt className="me-2" /> },
  { name: "Cliente", to: "/cliente", icon: <FaUser className="me-2" /> },
  { name: "Configuracion", to: "/configuracion-dispensador", icon: <FaCog className="me-2" /> },
  { name: "Soporte", to: "/contacto", icon: <FaLifeRing className="me-2" /> },
];

function NavigationBar({ isAuthenticated, handleLogout }) {
  return (
    <Navbar style={{ backgroundColor: "#00515f" }} variant="dark" expand="lg" fixed="top">
      <Container>
        {/* Logo y nombre de la marca */}
        <Navbar.Brand
          as={NavLink} // Usa NavLink aquí también
          to="/"
          className="d-flex align-items-center"
        >
          <img
            src={logo}
            alt="Logo"
            width="60"
            height="60"
            className="me-2 logo-img"
            style={{ borderRadius: "50%", border: "2px solid rgb(219, 37, 37)" }}
          />
          <span className="fs-5 fw-bold text-white">
            Sabor y Huellitas
          </span>
        </Navbar.Brand>

        {/* Botón de toggle para dispositivos móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenido colapsable de la barra de navegación */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Enlaces públicos (solo si el usuario NO está autenticado) */}
            {!isAuthenticated &&
              publicNavLinks.map((link, index) => (
                <Nav.Link
                  key={index}
                  as={NavLink} // Usa NavLink aquí
                  to={link.to}
                  className="text-white"
                  style={({ isActive }) => ({
                    borderBottom: isActive ? "2px solid #FFC914" : "none", // Línea inferior amarilla cuando está activo
                    paddingBottom: "0.25rem", // Espacio para la línea
                  })}
                >
                  {link.icon} {link.name}
                </Nav.Link>
              ))}

            {/* Enlaces privados (solo si el usuario está autenticado) */}
            {isAuthenticated &&
              privateNavLinks.map((link, index) => (
                <Nav.Link
                  key={index}
                  as={NavLink} // Usa NavLink aquí
                  to={link.to}
                  className="text-white"
                  style={({ isActive }) => ({
                    borderBottom: isActive ? "2px solid #FFC914" : "none", // Línea inferior amarilla cuando está activo
                    paddingBottom: "0.25rem", // Espacio para la línea
                  })}
                >
                  {link.icon} {link.name}
                </Nav.Link>
              ))}

            {/* Botón de autenticación (Iniciar Sesión o Cerrar Sesión) */}
            {isAuthenticated ? (
              <Button
                variant="outline-light"
                onClick={handleLogout}
                style={{
                  borderColor: "#ffffff", // Borde blanco
                  color: "#ffffff", // Texto blanco
                  transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFC914"; // Fondo amarillo al hacer hover
                  e.currentTarget.style.borderColor = "#FFC914"; // Borde amarillo al hacer hover
                  e.currentTarget.style.color = "#000000"; // Texto negro al hacer hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"; // Fondo transparente al salir
                  e.currentTarget.style.borderColor = "#ffffff"; // Borde blanco al salir
                  e.currentTarget.style.color = "#ffffff"; // Texto blanco al salir
                }}
              >
                <FaSignOutAlt className="me-2" /> Cerrar Sesión
              </Button>
            ) : (
              <Nav.Link
                as={NavLink} // Usa NavLink aquí
                to="/login"
                className="text-white"
                style={({ isActive }) => ({
                  borderBottom: isActive ? "2px solid #FFC914" : "none", // Línea inferior amarilla cuando está activo
                  paddingBottom: "0.25rem", // Espacio para la línea
                })}
              >
                <FaSignInAlt className="me-2" /> Iniciar Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;