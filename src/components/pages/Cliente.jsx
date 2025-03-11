import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Cliente() {
  const navigate = useNavigate();

  return (
    <div style={styles.fondo}>
      <Container className="py-5">
        <h2 style={styles.titulo}>Bienvenido a tu Panel de Cliente</h2>
        <p style={styles.textoCentrado}>
          Administra tu cuenta, revisa el estado de tu dispensador y accede a tus pedidos recientes.
        </p>

        {/* Primera fila de tarjetas */}
        <Row className="mt-4 justify-content-center">
          <Col md={5} className="mb-4">
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.cardTitle}>Monitoreo del Dispensador</Card.Title>
                <Card.Text>
                  Última dispensación: <strong>Hoy a las 12:30 PM</strong>
                  <br />
                  Comida restante: <strong>70%</strong>
                </Card.Text>
                <Button
                  variant="success"
                  style={styles.boton}
                  onClick={() => navigate("/estado-dispensador")}
                >
                  Ver detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} className="mb-4">
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.cardTitle}>Perfil de tu Mascota</Card.Title>
                <Card.Text>
                  🐶 Nombre: <strong>Max</strong>
                  <br />
                  Edad: <strong>3 años</strong>
                  <br />
                  Raza: <strong>Labrador</strong>
                </Card.Text>
                <Button
                  variant="primary"
                  style={styles.boton}
                  onClick={() => navigate("/perfil-mascota")}
                >
                  Actualizar Información
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Segunda fila de tarjetas */}
        <Row className="mt-4 justify-content-center">
          <Col md={5} className="mb-4">
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.cardTitle}>Control de Dispensador</Card.Title>
                <Card.Text>Ajusta horarios y cantidad de comida dispensada.</Card.Text>
                <Button
                  variant="warning"
                  style={styles.boton}
                  onClick={() => navigate("/configuracion-dispensador")}
                >
                  Configurar
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} className="mb-4">
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.cardTitle}>Soporte y Ayuda</Card.Title>
                <Card.Text>¿Tienes dudas? Contacta con nuestro equipo de soporte.</Card.Text>
                <Button
                  variant="danger"
                  style={styles.boton}
                  onClick={() => navigate("/soporte-ayuda")}
                >
                  Contactar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// *🎨 Estilos actualizados*
const styles = {
  fondo: {
    backgroundColor: "#fff2db",
    minHeight: "100vh",
    padding: "20px 0",
  },
  titulo: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "40px",
  },
  textoCentrado: {
    textAlign: "center",
  },
  card: {
    padding: "20px",
    minHeight: "280px", // Tarjetas más largas
    backgroundColor: "#1f2427",
    color: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    border: "2px solid #00515f",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#FFC914", // Amarillo para los títulos
    fontWeight: "bold",
    fontSize: "20px",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    flexGrow: 1,
  },
  boton: {
    width: "200px", // Tamaño fijo
    height: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
  },
};

export default Cliente;