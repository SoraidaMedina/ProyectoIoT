import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

function Hero() {
  const [inicio, setInicio] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Array de imágenes para el carrusel
  const backgroundImages = [
    '6663.jpg',
    '15.avif',
    '1.avif'
  ];

  // Manejar la transición de imágenes cada 2 segundos
  useEffect(() => {
    const transitionInterval = setInterval(() => {
      // Iniciar transición
      setIsTransitioning(true);
      
      // Establecer el índice de la siguiente imagen
      setNextImageIndex((currentImageIndex + 1) % backgroundImages.length);
      
      // Después de la animación, actualizar la imagen actual
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setIsTransitioning(false);
      }, 2000); // La animación dura 1 segundo
      
    }, 2000); // Cambiar cada 2 segundos

    return () => clearInterval(transitionInterval);
  }, [currentImageIndex, nextImageIndex]);

  // Función para cambiar manualmente la imagen
  const changeSlide = (index) => {
    if (isTransitioning) return;
    setNextImageIndex(index);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 2000);
  };

  // Función para obtener los datos de la API
  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Datos recibidos en Hero:", data);
      
        if (data && data.bannerPrincipal) {
          setInicio(data);
        } else {
          console.warn("⚠ No se encontraron datos para `bannerPrincipal` en la API.");
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);
  
  return (
    <div style={styles.heroSection}>
      {/* Capas de imágenes de fondo con animaciones avanzadas */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index} 
          style={{
            ...styles.backgroundLayer,
            backgroundImage: `url('${image}')`,
            opacity: index === currentImageIndex ? (isTransitioning ? 0 : 1) : 
                    index === nextImageIndex && isTransitioning ? 1 : 0,
            transform: index === currentImageIndex ? 
                       (isTransitioning ? 'scale(1.1)' : 'scale(1)') : 
                       index === nextImageIndex && isTransitioning ? 'scale(1)' : 'scale(1.1)',
            filter: index === currentImageIndex ? 
                    (isTransitioning ? 'brightness(0.7)' : 'brightness(1)') : 
                    index === nextImageIndex && isTransitioning ? 'brightness(1)' : 'brightness(0.7)',
          }}
        />
      ))}
      
      {/* Overlay para mejorar la legibilidad */}
      <div style={styles.overlay}></div>
      
      {/* Indicadores del carrusel */}
      <div style={styles.carouselIndicators}>
        {backgroundImages.map((_, index) => (
          <span 
            key={index} 
            style={{
              ...styles.indicator,
              backgroundColor: index === currentImageIndex ? '#f8d210' : 'rgba(255, 255, 255, 0.5)',
              width: index === currentImageIndex ? '30px' : '12px'
            }}
            onClick={() => changeSlide(index)}
          />
        ))}
      </div>

      

      <Container style={styles.contentContainer}>
        {inicio ? (
          <>
            <h1 style={styles.heroTitle}>{inicio.bannerPrincipal.titulo}</h1>
            <p style={styles.heroSubtitle}>{inicio.bannerPrincipal.descripcion}</p>
            <Button variant="warning" size="lg" style={styles.heroButton}>
              {inicio.bannerPrincipal.botonTexto}
            </Button>
          </>
        ) : (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Cargando...</p>
          </div>
        )}
      </Container>
    </div>
  );
}

// Estilos mejorados con efectos de animación avanzados
const styles = {
  heroSection: {
    position: "relative",
    color: "#00879E",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "85vh",
    overflow: "hidden",
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    transition: "opacity 1s cubic-bezier(0.645, 0.045, 0.355, 1), transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1s ease",
    zIndex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
    zIndex: 2,
  },
  contentContainer: {
    position: "relative", 
    zIndex: 3,
    padding: "25px",
    background: "rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    transition: "transform 0.4s ease, opacity 0.4s ease",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#f8d210",
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontSize: "1.7rem",
    color: "#bdbaba",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.9)",
    maxWidth: "600px",
    margin: "0 auto 25px auto",
  },
  heroButton: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  carouselIndicators: {
    position: "absolute",
    bottom: "20px",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "10px",
  },
  indicator: {
    height: "6px",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(0, 0, 0, 0.3)",
    color: "white",
    border: "none",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.3s ease",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTop: "4px solid #f8d210",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default Hero;