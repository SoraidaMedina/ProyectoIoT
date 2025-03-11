import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap";

function ConfiguracionDispensador() {
  const [cantidadDispensar, setCantidadDispensar] = useState("");
  const [horaDispensacion, setHoraDispensacion] = useState("");
  const [nivelAlimento, setNivelAlimento] = useState("");
  const [modoVacaciones, setModoVacaciones] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/configuracion/configuracion")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener la configuración");
        }
        return res.json();
      })
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setCantidadDispensar(data.cantidadDispensar);
          setHoraDispensacion(data.horaDispensacion);
          setNivelAlimento(data.nivelAlimento);
          setModoVacaciones(data.modoVacaciones);
        }
      })
      .catch((error) => {
        console.error("❌ Error al obtener la configuración:", error);
        setError("Error al obtener la configuración. Intenta más tarde.");
      });
  }, []);

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/configuracion/configuracion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cantidadDispensar,
          horaDispensacion,
          nivelAlimento,
          modoVacaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la configuración");
      }

      const data = await response.json();
      alert(data.mensaje);
    } catch (error) {
      console.error("❌ Error al actualizar la configuración:", error);
      alert("Error al actualizar la configuración. Intenta más tarde.");
    }
  };

  return (
    <div style={styles.fondo}>
      <Container className="py-5 mt-5">
        <Card className="p-4 shadow text-center mx-auto" style={styles.card}>
          {/* 📌 Encabezado dentro del Card */}
          <div style={styles.encabezado}>
            <h2 className="fw-bold text-center" style={styles.titulo}>
              Configuración del Dispensador
            </h2>
            <p className="text-center" style={styles.textoBlanco}>
              Actualiza la configuración del dispensador de alimento.
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card.Body>
            <Form onSubmit={handleActualizar}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="cantidadDispensar">
                    <Form.Label style={styles.textoBlanco}>Cantidad a dispensar (gramos)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={cantidadDispensar}
                      onChange={(e) => setCantidadDispensar(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="horaDispensacion">
                    <Form.Label style={styles.textoBlanco}>Hora de dispensación</Form.Label>
                    <Form.Control
                      type="time"
                      value={horaDispensacion}
                      onChange={(e) => setHoraDispensacion(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="nivelAlimento">
                    <Form.Label style={styles.textoBlanco}>Nivel de alimento (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      value={nivelAlimento}
                      onChange={(e) => setNivelAlimento(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="modoVacaciones">
                    <Form.Label style={styles.textoBlanco}>Modo vacaciones</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={modoVacaciones}
                      onChange={(e) => setModoVacaciones(e.target.checked)}
                      style={styles.textoBlanco}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="mt-3" style={styles.boton}>
                Actualizar Configuración
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

const styles = {
  fondo: {
    backgroundColor: "#fff2db", // Fondo crema
    minHeight: "100vh",
    padding: "20px 0",
  },
  card: {
    maxWidth: "600px",
    backgroundColor: "#1f2427", // Fondo gris oscuro
    color: "#ffffff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    
    borderRadius: "15px",
    border: "2px solid #00515f", // Agregado: borde visible en color #00515f
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
  input: {
    backgroundColor: "#2c3134",
    color: "#ffffff",
    border: "1px solid #444",
  },
  boton: {
    fontSize: "14px",
    padding: "8px 20px",
    backgroundColor: "#ffc914", // Fondo amarillo
    borderColor: "#00515f", // Borde azul oscuro
    color: "#000000", // Texto negro
    fontWeight: "bold",
  },
};


export default ConfiguracionDispensador;