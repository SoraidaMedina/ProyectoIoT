import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useUserContext } from "../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useUserContext(); // Obtén la función login del contexto

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`¡Bienvenido, ${result.usuario.nombre}!`);
        login(result.usuario); // Actualiza el estado del usuario en el contexto
        
        // Redirige según el rol del usuario
        if (result.usuario.role === "admin") {
          navigate("/admin"); // Redirige a administrador si tiene rol admin
        } else {
          navigate("/cliente"); // Redirige a cliente en todos los demás casos
        }
      } else {
        setError(result.error || "Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "22rem", padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <h3 className="text-center">Iniciar Sesión</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Iniciar Sesión
            </Button>
            <div className="text-center mt-3">
              <span>No tienes cuenta? {" "}
                <Link to="/register" style={{ color: "#007bff", fontWeight: "bold" }}>
                  Regístrate aquí
                </Link>
              </span>
            </div>
            <div className="text-center mt-3">
              <Link to="/recuperar-contraseña" style={{ color: "#ff0000", fontWeight: "bold" }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;