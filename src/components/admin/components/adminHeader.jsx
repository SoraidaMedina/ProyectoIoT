import React from "react";

const AdminHeader = () => {
  // Función simple para cerrar sesión sin dependencias
  const handleLogout = () => {
    // Limpiar información de la sesión
    localStorage.removeItem("user");
    
    // Redirigir a la página de login
    window.location.href = "/login";
  };

  return (
    <div style={styles.adminHeader}>
      <div style={styles.userSection}>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

// Estilos en línea
const styles = {
  adminHeader: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#00515F",
    color: "white",
    padding: "0 20px",
    height: "60px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  },
  userSection: {
    display: "flex",
    alignItems: "center"
  },
  logoutButton: {
    backgroundColor: "#FF8000",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s"
  }
};

export default AdminHeader;