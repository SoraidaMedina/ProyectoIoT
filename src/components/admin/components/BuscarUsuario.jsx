
import React, { useState } from "react";

const BuscarUsuario = () => {
  const [correo, setCorreo] = useState("");
  const [mac, setMac] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚀 Función para buscar usuarios en la API
  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios?correo=${correo}&mac=${mac}`);
      if (!response.ok) throw new Error("Error al obtener los datos");

      const data = await response.json();
      setResultados(data);
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.buscarUsuarioContainer}>
      <div style={styles.buscarUsuarioCard}>
        <h2>🔎 Buscar Usuario</h2>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleBuscar} style={styles.buscarUsuarioForm}>
          <label>📧 Correo Electrónico</label>
          <input
            type="email"
            placeholder="Ingrese el correo del usuario"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={styles.buscarUsuarioInput}
          />

          <label>🔍 MAC del Dispositivo</label>
          <input
            type="text"
            placeholder="Ej: AA:BB:CC:DD:EE:FF"
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            style={styles.buscarUsuarioInput}
          />

          <button type="submit" style={styles.buscarUsuarioBtn} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {/* Mensaje de error */}
        {error && <p style={styles.buscarUsuarioError}>{error}</p>}

        {/* Tabla de resultados */}
        <table style={styles.buscarUsuarioTable}>
          <thead>
            <tr>
              <th>Correo</th>
              <th>Dispositivo</th>
              <th>MAC</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {resultados.length > 0 ? (
              resultados.map((usuario, index) => (
                <tr key={index}>
                  <td>{usuario.correo}</td>
                  <td>{usuario.dispositivo}</td>
                  <td>{usuario.mac}</td>
                  <td>
                    <span style={usuario.estado === "Encendido" ? styles.estadoEncendido : styles.estadoApagado}>
                      {usuario.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={styles.textCenter}>
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  buscarUsuarioContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  buscarUsuarioCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  buscarUsuarioForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buscarUsuarioInput: {
    backgroundColor: "#ffffff",
    color: "black",
    border: "1px solid #bdc3c7",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
  },
  buscarUsuarioBtn: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  buscarUsuarioBtnHover: {
    backgroundColor: "#FFDD44",
  },
  buscarUsuarioTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "5px",
    overflow: "hidden",
  },
  textCenter: {
    textAlign: "center",
    padding: "10px",
    color: "#555",
  },
  estadoEncendido: {
    backgroundColor: "#00DF38", // Verde Encendido
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  estadoApagado: {
    backgroundColor: "#FF2DB", // Rosa Apagado
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
  },
};

export default BuscarUsuario;
