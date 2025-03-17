import React, { useState, useEffect } from "react";

const InfoSection = () => {
  const [bienvenida, setBienvenida] = useState(null); // Nuevo estado para la bienvenida
  const [infoData, setInfoData] = useState([]); // Estado para las secciones
  const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qué sección se expande

  // Obtener datos de la API cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Datos recibidos de la API:", data);

        if (data && data.bienvenidaSeccion) {
          setBienvenida(data.bienvenidaSeccion); // Guarda la bienvenida en el estado
        }

        if (data && data.secciones && Array.isArray(data.secciones)) {
          console.log("✅ Secciones cargadas correctamente:", data.secciones);
          setInfoData(data.secciones);
        } else {
          console.warn("⚠ 'secciones' no es un array o está ausente en los datos.");
        }
      })
      .catch((error) => console.error("🚨 Error al obtener los datos:", error));
  }, []);

  // Función para alternar la visibilidad del detalle al hacer clic en "Leer Más"
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={styles.infoSection}>
      {/* 🔹 Ahora la bienvenida se consulta desde la base de datos */}
      <h2 style={styles.infoTitleMain}>
        {bienvenida ? bienvenida.titulo : "Cargando..."}
      </h2>
      <p style={styles.infoSubtitle}>
        {bienvenida ? bienvenida.descripcion : ""}
      </p>

      <div style={styles.infoContainer}>
        {infoData.length > 0 ? (
          infoData.map((item, index) => (
            <div style={styles.infoCard} key={index}>
              <div style={styles.cardContent}>
                <div style={styles.imageContainer}>
                  <img
                    src={`http://localhost:5000${item.imagen}`}
                    alt={item.nombre}
                    style={styles.infoImage}
                  />
                </div>

                <div style={styles.infoContent}>
                  <h3 style={styles.infoTitle}>{item.titulo}</h3>
                  <p style={styles.infoText}>{item.descripcion}</p>

                  {/* 🔹 Mostrar el detalle si la tarjeta está expandida */}
                  {expandedIndex === index && (
                    <div style={styles.infoDetail}>
                      <p>{item.detalle}</p>
                    </div>
                  )}

                  {/* 🔹 Botón para alternar el detalle */}
                  <button 
                    style={styles.infoButton} 
                    onClick={() => toggleExpand(index)}
                    aria-label={`Más información sobre ${item.titulo}`}
                  >
                    {expandedIndex === index ? "Leer Menos" : "Leer Más"}
                  </button>
                </div>
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

// 🎨 Estilos en línea dentro del componente
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
    background: "#1f2427",
    color: "white",
    borderRadius: "20px",
    overflow: "hidden",
    maxWidth: "900px",
    width: "100%",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    borderLeft: "5px solid rgb(17, 143, 49)", // Línea verde original
    border: "1px solid #FFD700", // Borde amarillo original
    transition: "transform 0.2s ease-in-out",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start", // Alineado al inicio para mantener la imagen fija
  },
  imageContainer: {
    width: "300px",
    minWidth: "300px", // Ancho fijo mínimo
    height: "300px", // Altura fija para mantener proporción
    overflow: "hidden",
  },
  infoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  infoContent: {
    padding: "20px",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Alineación a la izquierda
    textAlign: "left", // Texto alineado a la izquierda
    minHeight: "260px", // Altura mínima para mantener consistencia
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
  infoDetail: {
    fontSize: "14px",
    color: "#ffffff",
    marginTop: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
    maxHeight: "200px", // Altura máxima para el detalle
    overflowY: "auto", // Permite desplazamiento si el contenido es muy largo
  },
  infoButton: {
    backgroundColor: "#00df38",
    color: "black",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    alignSelf: "flex-start", // Alineado a la izquierda
  },
};

export default InfoSection;