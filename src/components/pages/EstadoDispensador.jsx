import React, { useState, useEffect } from "react";
import Dispensador from "./Dispensador";
import NivelAlimento from "./NivelAlimento";
import SensorPeso from "./SensorPeso";
import { Container, Card, Row, Col, Nav, Tab, Badge } from "react-bootstrap";
import { client, TOPICS } from "../../mqttConfig";

const EstadoDispensador = () => {
  const [nivelAlimento, setNivelAlimento] = useState("🟢 Alimento Suficiente");
  const [activeKey, setActiveKey] = useState("estado");
  const [estadoConexion, setEstadoConexion] = useState("⚠️ Desconectado");
  const [ultimaActualizacion, setUltimaActualizacion] = useState("Nunca");
  const [dispositivoMAC, setDispositivoMAC] = useState("No disponible");
  const [dispositivoIP, setDispositivoIP] = useState("No disponible");
  const [valorPotenciometro, setValorPotenciometro] = useState("Esperando datos...");

  useEffect(() => {
    // Verificar conexión MQTT inicial
    if (client.connected) {
      setEstadoConexion("✓ Conectado");
    }

    // Suscribirse a topics de MAC e IP
    client.subscribe("sensores/mac");
    client.subscribe("sensores/ip");
    client.subscribe("sensores/potenciometro");

    const handleConnect = () => {
      setEstadoConexion("✓ Conectado");
      console.log("✅ Conectado al broker MQTT");
    };

    const handleClose = () => {
      setEstadoConexion("⚠️ Desconectado");
      console.log("❌ Desconectado del broker MQTT");
    };

    const handleMessage = (topic, message) => {
      const msg = message.toString();
      console.log(`📩 Mensaje MQTT recibido - ${topic}: ${msg}`);
      
      // Actualizar la hora de la última actualización
      setUltimaActualizacion(new Date().toLocaleTimeString());
      
      // Procesar mensaje según el tópico
      switch(topic) {
        case "sensores/mac":
          setDispositivoMAC(msg);
          break;
        case "sensores/ip":
          setDispositivoIP(msg);
          break;
        case "sensores/potenciometro":
          setValorPotenciometro(`${msg} unidades`);
          break;
        case "sensores/led":
          // Esto se maneja en otro componente, pero podríamos procesarlo aquí también
          break;
      }
    };

    client.on('connect', handleConnect);
    client.on('close', handleClose);
    client.on('message', handleMessage);
    client.on('error', (err) => {
      console.error("Error MQTT:", err);
      setEstadoConexion("❌ Error de conexión");
    });

    return () => {
      client.off('connect', handleConnect);
      client.off('close', handleClose);
      client.off('message', handleMessage);
      client.off('error');
    };
  }, []);

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
                    eventKey="dispositivo" 
                    style={activeKey === "dispositivo" ? styles.customNavItemActive : styles.customNavItem}
                  >
                    🔌 Dispositivo
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
                    <h4 style={{color: "#FFC914"}}>Valor del Potenciómetro</h4>
                    <p className="fs-4 mt-3">{valorPotenciometro}</p>
                  </div>
                  
                  <div style={styles.tarjeta}>
                    <h4 style={{color: "#FFC914"}}>Estado de Conexión</h4>
                    <div className="d-flex justify-content-between my-2">
                      <span>Conexión MQTT:</span>
                      <span style={{color: estadoConexion.includes("✓") ? "#4CAF50" : "#F44336"}}>{estadoConexion}</span>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                      <span>Dirección del broker:</span>
                      <span>localhost:9001</span>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                      <span>Última actualización:</span>
                      <span>{ultimaActualizacion}</span>
                    </div>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="control">
                  <Dispensador setNivelAlimento={setNivelAlimento} />
                </Tab.Pane>
                
                <Tab.Pane eventKey="dispositivo">
                  <div style={styles.tarjeta}>
                    <h4 style={{color: "#FFC914"}}>Información del Dispositivo</h4>
                    <div className="d-flex justify-content-between my-3">
                      <span>Dirección MAC:</span>
                      <Badge bg={dispositivoMAC !== "No disponible" ? "success" : "secondary"} className="p-2">
                        {dispositivoMAC}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>Dirección IP:</span>
                      <Badge bg={dispositivoIP !== "No disponible" ? "info" : "secondary"} className="p-2">
                        {dispositivoIP}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h5 style={{color: "#FFC914"}}>Comunicación con el dispositivo</h5>
                      <p className="small text-muted">
                        El dispositivo se comunica de forma bidireccional usando el protocolo MQTT. 
                        La información de estado se actualiza en tiempo real cuando el dispositivo 
                        envía datos al servidor.
                      </p>
                    </div>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="historial">
                  <div style={styles.tarjeta}>
                    <h4 style={{color: "#FFC914"}}>Historial de Dispensaciones</h4>
                    <p className="text-center text-muted mt-4">
                      Función en desarrollo. Próximamente podrás ver el historial de dispensaciones.
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