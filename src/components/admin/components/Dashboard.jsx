import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState(0);
  const [dispositivos, setDispositivos] = useState(0);
  const [historial, setHistorial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚀 Obtener datos del Dashboard
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [resUsuarios, resDispositivos, resHistorial] = await Promise.all([
          fetch("http://localhost:5000/api/usuarios/total"),
          fetch("http://localhost:5000/api/dispositivos/total"),
          fetch("http://localhost:5000/api/historial/total"),
        ]);

        if (!resUsuarios.ok || !resDispositivos.ok || !resHistorial.ok) {
          throw new Error("Error al obtener datos del servidor");
        }

        const totalUsuarios = await resUsuarios.json();
        const totalDispositivos = await resDispositivos.json();
        const totalHistorial = await resHistorial.json();

        setUsuarios(totalUsuarios.total);
        setDispositivos(totalDispositivos.total);
        setHistorial(totalHistorial.total);
      } catch (err) {
        setError("❌ Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div style={styles.dashboardContainer}>
      <h2>📊 Panel de Administración</h2>
      <p>Bienvenido al dashboard. Aquí puedes ver un resumen de la actividad del sistema.</p>

      {loading ? (
        <p style={styles.dashboardLoading}>Cargando datos...</p>
      ) : (
        <div style={styles.dashboardMetricas}>
          <div style={{ ...styles.dashboardCard, ...styles.dashboardCardPrimary }}>
            <div style={styles.dashboardCardHeader}>Usuarios</div>
            <div style={styles.dashboardCardBody}>
              <h5>Total: {usuarios}</h5>
              <p>Usuarios registrados en el sistema.</p>
            </div>
          </div>

          <div style={{ ...styles.dashboardCard, ...styles.dashboardCardSuccess }}>
            <div style={styles.dashboardCardHeader}>Dispositivos IoT</div>
            <div style={styles.dashboardCardBody}>
              <h5>Total: {dispositivos}</h5>
              <p>Dispositivos conectados actualmente.</p>
            </div>
          </div>

          <div style={{ ...styles.dashboardCard, ...styles.dashboardCardWarning }}>
            <div style={styles.dashboardCardHeader}>Historial de Actividades</div>
            <div style={styles.dashboardCardBody}>
              <h5>Total: {historial}</h5>
              <p>Consulta las acciones recientes de los usuarios.</p>
            </div>
          </div>
        </div>
      )}

      {error && <p style={styles.dashboardError}>{error}</p>}
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  dashboardContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  dashboardMetricas: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "20px",
  },
  dashboardCard: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out",
  },
  dashboardCardPrimary: {
    backgroundColor: "#00515F", // Navbar
  },
  dashboardCardSuccess: {
    backgroundColor: "#00DF38", // Verde
  },
  dashboardCardWarning: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
  },
  dashboardCardHeader: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  dashboardCardBody: {
    fontSize: "1rem",
  },
  dashboardError: {
    color: "#FF2DB", // Rosa error
    fontWeight: "bold",
  },
};

export default Dashboard;
