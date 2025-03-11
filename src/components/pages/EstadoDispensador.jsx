import React from "react";
import Dispensador from "../pages/Dispensador";
import NivelAlimento from "../pages/NivelAlimento";
import SensorPeso from "../pages/SensorPeso";
import { Container, Card, Alert } from "react-bootstrap";

const EstadoDispensador = () => {
  const [nivelAlimento, setNivelAlimento] = React.useState("🟢 Alimento Suficiente");

  const styles = {
    fondo: {
      backgroundColor: "#fff2db", // Fondo crema
      minHeight: "100vh",
      padding: "20px 0",
    },
    card: {
      maxWidth: "800px",
      backgroundColor: "#1f2427", // Fondo gris oscuro
      color: "#ffffff",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "15px",
      border: "2px solid #00515f", // Borde visible en color #00515f
    },
    encabezado: {
      backgroundColor: "#1f2427", // Gris oscuro dentro del Card
      padding: "10px 0",
      borderRadius: "10px",
    },
    titulo: {
      color: "#FFC914", // Amarillo para destacar
      fontWeight: "bold",
      marginBottom: "5px",
    },
    textoBlanco: {
      color: "#ffffff", // Texto blanco dentro del Card
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.fondo}>
      <Container className="py-5 mt-5">
        <Card className="p-4 shadow text-center mx-auto" style={styles.card}>
          {/* 📌 Encabezado dentro del Card */}
          <div style={styles.encabezado}>
            <h2 className="fw-bold text-center" style={styles.titulo}>
              Estado del Dispensador
            </h2>
            <p className="text-center" style={styles.textoBlanco}>
              Verifica el estado actual del dispensador de alimento.
            </p>
          </div>

          <Card.Body>
            <Dispensador setNivelAlimento={setNivelAlimento} />
            <NivelAlimento nivelAlimento={nivelAlimento} />
            <SensorPeso />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EstadoDispensador;