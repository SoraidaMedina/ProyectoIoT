import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FaSignOutAlt, FaSignInAlt, FaHome, FaStore, FaQuestionCircle, 
  FaUsers, FaEnvelope, FaPaw, FaTachometerAlt, FaUser, FaCog, FaLifeRing,
  FaNetworkWired 
} from "react-icons/fa";
import logo from "../assets/Logo.png";
import { useUserContext } from "../context/UserContext";

// Enlaces públicos con iconos
const publicNavLinks = [
  { name: "Inicio", to: "/", icon: <FaHome className="me-2" /> },
  { name: "Tienda", to: "/tienda", icon: <FaStore className="me-2" /> },
  { name: "Preguntas Frecuentes", to: "/preguntas-frecuentes", icon: <FaQuestionCircle className="me-2" /> },
  { name: "Nosotros", to: "/nosotros", icon: <FaUsers className="me-2" /> },
];

// Enlaces privados con iconos
const privateNavLinks = [
  { name: "Cliente", to: "/cliente", icon: <FaUser className="me-2" /> },
  { name: "Tienda", to: "/tienda", icon: <FaStore className="me-2" /> },
];

function NavigationBar() {
  const { user, logout } = useUserContext();
  const location = useLocation(); // Hook para obtener la ubicación actual
  
  // Verificar si estamos en una ruta de administrador
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Navbar style={{ backgroundColor: "#00515f" }} variant="dark" expand="lg" fixed="top">
      <Container>
        {/* Logo y nombre de la marca - siempre visible */}
        <Navbar.Brand as={NavLink} to={isAdminRoute ? "/admin" : "/"} className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            width="60"
            height="60"
            className="me-2 logo-img"
            style={{ borderRadius: "50%", border: "2px solid rgb(219, 37, 37)" }}
          />
          <span className="fs-5 fw-bold text-white">
            {isAdminRoute ? "Panel de Administración" : "Sabor y Huellitas"}
          </span>
        </Navbar.Brand>

        {/* Si estamos en ruta de administrador, solo mostrar el botón de Cerrar Sesión */}
        {isAdminRoute ? (
          <Button
            variant="outline-light"
            onClick={logout}
            className="ms-auto"
            style={{
              borderColor: "#ffffff",
              color: "#ffffff",
              transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FFC914";
              e.currentTarget.style.borderColor = "#FFC914";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#ffffff";
              e.currentTarget.style.color = "#ffffff";
            }}
          >
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
          </Button>
        ) : (
          /* Mostrar los enlaces normales para las rutas que no son de administrador */
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {!user &&
                  publicNavLinks.map((link, index) => (
                    <Nav.Link
                      key={index}
                      as={NavLink}
                      to={link.to}
                      className="text-white"
                      style={({ isActive }) => ({
                        borderBottom: isActive ? "2px solid #FFC914" : "none",
                        paddingBottom: "0.25rem",
                      })}
                    >
                      {link.icon} {link.name}
                    </Nav.Link>
                  ))}

                {user && (
                  <>
                    {privateNavLinks.map((link, index) => (
                      <Nav.Link
                        key={index}
                        as={NavLink}
                        to={link.to}
                        className="text-white"
                        style={({ isActive }) => ({
                          borderBottom: isActive ? "2px solid #FFC914" : "none",
                          paddingBottom: "0.25rem",
                        })}
                      >
                        {link.icon} {link.name}
                      </Nav.Link>
                    ))}

                    <NavDropdown 
                      title={<><FaNetworkWired className="me-2" /> IoT</>} 
                      id="iot-dropdown"
                      className="text-white"
                    >
                      <NavDropdown.Item as={NavLink} to="/Estado-Dispensador">
                        <FaTachometerAlt className="me-2" /> Estado IoT
                      </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/configuracion-dispensador">
                        <FaCog className="me-2" /> Configuración
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown 
                      title={<><FaUser className="me-2" /> Perfil</>} 
                      id="profile-dropdown"
                      className="text-white"
                    >
                      <NavDropdown.Item as={NavLink} to="/perfil-usuario">
                        <FaUser className="me-2" /> Perfil de Usuario
                      </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/perfil-mascota">
                        <FaPaw className="me-2" /> Perfil de Mascota
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                {user ? (
                  <Button
                    variant="outline-light"
                    onClick={logout}
                    style={{
                      borderColor: "#ffffff",
                      color: "#ffffff",
                      transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFC914";
                      e.currentTarget.style.borderColor = "#FFC914";
                      e.currentTarget.style.color = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#ffffff";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaSignOutAlt className="me-2" /> Cerrar Sesión
                  </Button>
                ) : (
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    className="text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid #FFC914" : "none",
                      paddingBottom: "0.25rem",
                    })}
                  >
                    <FaSignInAlt className="me-2" /> Iniciar Sesión
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;