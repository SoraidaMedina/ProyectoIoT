import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import MisDispositivos from '../MisDispositivos';

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
          setUserDevices(data.data);
        } else {
          setError(data.message || 'Error al cargar dispositivos');
        }
      } catch (err) {
        setError('Error de conexión al cargar dispositivos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDispositivos();
  }, [token]);

  return (
    <div style={styles.fondo}>
      <Container className="py-5">
        <h2 style={styles.titulo}>Bienvenido a tu Panel de Cliente</h2>
        <p style={styles.textoCentrado}>
          Administra tu cuenta, revisa el estado de tu dispensador y accede a tus pedidos recientes.
        </p>

        {/* Sección de Mis Dispositivos */}
        <div className="my-4">
          <h3 className="mb-3">Mis Dispositivos</h3>
          
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
            <MisDispositivos />
          )}
        </div>

        {/* Primera fila de tarjetas */}
        <Row className="mt-4 justify-content-center">
          <Col md={5} className="mb-4">
            <Card style={styles.card}>
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.cardTitle}>Monitoreo del Dispensador</Card.Title>
                <Card.Text>
                  {userDevices.length > 0 ? (
                    <>
                      Dispositivos activos: <strong>{userDevices.filter(d => d.estado?.activo).length}</strong><br />
                      Total de dispositivos: <strong>{userDevices.length}</strong>
                    </>
                  ) : (
                    "Registra tu primer dispensador para comenzar a monitorear."
                  )}
                </Card.Text>
                <Button
                  variant="success"
                  style={styles.boton}
                  onClick={() => navigate(userDevices.length > 0 ? `/Estado-Dispensador?id=${userDevices[0]?._id}` : "/registrar-dispositivo")}
                >
                  {userDevices.length > 0 ? "Ver detalles" : "Registrar dispositivo"}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Resto de las tarjetas... */}
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

// Estilos actualizados
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