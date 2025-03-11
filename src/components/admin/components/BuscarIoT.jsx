import React, { useState, useEffect } from "react";

const BuscarIoT = () => {
  const [correo, setCorreo] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [resultados, setResultados] = useState([]);

  // 🚀 Cargar dispositivos desde el servidor
  useEffect(() => {
    fetch("http://localhost:5000/api/iot")
      .then((res) => res.json())
      .then((data) => setResultados(data))
      .catch((error) => console.error("Error al cargar los dispositivos:", error));
  }, []);

  // 🔍 Función para buscar dispositivos por correo en la API
  const handleBuscar = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/iot?correo=${correo}`)
      .then((res) => res.json())
      .then((data) => setResultados(data))
      .catch((error) => console.error("Error al buscar dispositivos:", error));
  };

  // 🔄 Función para reiniciar un dispositivo (Ejemplo con alerta)
  const handleReiniciar = (mac) => {
    fetch(`http://localhost:5000/api/iot/reiniciar/${mac}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => alert(data.mensaje))
      .catch((error) => console.error("Error al reiniciar dispositivo:", error));
  };

  // 📡 Filtrado por estado
  const dispositivosFiltrados =
    estadoFiltro === "Todos"
      ? resultados
      : resultados.filter((item) => item.estado === estadoFiltro);

  return (
    <div style={styles.buscarIotContainer}>
      <div style={styles.buscarIotCard}>
        <h2>🔍 Buscar Dispositivos IoT</h2>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleBuscar} style={styles.buscarIotForm}>
          <label>📧 Correo Electrónico</label>
          <input
            type="email"
            placeholder="Ingrese el correo del usuario"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={styles.buscarIotInput}
          />
          <button type="submit" style={styles.buscarIotBtn}>Buscar</button>
        </form>

        {/* Filtro de estado */}
        <label>📡 Filtrar por estado</label>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={styles.buscarIotInput}
        >
          <option value="Todos">Todos</option>
          <option value="Encendido">Encendidos</option>
          <option value="Apagado">Apagados</option>
        </select>

        {/* Tabla de resultados */}
        <table style={styles.buscarIotTable}>
          <thead>
            <tr>
              <th>Correo</th>
              <th>MAC</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dispositivosFiltrados.length > 0 ? (
              dispositivosFiltrados.map((dispositivo, index) => (
                <tr key={index}>
                  <td>{dispositivo.correo}</td>
                  <td>{dispositivo.mac}</td>
                  <td>
                    <span style={dispositivo.estado === "Encendido" ? styles.estadoEncendido : styles.estadoApagado}>
                      {dispositivo.estado}
                    </span>
                  </td>
                  <td>
                    <button style={styles.buscarIotBtnWarning} onClick={() => handleReiniciar(dispositivo.mac)}>
                      Reiniciar
                    </button>
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
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  buscarIotContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#F5F5F5",
  },
  buscarIotCard: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "500px",
    textAlign: "center",
  },
  buscarIotForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buscarIotInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buscarIotBtn: {
    padding: "10px",
    backgroundColor: "#00515F", // Navbar
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buscarIotBtnWarning: {
    padding: "10px",
    backgroundColor: "#FF8000", // Verde/Naranja fuerte
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buscarIotTable: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  textCenter: {
    textAlign: "center",
    padding: "10px",
    color: "#555",
  },
  estadoEncendido: {
    backgroundColor: "#00DF38",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  estadoApagado: {
    backgroundColor: "#FF2DB",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
  },
};

export default BuscarIoT;
