import React from "react";
import AdminHeader from "./adminHeader";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={styles.adminLayout}>
      {/* Header fijo en la parte superior */}
      <AdminHeader />
      
      <div style={styles.adminBody}>
        {/* Sidebar fijo en el lado izquierdo */}
        <AdminSidebar />
        
        {/* Contenido principal */}
        <div style={styles.adminContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  adminLayout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  adminBody: {
    display: "flex",
    flex: 1,
    marginTop: "60px",
    width: "100%",
  },
  adminContent: {
    flexGrow: 1,
    padding: "20px",
    marginLeft: "250px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    minHeight: "calc(100vh - 60px)", // Solo restamos la altura del header
  }
};

export default AdminLayout;