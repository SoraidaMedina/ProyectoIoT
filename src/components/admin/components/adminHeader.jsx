import React from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <nav style={styles.adminHeader}>
      <div style={styles.headerContainer}>
        {/* Marca / Nombre */}
        <Link style={styles.brand} to="/admin">
          Grande Sabor y Huellitas
        </Link>

        {/* Opciones a la derecha */}
        <ul style={styles.navOptions}>
          <li>
            <Link style={styles.navLink} to="/admin/notificaciones">
              Notificaciones
            </Link>
          </li>
          <li>
            <Link style={styles.navLink} to="/admin/perfil">
              Perfil
            </Link>
          </li>
          <li>
            <Link style={styles.navLink} to="/logout">
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  adminHeader: {
    backgroundColor: "rgba(31, 36, 39, 0.8)", // Gris oscuro con transparencia
    padding: "15px 20px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#FFC914", // Amarillo
    textDecoration: "none",
  },
  navOptions: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "#FFFFFF", // Blanco
    textDecoration: "none",
    transition: "color 0.3s ease-in-out",
    fontWeight: "bold",
  },
  navLinkHover: {
    color: "#FF8000", // Verde/Naranja fuerte
  },
};

export default AdminHeader;
