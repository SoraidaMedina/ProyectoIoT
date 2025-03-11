import React, { useState, useEffect } from "react";

const ConfiguracionDatos = () => {
  const [datos, setDatos] = useState({
    vision: "",
    mision: "",
    compromiso: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚀 Obtener los datos actuales de la configuración desde la API
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/configuracion");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        setDatos(data);
      } catch (err) {
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // 🚀 Manejo de cambios en los inputs
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // 🚀 Guardar cambios en la API
  const handleGuardar = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) throw new Error("Error al guardar los datos");

      alert("✅ Datos actualizados correctamente.");
    } catch (err) {
      setError("❌ Error al guardar los datos.");
    }
  };

  return (
    <div style={styles.configuracionContainer}>
      <div style={styles.configuracionCard}>
        <h2>⚙️ Configuración de Datos</h2>

        {loading ? (
          <p style={styles.configuracionLoading}>Cargando configuración...</p>
        ) : (
          <form style={styles.configuracionForm}>
            <label>📌 Visión</label>
            <textarea
              rows={2}
              name="vision"
              value={datos.vision}
              onChange={handleChange}
              style={styles.configuracionInput}
            />

            <label>📌 Misión</label>
            <textarea
              rows={2}
              name="mision"
              value={datos.mision}
              onChange={handleChange}
              style={styles.configuracionInput}
            />

            <label>📌 Compromiso</label>
            <textarea
              rows={2}
              name="compromiso"
              value={datos.compromiso}
              onChange={handleChange}
              style={styles.configuracionInput}
            />

            <button type="button" style={styles.configuracionBtn} onClick={handleGuardar}>
              Guardar Cambios
            </button>
          </form>
        )}

        {error && <p style={styles.configuracionError}>{error}</p>}
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  configuracionContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  configuracionCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  configuracionForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  configuracionInput: {
    backgroundColor: "#ffffff",
    color: "black",
    border: "1px solid #bdc3c7",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
    resize: "none",
  },
  configuracionBtn: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  configuracionBtnHover: {
    backgroundColor: "#FFDD44",
  },
  configuracionError: {
    color: "#FF2DB",
    fontWeight: "bold",
  },
};

export default ConfiguracionDatos;
