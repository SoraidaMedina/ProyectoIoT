import React, { useState } from "react";
import { Container, Card, Row, Col, Nav, Tab, Badge, Button, Alert, Form } from "react-bootstrap";

const EstadoDispensador = () => {
  const [nivelAlimento, setNivelAlimento] = useState("🟢 Alimento Suficiente");
  const [activeKey, setActiveKey] = useState("estado");
  const [estadoConexion, setEstadoConexion] = useState("✓ Conectado");
  const [ultimaActualizacion, setUltimaActualizacion] = useState("21/03/2025 11:35");
  const [dispositivoMAC, setDispositivoMAC] = useState("00:1B:44:11:3A:B7");
  const [dispositivoIP, setDispositivoIP] = useState("192.168.1.105");
  const [valorPotenciometro, setValorPotenciometro] = useState("512 unidades");
  const [status, setStatus] = useState("Esperando acciones...");
  const [loading, setLoading] = useState(false);
  const [estadoAlimento, setEstadoAlimento] = useState("verde"); // verde, amarillo, rojo
  const [estadoServo, setEstadoServo] = useState("🔒 Cerrado");
  const [ultimaDispensacion, setUltimaDispensacion] = useState("21/03/2025 11:30");
  const [pesoAlimento, setPesoAlimento] = useState("325 g");

  const dispensarAlimento = (gramos) => {
    if (loading) return;
    setLoading(true);
    setStatus(`Dispensando ${gramos} gramos...`);
    
    // Simulación de dispensación
    setTimeout(() => {
      setLoading(false);
      setStatus("Dispensación completada");
      setUltimaDispensacion(new Date().toLocaleString());
    }, 2000);
  };

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
    },
    boton: {
      backgroundColor: "#00515f",
      borderColor: "#00515f",
      margin: "5px"
    },
    dispensadorVisual: {
      position: "relative",
      width: "100%",
      height: "240px",
      margin: "20px auto",
      backgroundColor: "#2a3438",
      borderRadius: "10px",
      border: "1px solid #334",
      overflow: "hidden",
      padding: "10px"
    },
    tolva: {
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "120px",
      height: "100px",
      backgroundColor: "#333",
      borderRadius: "10px 10px 0 0",
      overflow: "hidden"
    },
    alimentoTolva: {
      position: "absolute",
      bottom: "0",
      width: "100%",
      height: "85%",
      backgroundColor: "#4CAF50",
      transition: "height 0.5s ease"
    },
    tubo: {
      position: "absolute",
      top: "120px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "20px",
      height: "80px",
      backgroundColor: "#444"
    },
    plato: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "140px",
      height: "15px",
      backgroundColor: "#555",
      borderRadius: "50%"
    }
  };

  const NivelAlimento = ({ nivelAlimento }) => {
    return (
      <div className="mt-4">
        <h3 style={{color: "#FFC914"}}>Nivel de Alimento:</h3>
        <p className="fs-4">{nivelAlimento}</p>
      </div>
    );
  };

  const SensorPeso = () => {
    return (
      <div className="mt-4">
        <h3 style={{color: "#FFC914"}}>Peso del Alimento:</h3>
        <p className="fs-4">{pesoAlimento}</p>
      </div>
    );
  };

  const Dispensador = () => {
    return (
      <div className="my-4">
        <h3 className="mb-3 text-center" style={{color: "#FFC914"}}>Dispensador de Alimento</h3>
        
        {/* Visualización del dispensador */}
        <div style={styles.dispensadorVisual}>
          {/* Tolva */}
          <div style={styles.tolva}>
            <div style={styles.alimentoTolva}></div>
          </div>
          
          {/* Tubo */}
          <div style={styles.tubo}>
            {loading && (
              <div style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "8px",
                height: "8px",
                backgroundColor: "#FFC914",
                borderRadius: "50%",
                animation: "caer 1s infinite"
              }}></div>
            )}
          </div>
          
          {/* Plato */}
          <div style={styles.plato}></div>
          
          {/* Sensores de nivel */}
          <div style={{
            position: "absolute",
            top: "30px",
            right: "40px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#4CAF50",
            border: "1px solid #ccc"
          }}></div>
          <div style={{
            position: "absolute",
            top: "60px",
            right: "40px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#FFC107",
            border: "1px solid #ccc"
          }}></div>
          <div style={{
            position: "absolute",
            top: "90px",
            right: "40px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#333",
            border: "1px solid #ccc"
          }}></div>
        </div>
        
        <Row className="mt-4">
          <Col>
            <Alert variant={loading ? "info" : status.includes("Error") ? "danger" : "success"}>
              {status}
            </Alert>
          </Col>
        </Row>
        
        <Row className="mt-3">
          <Col xs={12}>
            <h5 style={{color: "#FFC914"}}>Dispensar cantidad:</h5>
          </Col>
          <Col xs={6} md={3}>
            <Button 
              style={styles.boton}
              onClick={() => dispensarAlimento(50)} 
              disabled={loading}
              className="w-100"
            >
              50 gramos
            </Button>
          </Col>
          <Col xs={6} md={3}>
            <Button 
              style={styles.boton}
              onClick={() => dispensarAlimento(100)} 
              disabled={loading}
              className="w-100"
            >
              100 gramos
            </Button>
          </Col>
        </Row>
        
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{color: "#FFC914"}}>Cantidad personalizada (g):</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Introducir cantidad" 
                min="10" 
                max="500"
                defaultValue="100"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Button 
              style={styles.boton}
              onClick={() => dispensarAlimento(100)} 
              disabled={loading}
              className="w-100 mt-2"
            >
              Dispensar
            </Button>
          </Col>
        </Row>
        
        <div className="mt-3 d-flex justify-content-between">
          <span>Estado del servo: {estadoServo}</span>
          {ultimaDispensacion && (
            <span>Última dispensación: {ultimaDispensacion}</span>
          )}
        </div>
        
        {/* Estilos para animación */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes caer {
              0% { transform: translateY(0) translateX(-50%); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(80px) translateX(-50%); opacity: 0; }
            }
          `
        }} />
      </div>
    );
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
                  <Dispensador />
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
                    <div className="mt-4">
                      <table className="table table-dark table-striped">
                        <thead>
                          <tr>
                            <th>Fecha y Hora</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>21/03/2025 11:30</td>
                            <td>100g</td>
                            <td><Badge bg="success">Completado</Badge></td>
                          </tr>
                          <tr>
                            <td>21/03/2025 08:15</td>
                            <td>50g</td>
                            <td><Badge bg="success">Completado</Badge></td>
                          </tr>
                          <tr>
                            <td>20/03/2025 19:45</td>
                            <td>75g</td>
                            <td><Badge bg="success">Completado</Badge></td>
                          </tr>
                          <tr>
                            <td>20/03/2025 08:30</td>
                            <td>100g</td>
                            <td><Badge bg="success">Completado</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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