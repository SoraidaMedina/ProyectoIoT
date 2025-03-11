import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

const Nosotros = () => {
  const [nosotros, setNosotros] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/nosotros")
      .then((response) => response.json())
      .then((data) => {
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
      <div style={styles.body}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (!nosotros || Object.keys(nosotros).length === 0) {
    return <p>No se pudo cargar la información.</p>;
  }

  return (
    <div style={styles.body}>
      <Container style={styles.tiendaContainer}>
        <div style={styles.headerNosotros}>
          <h1 style={styles.titulo}>{nosotros?.titulo || "Nosotros"}</h1>
          <p style={styles.descripcion}>
            {nosotros?.descripcion || "Información no disponible"}
          </p>
        </div>

        <section style={styles.antecedentes}>
          <div style={styles.antecedentesTexto}>
            <h2 style={styles.antecedentesTitulo}>
              {nosotros?.antecedentes?.titulo || "Antecedentes"}
            </h2>
            <p>{nosotros?.antecedentes?.descripcion1 || "Sin información"}</p>
            <p>{nosotros?.antecedentes?.descripcion2 || ""}</p>
          </div>
          {nosotros?.antecedentes?.imagen && (
            <img
              src={`http://localhost:5000${nosotros.antecedentes.imagen}`}
              alt="Antecedentes"
              style={styles.antecedentesImagen}
              onLoad={() => console.log("Imagen cargada")}
              onError={() => console.error("Error al cargar la imagen")}
            />
          )}
        </section>

        <section style={styles.quienesSomos}>
          <Row>
            <Col md={6}>
              <h2 style={styles.quienesSomosTitulo}>
                {nosotros?.quienesSomos?.titulo || "¿Quiénes Somos?"}
              </h2>
              <p>{nosotros?.quienesSomos?.descripcion || "Descripción no disponible"}</p>
            </Col>
            <Col md={6}>
              {nosotros?.quienesSomos?.imagen && (
                <img
                  src={`http://localhost:5000${nosotros.quienesSomos.imagen}`}
                  alt="Nuestro Equipo"
                  style={styles.equipoImg}
                />
              )}
            </Col>
          </Row>
        </section>

        <Row className="mt-4">
          <Col md={4}>
            <Card style={styles.infoCard}>
              <Card.Body>
                <Card.Title style={styles.infoCardTitle}>
                  🎯 {nosotros?.mision?.titulo || "Misión"}
                </Card.Title>
                <Card.Text style={styles.infoCardText}>
                  {nosotros?.mision?.descripcion || "Información no disponible"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card style={styles.infoCard}>
              <Card.Body>
                <Card.Title style={styles.infoCardTitle}>
                  🚀 {nosotros?.vision?.titulo || "Visión"}
                </Card.Title>
                <Card.Text style={styles.infoCardText}>
                  {nosotros?.vision?.descripcion || "Información no disponible"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card style={styles.infoCard}>
              <Card.Body>
                <Card.Title style={styles.infoCardTitle}>💡 Valores</Card.Title>
                <ul style={styles.valoresList}>
                  {nosotros?.valores?.map((valor, index) => (
                    <li key={index}>
                      <strong>{valor.titulo}:</strong> {valor.descripcion}
                    </li>
                  )) || <p>Sin valores definidos</p>}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Estilos CSS en línea dentro del componente
const styles = {
  body: {
    backgroundColor: "#FFF2DB", // Fondo claro
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tiendaContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "40px auto",
    backgroundColor: "#FFF2DB", // Fondo claro
    padding: "40px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid #2c3e50", // Borde oscuro
  },
  titulo: {
    textAlign: "center",
    color: "#2c3e50", // Amarillo dorado
    fontWeight: "bold",
    marginTop: "20px",
    fontSize: "2.5rem",
  },
  descripcion: {
    fontSize: "20px",
    textAlign: "center",
    color: "black", // Color negro para las descripciones
    marginBottom: "30px",
  },
  antecedentes: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1f2427", // Fondo oscuro
    padding: "30px",
    borderRadius: "12px", // Bordes redondeados
    marginTop: "30px",
    border: "3px solid #00515f", // Borde azul oscuro
  },
  antecedentesTexto: {
    width: "50%",
    paddingRight: "30px",
    color: "#ffffff", // Color de texto blanco
  },
  antecedentesTitulo: {
    color: "#FFc914", // Color naranja para el título de Antecedentes
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "20px",
  },
  antecedentesImagen: {
    width: "50%",
    maxWidth: "400px",
    borderRadius: "12px", // Bordes redondeados para la imagen
    objectFit: "cover",
  },
  quienesSomos: {
    backgroundColor: "#1f2427", // Fondo oscuro
    padding: "30px",
    marginTop: "30px",
    borderLeft: "6px solid #FFD700", // Borde amarillo
    borderRadius: "10px",
    marginBottom: "30px",
    color: "#ffffff", // Texto blanco
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", // Sombra
    border: "3px solid #00515f", // Borde azul oscuro
  },
  quienesSomosTitulo: {
    color: "#FFc914", // Color naranja para el título de Quiénes Somos
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "20px",
  },
  equipoImg: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "12px", // Bordes redondeados
  },
  infoCard: {
    backgroundColor: "#1f2427", // Fondo oscuro
    borderLeft: "6px solid #FFD700", // Borde amarillo
    borderRadius: "12px", // Bordes redondeados
    marginBottom: "30px",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.3s ease-in-out", // Efecto hover
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    border: "1px solid #FFD700", // Borde amarillo
  },
  infoCardTitle: {
    color: "#FFD700", // Título en dorado
    fontSize: "1.4rem", // Tamaño de fuente más grande
  },
  infoCardText: {
    color: "#ffffff", // Texto blanco
    fontSize: "1rem",
  },
  valoresList: {
    color: "#ffffff", // Texto blanco para la lista de valores
    paddingLeft: "20px",
  },
  infoCardHover: {
    transform: "scale(1.05)", // Aumentar tamaño en hover
  },
};

export default Nosotros;