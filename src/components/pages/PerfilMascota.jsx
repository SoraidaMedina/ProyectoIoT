import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";

function PerfilMascota() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const [peso, setPeso] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/mascotas") 
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) { 
          setNombre(data.nombre);
          setEdad(data.edad);
          setRaza(data.raza);
          setPeso(data.peso);
        }
      })
      .catch((error) => console.error("❌ Error al obtener la mascota:", error));
  }, []);

  const handleActualizar = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/mascotas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, edad, raza, peso })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al actualizar la mascota");
        }
        return res.json();
      })
      .then((data) => {
        alert(data.mensaje); 
      })
      .catch((error) => {
        console.error("❌ Error al actualizar:", error);
        alert("Error al actualizar la información. Intenta más tarde.");
      });
  };

  return (
    <div style={styles.fondo}>
      <Container className="py-5 mt-5">
        <Card className="p-4 shadow text-center mx-auto" style={styles.card}>
          {/* 📌 Sección de Encabezado dentro del Card */}
          <div style={styles.encabezado}>
            <h2 className="fw-bold text-center" style={styles.titulo}>
              Perfil de tu Mascota
            </h2>
            <p className="text-center" style={styles.textoCentrado}>
              Consulta y actualiza la información de tu mascota.
            </p>
          </div>

          <Card.Body>
            <Card.Title style={styles.textoBlanco}>🐶 Información de la Mascota</Card.Title>
            
            <Form onSubmit={handleActualizar}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="nombreMascota">
                    <Form.Label style={styles.textoBlanco}>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="edadMascota">
                    <Form.Label style={styles.textoBlanco}>Edad (años)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="razaMascota">
                    <Form.Label style={styles.textoBlanco}>Raza</Form.Label>
                    <Form.Control
                      type="text"
                      value={raza}
                      onChange={(e) => setRaza(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="pesoMascota">
                    <Form.Label style={styles.textoBlanco}>Peso (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="success" type="submit" className="mt-3" style={styles.boton}>
                Actualizar Información
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

// *🎨 Estilos*
const styles = {
  fondo: {
    backgroundColor: "#fff2db", // Fondo crema
    minHeight: "100vh",
    padding: "20px 0",
  },
  card: {
    maxWidth: "600px",
    backgroundColor: "#2d2d2d", // Gris oscuro
    color: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    border: "2px solid #00515f",
  },
  encabezado: {
    backgroundColor: "#2d2d2d", // Gris oscuro dentro del card
    padding: "10px 0",
    borderRadius: "10px",
  },
  titulo: {
    color: "#FFC914", // Amarillo
    fontWeight: "bold",
    marginBottom: "5px",
  },
  textoCentrado: {
    color: "#ffffff", // Blanco para que se vea bien dentro del Card
    fontSize: "16px",
  },
  textoBlanco: {
    color: "#ffffff",
  },
  boton: {
    fontSize: "14px", // Botón más pequeño
    padding: "8px 20px", // Ajuste de tamaño
    borderRadius: "8px",
  },
};

export default PerfilMascota;