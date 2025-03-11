import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Hacer una solicitud al backend para autenticar al usuario
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Si la respuesta es exitosa, navegar al Panel de Cliente
      if (response.ok) {
        onLogin();
        navigate("/cliente"); // Redirige al Panel de Cliente
      } else {
        const result = await response.json();
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
              <a href="/register">¿No tienes cuenta? Regístrate</a>
            </div>

            <div className="text-center mt-3">
              <a href="/recuperar-contraseña">¿Olvidaste tu contraseña?</a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;