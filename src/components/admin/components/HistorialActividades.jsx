import React, { useEffect, useState } from "react";

const HistorialActividades = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚀 Obtener historial de actividades desde la API
  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/historial");
        if (!res.ok) {
          throw new Error("Error al obtener el historial");
        }

        const data = await res.json();
        setHistorial(data);
      } catch (err) {
        setError("❌ Error al cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  return (
    <div style={styles.historialContainer}>
      <h2>📜 Historial de Actividades</h2>

      {loading ? (
        <p style={styles.historialLoading}>Cargando historial...</p>
      ) : (
        <table style={styles.historialTable}>
          <thead>
            <tr>
              <th>Correo</th>
              <th>MAC del Dispositivo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {historial.length > 0 ? (
              historial.map((registro, index) => (
                <tr key={index}>
                  <td>{registro.correo}</td>
                  <td>{registro.mac}</td>
                  <td>{registro.accion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={styles.textCenter}>
                  No hay actividades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {error && <p style={styles.historialError}>{error}</p>}
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  historialContainer: {
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
  historialTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "5px",
    overflow: "hidden",
  },
  historialTableHead: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
    padding: "10px",
    color: "#555",
  },
  historialError: {
    color: "#FF2DB", // Rosa error
    fontWeight: "bold",
  },
};

export default HistorialActividades;
