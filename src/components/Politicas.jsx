import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap"; 
import { FaShieldAlt, FaUndo, FaBookOpen, FaLock, FaTruck, FaHeadset } from "react-icons/fa"; 

const styles = {
  politicasPage: {
    background: "linear-gradient(to bottom, #3d3d3d, #111)", 
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px",
  },
  politicasContainer: {
    width: "90%",
    maxWidth: "1000px",
    backgroundColor: "#d9d9d9",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease-in-out",
  },
  titulo: {
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "2.5rem",
    textTransform: "uppercase",
  },
  descripcion: {
    fontSize: "18px",
    textAlign: "center",
    color: "#444",
    marginBottom: "20px",
    fontWeight: "500",
  },
  politicaCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    transition: "all 0.3s ease-in-out",
    textAlign: "center",
    borderLeft: "5px solid #f4a100",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
  },
  politicaCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)",
    borderLeft: "8px solid #f4a100",
  },
  politicaIcon: {
    fontSize: "50px",
    color: "#f4a100",
    display: "block",
    marginBottom: "10px",
    transition: "transform 0.3s ease-in-out",
  },
  politicaCardTitle: {
    color: "#2c3e50",
    fontWeight: "bold",
    fontSize: "22px",
    marginBottom: "10px",
  },
  politicaCardText: {
    color: "#444",
    fontSize: "16px",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  btnPoliticas: {
    display: "inline-block",
    padding: "14px 30px",
    background: "#f4a100",
    color: "black",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
    fontWeight: "bold",
    fontSize: "16px",
    textTransform: "uppercase",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    border: "none",
    cursor: "pointer",
  },
};

const Politicas = () => {
  return (
    <div style={styles.politicasPage}>
      <Container style={styles.politicasContainer}>
        <h1 style={styles.titulo}>Nuestras Políticas</h1>
        <p style={styles.descripcion}>
          En <strong>Sabor y Huellitas</strong>, nos comprometemos con la transparencia y la satisfacción de nuestros clientes.  
          Aquí puedes conocer nuestras políticas sobre privacidad, devoluciones y más.
        </p>

        {/* 📌 Sección de políticas con íconos y mejor distribución */}
        <Row className="mt-4">
          <Col md={6}>
            <Card style={styles.politicaCard}>
              <Card.Body>
                <FaShieldAlt style={styles.politicaIcon} />
                <Card.Title style={styles.politicaCardTitle}>Política de Privacidad</Card.Title>
                <Card.Text style={styles.politicaCardText}>
                  Respetamos la privacidad de nuestros clientes. La información proporcionada será utilizada únicamente para procesar pedidos 
                  y mejorar nuestros servicios.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card style={styles.politicaCard}>
              <Card.Body>
                <FaUndo style={styles.politicaIcon} />
                <Card.Title style={styles.politicaCardTitle}>Política de Devoluciones</Card.Title>
                <Card.Text style={styles.politicaCardText}>
                  Si no estás satisfecho con tu compra, aceptamos devoluciones dentro de los 30 días posteriores a la compra.  
                  El producto debe estar en su empaque original y sin daños.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card style={styles.politicaCard}>
              <Card.Body>
                <FaBookOpen style={styles.politicaIcon} />
                <Card.Title style={styles.politicaCardTitle}>Condiciones de Uso</Card.Title>
                <Card.Text style={styles.politicaCardText}>
                  Al utilizar nuestra plataforma, aceptas nuestras políticas y condiciones de uso. Nos reservamos el derecho de modificar estos términos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card style={styles.politicaCard}>
              <Card.Body>
                <FaLock style={styles.politicaIcon} />
                <Card.Title style={styles.politicaCardTitle}>Métodos de Pago y Seguridad</Card.Title>
                <Card.Text style={styles.politicaCardText}>
                  Aceptamos pagos con tarjeta de crédito, débito y PayPal. Todos los pagos están protegidos con encriptación SSL para tu seguridad.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="politicas-footer text-center mt-4">
          <a href="/" style={styles.btnPoliticas}>Regresar al Inicio</a>
        </div>
      </Container>
    </div>
  );
};

export default Politicas;
