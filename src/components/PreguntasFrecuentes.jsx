import React, { useEffect, useState } from "react";
import { Accordion, Container, Spinner } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";

const PreguntasFrecuentes = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/preguntas")
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener las preguntas:", error);
        setCargando(false);
      });
  }, []);

  return (
    <div style={styles.faqPage}>
      <Container style={styles.faqContainer}>
        <h1 style={styles.title}>
          <FaQuestionCircle style={styles.faqIcon} /> Preguntas Frecuentes
        </h1>
        <p style={styles.descripcion}>
          Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
        </p>

        {cargando ? (
          // Skeleton Loader o Spinner para evitar el vacío inicial
          <div style={styles.spinnerContainer}>
            <Spinner animation="border" variant="light" />
            <p style={styles.loadingText}>Cargando preguntas...</p>
          </div>
        ) : (
          <Accordion>
            {preguntas.map((pregunta, index) => (
              <Accordion.Item eventKey={index.toString()} key={index} style={styles.accordionItem}>
                <Accordion.Header>
                  {pregunta.icono} {pregunta.pregunta}
                </Accordion.Header>
                <Accordion.Body style={styles.accordionBody}>
                  {pregunta.respuesta}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Container>
    </div>
  );
};

const styles = {
  faqPage: {
    backgroundColor: "#fff2db",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px",
  },
  faqContainer: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#1f2427",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    minHeight: "300px", // Asegura que no se vea el footer antes del contenido
  },
  title: {
    textAlign: "center",
    color: "#ffc914",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "2.5rem",
  },
  faqIcon: {
    color: "#00df38",
    marginRight: "10px",
  },
  descripcion: {
    fontSize: "1.2rem",
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  accordionBody: {
    fontSize: "16px",
    color: "black",
    backgroundColor: "#fff2db",
    borderRadius: "5px",
    padding: "10px",
    lineHeight: "1.6",
  },
  accordionItem: {
    border: "2px solid #2c3e50",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  spinnerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#ffc914",
    marginTop: "10px",
  },
};

export default PreguntasFrecuentes;