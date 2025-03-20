import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar contraseña

  // Validaciones
  const validateNombreApellido = (value) => {
    const regex = /^[A-Za-z\s]+$/;
    return (
      value.length >= 2 &&
      value.length <= 50 &&
      regex.test(value) &&
      value.charAt(0) === value.charAt(0).toUpperCase()
    );
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value.length <= 100 && regex.test(value);
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return regex.test(value);
  };

  const validateDireccion = (value) => {
    const regex = /^[A-Za-z0-9\s,.-]+$/;
    return value.length >= 5 && value.length <= 200 && regex.test(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!nombre || !validateNombreApellido(nombre)) {
      setError("❌ El nombre debe tener entre 2 y 50 caracteres, solo letras y espacios, y empezar con mayúscula.");
      return;
    }
    if (!apellidoPaterno || !validateNombreApellido(apellidoPaterno)) {
      setError("❌ El apellido paterno debe tener entre 2 y 50 caracteres, solo letras y espacios, y empezar con mayúscula.");
      return;
    }
    if (!apellidoMaterno || !validateNombreApellido(apellidoMaterno)) {
      setError("❌ El apellido materno debe tener entre 2 y 50 caracteres, solo letras y espacios, y empezar con mayúscula.");
      return;
    }

    if (!email || !validateEmail(email)) {
      setError("❌ El correo debe ser válido y no exceder los 100 caracteres.");
      return;
    }

    if (!password || !validatePassword(password)) {
      setError(
        "❌ La contraseña debe tener entre 8 y 20 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    if (!direccion || !validateDireccion(direccion)) {
      setError("❌ La dirección debe tener entre 5 y 200 caracteres y solo permitir letras, números, espacios, comas, puntos y guiones.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidoPaterno, apellidoMaterno, email, password, direccion }),
      });

      const data = await response.json();
      if (response.ok) {
        setError("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "❌ Error en el registro.");
      }
    } catch (error) {
      setError("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={styles.container}>
      <Card style={styles.card}>
        <Card.Body>
          <h3 className="text-center" style={styles.title}>Registro</h3>

          {error && <Alert variant="danger" className="mt-3" style={styles.alert}>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group controlId="formApellidoPaterno" className="mt-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su apellido paterno"
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group controlId="formApellidoMaterno" className="mt-3">
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su apellido materno"
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese su correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3" style={{ position: "relative" }}>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3" style={{ position: "relative" }}>
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme su contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Form.Group controlId="formDireccion">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su dirección (Ej: Pachuca, Hgo.)"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                    style={styles.input}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-4"
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#16A085")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1ABC9C")}
            >
              Registrarse
            </Button>

            <div className="text-center mt-3">
              <a href="/login" style={styles.link}>
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    marginTop: "90px",
  },
  card: {
    width: "40rem",
    padding: "25px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },
  title: {
    fontWeight: "bold",
    color: "#2C3E50",
  },
  alert: {
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderRadius: "5px",
    padding: "12px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#1ABC9C",
    border: "none",
    borderRadius: "5px",
    padding: "12px",
    fontWeight: "bold",
    transition: "0.3s",
  },
  link: {
    color: "#2980B9",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "38px",
    cursor: "pointer",
    color: "#666",
  },
};

export default Register;