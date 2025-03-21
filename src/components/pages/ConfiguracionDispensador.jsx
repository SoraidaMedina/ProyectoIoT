import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { client, TOPICS } from "../../mqttConfig";

function ConfiguracionDispensador() {
  const [cantidadDispensar, setCantidadDispensar] = useState("100");
  const [horaDispensacion, setHoraDispensacion] = useState("08:00");
  const [modoVacaciones, setModoVacaciones] = useState(false);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    // Cargar configuración actual
    fetch("/api/dispensador/configuracion")
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
    setError("");
    setMensajeExito("");
    
    try {
      const response = await fetch("/api/dispensador/configuracion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cantidadDispensar,
          horaDispensacion,
          modoVacaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la configuración");
      }

      const data = await response.json();
      setMensajeExito(data.mensaje || "Configuración actualizada con éxito");
      
      // Publicar configuración a MQTT (opcional)
      const configMqtt = JSON.stringify({
        cantidadDispensar,
        horaDispensacion,
        modoVacaciones
      });
      client.publish("dispensador/config", configMqtt);
      
    } catch (error) {
      console.error("❌ Error al actualizar la configuración:", error);
      setError("Error al actualizar la configuración. Intenta más tarde.");
    }
  };

  // Función para realizar una dispensación de prueba
  const dispensarPrueba = () => {
    // Publicar mensaje a MQTT
    client.publish(TOPICS.DISPENSADOR, "20", { qos: 0, retain: false });
    setMensajeExito("Dispensación de prueba iniciada (20g)");
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };

  return (
    <div style={styles.fondo}>
      <Container className="py-5 mt-5">
        <Card className="p-4 shadow text-center mx-auto" style={styles.card}>
          {/* Encabezado dentro del Card */}
          <div style={styles.encabezado}>
            <h2 className="fw-bold text-center" style={styles.titulo}>
              Configuración del Dispensador
            </h2>
            <p className="text-center" style={styles.textoBlanco}>
              Actualiza la configuración del dispensador de alimento.
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

          <Card.Body>
            <Form onSubmit={handleActualizar}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="cantidadDispensar">
                    <Form.Label style={styles.textoBlanco}>Cantidad a dispensar (gramos)</Form.Label>
                    <Form.Control
                      type="number"
                      min="10"
                      max="500"
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
                <Col md={12}>
                  <Form.Group controlId="modoVacaciones" className="d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      checked={modoVacaciones}
                      onChange={(e) => setModoVacaciones(e.target.checked)}
                      style={{marginRight: '10px'}}
                    />
                    <Form.Label style={styles.textoBlanco} className="mb-0">
                      Modo vacaciones (dispensar cada 48 horas)
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="warning" onClick={dispensarPrueba} style={styles.botonSecundario}>
                  Dispensar prueba
                </Button>
                <Button variant="primary" type="submit" style={styles.boton}>
                  Actualizar Configuración
                </Button>
              </div>
            </Form>
            
            <div style={styles.tarjeta} className="mt-4">
              <h5 style={{color: "#FFC914"}}>Información adicional</h5>
              <p className="small text-muted">
                El modo vacaciones reduce la frecuencia de dispensación para cuando estés fuera de casa.
                Asegúrate de que el dispensador tenga suficiente alimento antes de activar este modo.
              </p>
            </div>
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
  botonSecundario: {
    fontSize: "14px",
    padding: "8px 20px",
    backgroundColor: "#00515f", // Fondo azul oscuro
    borderColor: "#ffc914", // Borde amarillo
    color: "#ffffff", // Texto blanco
  },
  tarjeta: {
    backgroundColor: "#2a3438",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "15px",
    border: "1px solid #334",
  },
};

export default ConfiguracionDispensador;