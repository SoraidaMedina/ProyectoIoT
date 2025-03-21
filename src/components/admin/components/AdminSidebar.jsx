import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div style={styles.adminSidebar}>
      <ul style={styles.sidebarList}>
        {/* Dashboard */}
        <li>
          <Link to="/admin" style={styles.sidebarLink}>🏠 Dashboard</Link>
        </li>

        {/* Usuarios */}
        <li>
          <strong style={styles.sectionTitle}>Usuarios</strong>
          <ul>
            <li><Link to="/admin/crud-usuarios" style={styles.sidebarLink}>✏️ Administrar Usuarios</Link></li>
          </ul>
        </li>

        {/* Tienda */}
        <li>
          <strong style={styles.sectionTitle}>Tienda</strong>
          <ul>
            <li><Link to="/admin/crud-tienda" style={styles.sidebarLink}>🛒 Administrar Productos</Link></li>
            <li><Link to="/admin/crud-pedidos" style={styles.sidebarLink}>📦 Administrar Pedidos</Link></li>
          </ul>
        </li>

        {/* Configuración */}
        <li>
          <strong style={styles.sectionTitle}>Configuración</strong>
          <ul>
            <li><Link to="/admin/crud-preguntas" style={styles.sidebarLink}>❓ Administrar Preguntas Frecuentes</Link></li>
            <li><Link to="/admin/configuracion-datos" style={styles.sidebarLink}>⚙️ Configuración de Datos</Link></li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  adminSidebar: {
    width: "250px",
    backgroundColor: "#1F2427", // Gris oscuro
    padding: "15px",
    overflowY: "auto",
    position: "fixed",
    left: 0,
    top: "60px", // Posicionado debajo del header
    bottom: 0, // Extendido hasta el fondo
    display: "flex",
    flexDirection: "column",
  },
  sidebarList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  sidebarLink: {
    color: "#ffffff", // Blanco
    textDecoration: "none",
    display: "block",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease-in-out, color 0.3s",
  },
  sidebarLinkHover: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
  },
  sectionTitle: {
    color: "white",
    display: "block",
    marginTop: "10px",
    fontSize: "1rem",
  },
};

export default AdminSidebar;