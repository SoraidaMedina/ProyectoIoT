import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    
    try {
      // Aquí implementarías la lógica para enviar la solicitud al backend
      const response = await fetch("http://localhost:5000/api/auth/solicitar-recuperacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess("Se ha enviado un código de verificación a tu correo electrónico.");
        setStep(2); // Avanzar al siguiente paso
      } else {
        setError(result.error || "No se pudo enviar el código de verificación.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    
    try {
      // Verifica el código
      const response = await fetch("http://localhost:5000/api/auth/verificar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess("Código verificado correctamente.");
        setStep(3); // Avanzar al paso de nueva contraseña
      } else {
        setError(result.error || "Código de verificación incorrecto.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    try {
      // Cambiar contraseña
      const response = await fetch("http://localhost:5000/api/auth/cambiar-contrasena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess("¡Contraseña cambiada con éxito!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error || "No se pudo cambiar la contraseña.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Form onSubmit={handleSubmitEmail}>
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
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Enviar Código de Verificación
            </Button>
          </Form>
        );
      
      case 2:
        return (
          <Form onSubmit={handleVerifyCode}>
            <Form.Group controlId="formVerificationCode">
              <Form.Label>Código de Verificación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el código recibido en su correo"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Verificar Código
            </Button>
          </Form>
        );
      
      case 3:
        return (
          <Form onSubmit={handleResetPassword}>
            <Form.Group controlId="formNewPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Cambiar Contraseña
            </Button>
          </Form>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "22rem", padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <h3 className="text-center">Recuperar Contraseña</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          {renderStep()}
          
          <div className="text-center mt-3">
            <a href="/login" style={{ color: "#007bff", fontWeight: "bold" }}>
              Volver al inicio de sesión
            </a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecuperarContrasena;