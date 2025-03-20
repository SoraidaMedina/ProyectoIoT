import React, { useState } from "react";
import Dispensador from "../pages/Dispensador";
import NivelAlimento from "../pages/NivelAlimento";
import SensorPeso from "../pages/SensorPeso";
import { Container, Card, Row, Col, Nav, Tab } from "react-bootstrap";

const EstadoDispensador = () => {
  const [nivelAlimento, setNivelAlimento] = useState("🟢 Alimento Suficiente");
  const [activeKey, setActiveKey] = useState("estado");

  const styles = {
    fondo: {
      backgroundColor: "#fff2db", 
      minHeight: "100vh",
      padding: "20px 0",
    },
    card: {
      maxWidth: "800px",
      backgroundColor: "#1f2427", 
      color: "#ffffff",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "15px",
      border: "2px solid #00515f",
    },
    encabezado: {
      backgroundColor: "#1f2427", 
      padding: "10px 0",
      borderRadius: "10px",
    },
    titulo: {
      color: "#FFC914", 
      fontWeight: "bold",
      marginBottom: "5px",
    },
    textoBlanco: {
      color: "#ffffff", 
      fontSize: "16px",
    },
    tarjeta: {
      backgroundColor: "#2a3438",
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "15px",
      border: "1px solid #334",
    },
    customNav: {
      borderBottom: "1px solid #334",
      marginBottom: "20px",
    },
    customNavItem: {
      color: "#aaa",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "3px solid transparent",
    },
    customNavItemActive: {
      color: "#FFC914",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "3px solid #FFC914",
      fontWeight: "bold",
    }
  };

  return (
    <div style={styles.fondo}>
      <Container className="py-5 mt-5">
        <Card className="p-4 shadow text-center mx-auto" style={styles.card}>
          {/* Encabezado */}
          <div style={styles.encabezado}>
            <h2 className="fw-bold text-center" style={styles.titulo}>
              Estado del Dispensador
            </h2>
            <p className="text-center" style={styles.textoBlanco}>
              Verifica el estado actual del dispensador de alimento.
            </p>
          </div>

          <Card.Body>
            <Tab.Container 
              activeKey={activeKey}
              onSelect={(k) => setActiveKey(k)}
            >
              <Nav 
                variant="tabs" 
                className="mb-4 justify-content-center"
                style={styles.customNav}
              >
                <Nav.Item>
                  <Nav.Link 
                    eventKey="estado" 
                    style={activeKey === "estado" ? styles.customNavItemActive : styles.customNavItem}
                  >
                    📊 Estado Actual
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="control" 
                    style={activeKey === "control" ? styles.customNavItemActive : styles.customNavItem}
                  >
                    🎮 Control
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="historial" 
                    style={activeKey === "historial" ? styles.customNavItemActive : styles.customNavItem}
                  >
                    📜 Historial
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                <Tab.Pane eventKey="estado">
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <div style={styles.tarjeta}>
                        <NivelAlimento nivelAlimento={nivelAlimento} />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={styles.tarjeta}>
                        <SensorPeso />
                      </div>
                    </Col>
                  </Row>
                  
                  <div style={styles.tarjeta}>
                    <h4 style={{color: "#FFC914"}}>Estado del Dispositivo</h4>
                    <div className="d-flex justify-content-between my-2">
                      <span>Conexión:</span>
                      <span style={{color: "#4CAF50"}}>✓ Conectado</span>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                      <span>Dirección IP:</span>
                      <span>192.168.116.118</span>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                      <span>Última actualización:</span>
                      <span>Hace 1 minuto</span>
                    </div>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="control">
                  <Dispensador setNivelAlimento={setNivelAlimento} />
                </Tab.Pane>
                
                <Tab.Pane eventKey="historial">
                  <div style={styles.tarjeta}>
                    <h4 style={{color: "#FFC914"}}>Historial de Dispensaciones</h4>
                    <p className="text-center text-muted mt-4">
                      Historial no disponible en este momento.
                    </p>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EstadoDispensador;