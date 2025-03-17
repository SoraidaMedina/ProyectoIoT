import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

function Hero() {
  const [inicio, setInicio] = useState(null);

  // Función para obtener los datos de la API
  useEffect(() => {
    fetch("http://localhost:5000/api/inicio") // Llama a tu API
      .then((response) => response.json()) // Convierte la respuesta a JSON
      .then((data) => {
        if (data.length > 0) {
          setInicio(data[0]); // Guarda el primer objeto en el estado
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  return (
    <div style={styles.heroSection}>
      <Container>
        {inicio ? (
          <>
            <h1 style={styles.heroTitle}>{inicio.bannerPrincipal.titulo}</h1>
            <p style={styles.heroSubtitle}>{inicio.bannerPrincipal.descripcion}</p>
            <Button variant="warning" size="lg">
              {inicio.bannerPrincipal.botonTexto}
            </Button>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </Container>
    </div>
  );
}

// 🔹 Estilos dentro del componente
const styles = {
  heroSection: {
    position: "relative",
    color: "#00879E",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "85vh",
    backgroundImage: "url('6663.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#f8d210", // Amarillo fuerte
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
  },
  heroSubtitle: {
    fontSize: "1.7rem",
    color: "#bdbaba",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.9)",
    maxWidth: "600px",
    margin: "0 auto",
  },
};

export default Hero;
