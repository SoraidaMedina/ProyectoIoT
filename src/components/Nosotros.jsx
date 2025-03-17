import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

const Nosotros = () => {
  const [nosotros, setNosotros] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/nosotros/configuracion")
      .then((response) => response.json())
      .then((data) => {
        console.log("📢 Datos recibidos en el frontend:", data);
        setNosotros(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener los datos:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loaderWrapper}>
          <div style={styles.customSpinner}>
            <div style={styles.spinnerDot}></div>
            <div style={styles.spinnerDot}></div>
            <div style={styles.spinnerDot}></div>
          </div>
          <p style={styles.loadingText}>Descubriendo nuestra historia...</p>
        </div>
      </div>
    );
  }

  if (!nosotros) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <p style={styles.errorMessage}>No se pudo cargar la información.</p>
          <button style={styles.retryButton}>Intentar nuevamente</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* HEADER CON ANIMACIÓN DE GRADIENTE */}
      <div style={styles.animatedHeader}>
        <div style={styles.headerGradient}></div>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>{nosotros.titulo || "Nosotros"}</h1>
          <p style={styles.mainDescription}>{nosotros.descripcion || "Información no disponible"}</p>
        </div>
        <div style={styles.headerWave}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,170.7C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <Container style={styles.mainContainer}>
        {/* SECCIÓN ANTECEDENTES */}
        <div style={styles.sectionContainer}>
          <div style={styles.glassCard}>
            <Row className="align-items-center">
              <Col lg={6} className="px-4">
                <div style={styles.sectionTitle}>
                  <div style={styles.titleLine}></div>
                  <h2 style={styles.sectionHeading}>{nosotros.antecedentes?.titulo || "Antecedentes"}</h2>
                </div>
                <div style={styles.contentBox}>
                  <p style={styles.paragraph}>{nosotros.antecedentes?.descripcion1 || "Sin información"}</p>
                  <p style={styles.paragraph}>{nosotros.antecedentes?.descripcion2 || ""}</p>
                </div>
              </Col>
              <Col lg={6} className="p-0">
                {nosotros.antecedentes?.imagen && (
                  <div style={styles.imageMask}>
                    <img 
                      src={`http://localhost:5000${nosotros.antecedentes.imagen}`} 
                      alt="Antecedentes" 
                      style={styles.featureImage} 
                    />
                    <div style={styles.imageShine}></div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>

        {/* SEPARADOR ANIMADO */}
        <div style={styles.separator}>
          <div style={styles.separatorLine}></div>
          <div style={styles.separatorDot}></div>
          <div style={styles.separatorLine}></div>
        </div>

        {/* SECCIÓN QUIÉNES SOMOS */}
        <div style={styles.sectionContainer}>
          <div style={styles.glassCard}>
            <Row className="align-items-center flex-column-reverse flex-lg-row">
              <Col lg={6} className="p-0">
                {nosotros.quienesSomos?.imagen && (
                  <div style={styles.imageMask}>
                    <img 
                      src={`http://localhost:5000${nosotros.quienesSomos.imagen}`} 
                      alt="Quiénes Somos" 
                      style={styles.featureImage} 
                    />
                    <div style={styles.imageShine}></div>
                  </div>
                )}
              </Col>
              <Col lg={6} className="px-4">
                <div style={styles.sectionTitle}>
                  <div style={styles.titleLine}></div>
                  <h2 style={styles.sectionHeading}>{nosotros.quienesSomos?.titulo || "¿Quiénes Somos?"}</h2>
                </div>
                <div style={styles.contentBox}>
                  <p style={styles.paragraph}>{nosotros.quienesSomos?.descripcion || "Descripción no disponible"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* TÍTULO FUNDAMENTOS */}
        <div style={styles.bigTitle}>
          <h2 style={styles.bigTitleText}>Nuestros Fundamentos</h2>
        </div>

        {/* TARJETAS DE MISIÓN, VISIÓN Y VALORES */}
        <Row className="g-4">
          {/* MISIÓN */}
          <Col md={4}>
            <div style={styles.cardContainer}>
              <div style={styles.cardShadow}></div>
              <div style={styles.card}>
                <div style={styles.cardInner}>
                  <div style={styles.cardIconWrap}>
                    <i className="fas fa-bullseye" style={styles.cardIcon}></i>
                  </div>
                  <div style={styles.cardBorder}></div>
                  <h3 style={styles.cardTitle}>{nosotros.mision?.titulo || "Misión"}</h3>
                  <p style={styles.cardText}>{nosotros.mision?.descripcion || "Información no disponible"}</p>
                </div>
              </div>
            </div>
          </Col>

          {/* VISIÓN */}
          <Col md={4}>
            <div style={styles.cardContainer}>
              <div style={styles.cardShadow}></div>
              <div style={{...styles.card, animationDelay: "0.2s"}}>
                <div style={styles.cardInner}>
                  <div style={styles.cardIconWrap}>
                    <i className="fas fa-eye" style={styles.cardIcon}></i>
                  </div>
                  <div style={styles.cardBorder}></div>
                  <h3 style={styles.cardTitle}>{nosotros.vision?.titulo || "Visión"}</h3>
                  <p style={styles.cardText}>{nosotros.vision?.descripcion || "Información no disponible"}</p>
                </div>
              </div>
            </div>
          </Col>

          {/* VALORES */}
          <Col md={4}>
            <div style={styles.cardContainer}>
              <div style={styles.cardShadow}></div>
              <div style={{...styles.card, animationDelay: "0.4s"}}>
                <div style={styles.cardInner}>
                  <div style={styles.cardIconWrap}>
                    <i className="fas fa-gem" style={styles.cardIcon}></i>
                  </div>
                  <div style={styles.cardBorder}></div>
                  <h3 style={styles.cardTitle}>Valores</h3>
                  <ul style={styles.valuesList}>
                    {nosotros.valores?.map((valor, index) => (
                      <li key={index} style={styles.valuesItem}>
                        <span style={styles.valueBullet}>•</span>
                        <span style={styles.valueTitle}>{valor.titulo}:</span> {valor.descripcion}
                      </li>
                    )) || <li>Sin valores definidos</li>}
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* FOOTER DECORATIVO */}
      <div style={styles.footerDecoration}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#1F2427" fillOpacity="1" d="M0,224L60,229.3C120,235,240,245,360,234.7C480,224,600,192,720,197.3C840,203,960,245,1080,261.3C1200,277,1320,267,1380,261.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

  // Estilos avanzados con efectos impactantes
const styles = {
  pageWrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif", // Mantenemos la fuente original
  },

  // HEADER ANIMADO
  animatedHeader: {
    position: "relative",
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(-45deg, #1F2427, #2c3e50, #1a1a2e, #16213e)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
    zIndex: 0,
  },
  headerContent: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "0 20px",
    maxWidth: "800px",
  },
  mainTitle: {
    fontSize: "5rem",
    fontWeight: "900",
    color: "transparent",
    backgroundImage: "linear-gradient(45deg, #FFD700, #FFC107, #FFD700)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 5px 15px rgba(255, 215, 0, 0.3)",
    marginBottom: "30px",
    letterSpacing: "2px",
    position: "relative",
    display: "inline-block",
  },
  mainDescription: {
    fontSize: "1.4rem",
    lineHeight: "1.8",
    color: "#ffffff",
    fontWeight: "300",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerWave: {
    position: "absolute",
    bottom: "-1px",
    left: 0,
    width: "100%",
    zIndex: 2,
  },

  // CONTENEDOR PRINCIPAL
  mainContainer: {
    position: "relative",
    zIndex: 3,
    marginTop: "-60px",
    marginBottom: "80px",
  },

  // SECCIONES CON EFECTO VIDRIO
  sectionContainer: {
    marginBottom: "60px",
  },
  glassCard: {
    backgroundColor: "#1F2427",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    border: "1px solid rgba(31, 36, 39, 0.6)",
    position: "relative",
    color: "#FFFFFF",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
    paddingTop: "30px",
  },
  titleLine: {
    width: "40px",
    height: "4px",
    backgroundColor: "#FFD700",
    marginRight: "15px",
    borderRadius: "2px",
  },
  sectionHeading: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#FFD700",
    margin: 0,
    position: "relative",
  },
  contentBox: {
    padding: "0 0 30px",
  },
  paragraph: {
    fontSize: "1.1rem",
    color: "#E0E0E0",
    lineHeight: "1.9",
    marginBottom: "20px",
  },

  // IMÁGENES CON MÁSCARA
  imageMask: {
    position: "relative",
    height: "100%",
    minHeight: "350px",
    overflow: "hidden",
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
  },
  featureImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    transition: "transform 0.8s ease",
  },
  imageShine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
    zIndex: 1,
  },

  // SEPARADOR ANIMADO
  separator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto 60px",
    maxWidth: "300px",
  },
  separatorLine: {
    flex: 1,
    height: "2px",
    background: "linear-gradient(90deg, rgba(31,36,39,0.1), rgba(31,36,39,0.6), rgba(31,36,39,0.1))",
  },
  separatorDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#FFD700",
    margin: "0 15px",
    boxShadow: "0 0 10px #FFD700",
    animation: "pulseDot 2s infinite",
  },

  // TÍTULO GRANDE
  bigTitle: {
    textAlign: "center",
    margin: "60px 0 50px",
    position: "relative",
  },
  bigTitleText: {
    fontSize: "3.5rem",
    fontWeight: "900",
    color: "#FFD700",
    display: "inline-block",
    position: "relative",
    paddingBottom: "15px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },

  // CARDS 3D
  cardContainer: {
    position: "relative",
    perspective: "1500px",
    marginBottom: "30px",
    height: "100%",
  },
  cardShadow: {
    position: "absolute",
    top: "5%",
    left: "5%",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "20px",
    filter: "blur(15px)",
    transform: "translateZ(-50px)",
    zIndex: 0,
  },
  card: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "420px",
    backgroundColor: "#1F2427",
    borderRadius: "20px",
    color: "#fff",
    zIndex: 1,
    transformStyle: "preserve-3d",
    transform: "translateZ(0)",
    transition: "transform 0.5s ease",
    animation: "floatCard 6s ease-in-out infinite",
  },
  cardInner: {
    position: "relative",
    padding: "40px 25px 30px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
  },
  cardIconWrap: {
    width: "90px",
    height: "90px",
    margin: "0 auto 30px",
    background: "linear-gradient(145deg, #232A2E, #1a2024)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "8px 8px 16px rgba(0,0,0,0.3), -8px -8px 16px rgba(255,255,255,0.05)",
    position: "relative",
  },
  cardIcon: {
    fontSize: "2.8rem",
    color: "#FFD700",
    textShadow: "0 0 10px rgba(255,215,0,0.5)",
  },
  cardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "20px",
    border: "2px solid transparent",
    background: "linear-gradient(145deg, rgba(255,215,0,0.3), rgba(255,215,0,0.1)) border-box",
    WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "destination-out",
    maskComposite: "exclude",
    animation: "borderGlow 3s linear infinite",
    zIndex: -1,
  },
  cardTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: "20px",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  cardText: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#e0e0e0",
    textAlign: "center",
    fontWeight: "300",
    flex: 1,
  },

  // LISTA DE VALORES
  valuesList: {
    padding: 0,
    margin: 0,
    listStyle: "none",
    textAlign: "left",
  },
  valuesItem: {
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#e0e0e0",
    display: "flex",
  },
  valueBullet: {
    color: "#FFD700",
    fontSize: "1.5rem",
    lineHeight: "1rem",
    marginRight: "10px",
  },
  valueTitle: {
    color: "#FFD700",
    fontWeight: "600",
    marginRight: "5px",
  },

  // LOADER PERSONALIZADO
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(-45deg, #1F2427, #2c3e50, #1a1a2e, #16213e)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  customSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "120px",
    height: "40px",
  },
  spinnerDot: {
    width: "20px",
    height: "20px",
    margin: "0 10px",
    borderRadius: "50%",
    backgroundColor: "#FFD700",
    animation: "dotPulse 1.5s ease-in-out infinite",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: "1.4rem",
    marginTop: "30px",
    fontWeight: "300",
    letterSpacing: "1px",
  },

  // ERROR
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(-45deg, #1F2427, #2c3e50, #1a1a2e, #16213e)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
  },
  errorBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    maxWidth: "400px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  errorIcon: {
    fontSize: "4.5rem",
    color: "#FF6B6B",
    marginBottom: "20px",
    animation: "pulse 2s infinite",
  },
  errorMessage: {
    fontSize: "1.5rem",
    color: "#ffffff",
    marginBottom: "30px",
  },
  retryButton: {
    padding: "15px 40px",
    backgroundColor: "#FFD700",
    color: "#1F2427",
    border: "none",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px rgba(255,215,0,0.3)",
    position: "relative",
    overflow: "hidden",
  },

  // FOOTER
  footerDecoration: {
    position: "relative",
    marginTop: "80px",
  },

  // ANIMACIONES EN CSS ESTILO INLINE
  // Estas animaciones deben ser agregadas usando un tag <style> en el componente o en un archivo CSS separado
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  '@keyframes floatCard': {
    '0%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-15px)' },
    '100%': { transform: 'translateY(0)' },
  },
  '@keyframes pulseDot': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.5)', opacity: 0.5 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  '@keyframes dotPulse': {
    '0%': { transform: 'scale(0)', opacity: 0.5 },
    '50%': { transform: 'scale(1)', opacity: 1 },
    '100%': { transform: 'scale(0)', opacity: 0.5 },
  },
  '@keyframes borderGlow': {
    '0%': { borderColor: 'rgba(255,215,0,0.3)' },
    '50%': { borderColor: 'rgba(255,215,0,0.7)' },
    '100%': { borderColor: 'rgba(255,215,0,0.3)' },
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
};

export default Nosotros;