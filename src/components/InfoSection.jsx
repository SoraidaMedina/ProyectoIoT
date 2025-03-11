import React, { useState, useEffect } from "react";

const InfoSection = () => {
  const [infoData, setInfoData] = useState([]);

  // Obtener datos de la API cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Datos recibidos de la API:", data);
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠ No se encontraron datos en la API.");
          return;
        }
  
        // Verificar si el primer objeto tiene la clave 'secciones' y si es un array
        const secciones = data[0]?.secciones;
        if (!secciones || !Array.isArray(secciones)) {
          console.error("❌ 'secciones' no es un array o está ausente en los datos.");
          return;
        }
  
        console.log("✅ Secciones recibidas:", secciones);
        setInfoData(secciones);
      })
      .catch((error) => console.error("🚨 Error al obtener los datos:", error));
  }, []);
  

  return (
    <div style={styles.infoSection}>
      <h2 style={styles.infoTitleMain}>Bienvenido a Sabor y Huellita</h2>
      <p style={styles.infoSubtitle}>
        La mejor solución para el bienestar de tu mascota.
      </p>

      <div style={styles.infoContainer}>
        {infoData.length > 0 ? (
          infoData.map((item, index) => (
            <div style={styles.infoCard} key={index}>
              <img
                src={`http://localhost:5000${item.imagen}`}
                alt={item.nombre}
                style={styles.infoImage}
              />

              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>{item.titulo}</h3>
                <p style={styles.infoText}>{item.descripcion}</p>
                <button style={styles.infoButton} aria-label={`Más información sobre ${item.titulo}`}>
                  Leer Más
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Cargando información...</p>
        )}
      </div>
    </div>
  );
};

// Estilos en línea dentro del componente
const styles = {
  infoSection: {
    backgroundColor: "#fff2db",
    color: "rgb(3, 3, 3)",
    textAlign: "center",
    padding: "50px 20px",
    position: "relative",
  },
  infoTitleMain: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "rgb(0, 0, 0)",
    marginBottom: "10px",
  },
  infoSubtitle: {
    fontSize: "18px",
    color: "#003092",
    marginBottom: "30px",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  infoCard: {
    display: "flex",
    background: "#1f2427",
    color: "white",
    borderRadius: "20px", // Redondeado para que se vea más suave
    overflow: "hidden",
    maxWidth: "900px",
    width: "100%",
    alignItems: "center",
    textAlign: "left",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    borderLeft: "5px solid rgb(17, 143, 49)", // Línea verde
    border: "1px solid #FFD700", // Borde amarillo
    transition: "transform 0.2s ease-in-out",
  },
  infoImage: {
    width: "300px",
    height: "auto",
    objectFit: "cover",
  },
  infoContent: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  infoTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  infoText: {
    fontSize: "16px",
    color: "#ffffff",
  },
  infoButton: {
    backgroundColor: "#00df38",
    color: "black",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
};

export default InfoSection;
