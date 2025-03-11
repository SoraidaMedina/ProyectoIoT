import React, { useState, useEffect } from "react";

const PersonalizacionPanel = () => {
  const [personalizacion, setPersonalizacion] = useState({
    colorTema: "#000000",
    imagenLogin: "",
    mostrarLogo: true,
  });

  // 📡 Cargar datos desde la API cuando se monte el componente
  useEffect(() => {
    const obtenerPersonalizacion = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/configuracion");
        if (!res.ok) {
          throw new Error("Error al obtener la configuración");
        }

        const data = await res.json();
        setPersonalizacion(data);
      } catch (err) {
        console.error("❌ Error al cargar configuración:", err);
      }
    };

    obtenerPersonalizacion();
  }, []);

  // 🎨 Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonalizacion({
      ...personalizacion,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔄 Guardar configuración en la base de datos
  const handleGuardar = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/configuracion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalizacion),
      });

      if (!res.ok) {
        throw new Error("Error al guardar configuración");
      }

      alert("✅ Configuración guardada correctamente.");
    } catch (err) {
      console.error("❌ Error al guardar configuración:", err);
    }
  };

  return (
    <div style={styles.personalizacionContainer}>
      <div style={styles.personalizacionCard}>
        <h2>🎨 Personalización del Panel</h2>

        <form>
          <div style={styles.formGroup}>
            <label>🎨 Color del Tema</label>
            <input
              type="color"
              name="colorTema"
              value={personalizacion.colorTema}
              onChange={handleChange}
              style={styles.colorInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label>🖼 Imagen de Fondo en Login</label>
            <input
              type="text"
              name="imagenLogin"
              placeholder="URL de la imagen"
              value={personalizacion.imagenLogin}
              onChange={handleChange}
              style={styles.customInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="mostrarLogo"
                checked={personalizacion.mostrarLogo}
                onChange={handleChange}
                style={styles.customCheckbox}
              />
              Mostrar el logo en la página
            </label>
          </div>

          <button type="button" style={styles.customBtn} onClick={handleGuardar}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  personalizacionContainer: {
    width: "100%",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  personalizacionCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  customInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #bdc3c7",
  },
  colorInput: {
    width: "100px",
    height: "40px",
    border: "none",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1rem",
  },
  customCheckbox: {
    width: "20px",
    height: "20px",
    accentColor: "#FFC914", // Amarillo
  },
  customBtn: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    border: "none",
  },
  customBtnHover: {
    backgroundColor: "#FFDD44",
  },
};

export default PersonalizacionPanel;
