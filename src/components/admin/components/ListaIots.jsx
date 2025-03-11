import React, { useEffect, useState } from "react";

const ListaIots = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚀 Obtener dispositivos desde la API
  useEffect(() => {
    const obtenerDispositivos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dispositivos");
        if (!res.ok) {
          throw new Error("Error al obtener la lista de dispositivos");
        }

        const data = await res.json();
        setDispositivos(data);
      } catch (err) {
        setError("❌ Error al cargar los dispositivos.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDispositivos();
  }, []);

  return (
    <div style={styles.listaIotsContainer}>
      <div style={styles.listaIotsCard}>
        <h2 style={styles.mb4}>📡 Listado de Dispositivos IoT</h2>

        {loading ? (
          <p style={styles.listaIotsLoading}>Cargando dispositivos...</p>
        ) : (
          <table style={styles.listaIotsTable}>
            <thead>
              <tr>
                <th>Correo</th>
                <th>MAC</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dispositivos.length > 0 ? (
                dispositivos.map((dispositivo, index) => (
                  <tr key={index}>
                    <td>{dispositivo.correo}</td>
                    <td>{dispositivo.mac}</td>
                    <td>
                      <span style={dispositivo.estado.toLowerCase() === "encendido" ? styles.estadoEncendido : styles.estadoApagado}>
                        {dispositivo.estado}
                      </span>
                    </td>
                    <td>
                      <button style={styles.listaIotsBtn}>Ver Detalles</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={styles.textCenter}>
                    No se encontraron dispositivos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {error && <p style={styles.listaIotsError}>{error}</p>}
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  listaIotsContainer: {
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
  listaIotsCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  listaIotsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "5px",
    overflow: "hidden",
  },
  listaIotsTableHead: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
  },
  estadoEncendido: {
    backgroundColor: "#00DF38", // Verde Encendido
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  estadoApagado: {
    backgroundColor: "#FF2DB", // Rosa Apagado
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  listaIotsBtn: {
    backgroundColor: "#00515F", // Azul Navbar
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  listaIotsBtnHover: {
    backgroundColor: "#00404A",
  },
  textCenter: {
    textAlign: "center",
    padding: "10px",
    color: "#555",
  },
  listaIotsError: {
    color: "#FF2DB", // Rosa error
    fontWeight: "bold",
  },
};

export default ListaIots;
