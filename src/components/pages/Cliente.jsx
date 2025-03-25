import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { FaPaw, FaDog, FaBone, FaClock, FaWeight, FaInfoCircle, FaPlayCircle } from "react-icons/fa";
import './Cliente.css';

function Cliente() {
  const navigate = useNavigate();
  const { token } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [userDevices, setUserDevices] = useState([]);
  const [error, setError] = useState('');

  // Cargar dispositivos al montar el componente
  useEffect(() => {
    const cargarDispositivos = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/dispositivos-usuario/usuario', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log("Dispositivos cargados:", data.data);
          setUserDevices(data.data || []);
        } else {
          setError(data.message || 'Error al cargar dispositivos');
        }
      } catch (err) {
        console.error("Error al cargar dispositivos:", err);
        setError('Error de conexión al cargar dispositivos');
      } finally {
        setLoading(false);
      }
    };

    cargarDispositivos();
  }, [token]);

  // Manejar la dispensación de alimento
  const handleDispenseFood = async (deviceId) => {
    try {
      // Aquí implementarías la lógica para dispensar alimento
      console.log(`Dispensando alimento para el dispositivo ${deviceId}`);
      
      // Ejemplo de llamada a API para dispensar
      const response = await fetch(`http://localhost:5000/api/dispensador/comando`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comando: 'dispensar',
          dispensadorId: deviceId
        })
      });
      
      if (response.ok) {
        alert('Dispensando alimento...');
      } else {
        alert('Error al enviar comando de dispensación');
      }
    } catch (err) {
      console.error("Error al dispensar:", err);
      alert('Error de conexión al enviar comando');
    }
  };

  return (
    <div className="client-page">
      <div className="client-header">
        <h1><FaPaw className="icon-title" /> Bienvenido a tu Panel de Cliente</h1>
        <p>Administra tu cuenta, revisa el estado de tu dispensador y accede a tus pedidos recientes.</p>
      </div>

      <Container>
        {/* Resumen de estado */}
        <Row className="status-cards">
          <Col md={3} sm={6} className="mb-4">
            <Card className="status-card">
              <Card.Body>
                <div className="status-icon-container dog">
                  <FaDog className="status-icon" />
                </div>
                <Card.Title className="status-title">Mascotas Activas</Card.Title>
                <Card.Text className="status-value">1</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="status-card">
              <Card.Body>
                <div className="status-icon-container bone">
                  <FaBone className="status-icon" />
                </div>
                <Card.Title className="status-title">Dispensadores</Card.Title>
                <Card.Text className="status-value">{userDevices.length || 1}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="status-card">
              <Card.Body>
                <div className="status-icon-container clock">
                  <FaClock className="status-icon" />
                </div>
                <Card.Title className="status-title">Próxima Alimentación</Card.Title>
                <Card.Text className="status-value">07:00 PM</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="status-card">
              <Card.Body>
                <div className="status-icon-container weight">
                  <FaWeight className="status-icon" />
                </div>
                <Card.Title className="status-title">Estado Alimento</Card.Title>
                <Card.Text className="status-value">780g</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de Mis Dispositivos */}
        <div className="section-header">
          <h2 className="section-title"><FaPaw /> Mis Dispositivos</h2>
          <Button 
            variant="primary"
            className="add-device-btn"
            onClick={() => navigate('/registrar-dispositivo')}
          >
            + Registrar Nuevo Dispensador
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando tus dispositivos...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : userDevices.length === 0 ? (
          <Alert variant="info">
            No tienes dispensadores registrados. ¡Registra uno nuevo para comenzar!
            <div className="mt-3">
              <Button 
                variant="primary"
                onClick={() => navigate('/registrar-dispositivo')}
              >
                Registrar Nuevo Dispensador
              </Button>
            </div>
          </Alert>
        ) : (
          <Row>
            {/* Renderizar los dispositivos del usuario */}
            {userDevices.map((device) => (
              <Col key={device._id} lg={6} md={12} className="mb-4">
                <Card className="device-card">
                  <Card.Header className="device-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{device.dispositivo?.nombre || "Dispensador Patio"}</h4>
                    <Badge bg="success" pill>Activo</Badge>
                  </Card.Header>
                  <Card.Body>
                    <div className="device-info">
                      <p><strong>MAC:</strong> {device.dispositivo?.macAddress || "14:2B:2F:C9:1F:20"}</p>
                      <p><strong>IP:</strong> {device.dispositivo?.ip || "192.168.1.100"}</p>
                      <p><strong>Última conexión:</strong> {new Date().toLocaleString()}</p>
                      
                      {device.mascota && (
                        <div className="pet-info mt-3">
                          <h5><FaDog className="me-2" /> Mascota asignada</h5>
                          <p>
                            <strong>Nombre:</strong> {device.mascota.nombre} <br />
                            <strong>Raza:</strong> {device.mascota.raza} <br />
                            <strong>Edad:</strong> {device.mascota.edad} 
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="device-actions mt-3">
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={() => navigate(`/Estado-Dispensador?id=${device._id}`)}
                      >
                        <FaInfoCircle className="me-1" /> Detalles
                      </Button>
                      <Button 
                        variant="success"
                        onClick={() => handleDispenseFood(device._id)}
                      >
                        <FaPlayCircle className="me-1" /> Dispensar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            
            {/* Dispensador de ejemplo si no hay datos pero la API no retorna error */}
            {userDevices.length === 0 && !error && (
              <Col lg={6} md={12} className="mb-4">
                <Card className="device-card">
                  <Card.Header className="device-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Dispensador Patio</h4>
                    <Badge bg="success" pill>Activo</Badge>
                  </Card.Header>
                  <Card.Body>
                    <div className="device-info">
                      <p><strong>MAC:</strong> 14:2B:2F:C9:1F:20</p>
                      <p><strong>IP:</strong> 192.168.1.100</p>
                      <p><strong>Última conexión:</strong> {new Date().toLocaleString()}</p>
                      
                      <div className="pet-info mt-3">
                        <h5><FaDog className="me-2" /> Mascota asignada</h5>
                        <p>
                          <strong>Nombre:</strong> Apache <br />
                          <strong>Raza:</strong> Cali <br />
                          <strong>Edad:</strong> 5 meses
                        </p>
                      </div>
                    </div>
                    
                    <div className="device-actions mt-3">
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={() => navigate(`/Estado-Dispensador?id=ejemplo`)}
                      >
                        <FaInfoCircle className="me-1" /> Detalles
                      </Button>
                      <Button 
                        variant="success"
                        onClick={() => alert('Dispensando alimento...')}
                      >
                        <FaPlayCircle className="me-1" /> Dispensar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Cliente;