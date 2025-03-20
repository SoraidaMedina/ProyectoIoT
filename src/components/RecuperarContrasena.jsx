import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // Para mostrar/ocultar nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Para confirmar contraseña

  // Funciones de validación
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value.length <= 100 && regex.test(value);
  };

  const validateVerificationCode = (value) => {
    const regex = /^[0-9]+$/; // Solo números
    return value.length === 6 && regex.test(value); // Longitud exacta de 6
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,20}$/;
    return regex.test(value);
  };

  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !validateEmail(email)) {
      setError("❌ El correo debe ser válido y no exceder los 100 caracteres.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/solicitar-recuperacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("✅ Se ha enviado un código de verificación a tu correo electrónico.");
        setStep(2);
      } else {
        setError(result.error || "❌ No se pudo enviar el código de verificación.");
      }
    } catch (err) {
      setError("❌ Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setError("❌ El código debe ser numérico y tener exactamente 6 dígitos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("✅ Código verificado correctamente.");
        setStep(3);
      } else {
        setError(result.error || "❌ Código de verificación incorrecto.");
      }
    } catch (err) {
      setError("❌ Error al conectar con el servidor. Intenta más tarde.");
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !validatePassword(newPassword)) {
      setError(
        "❌ La contraseña debe tener entre 8 y 20 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*?)."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("✅ ¡Contraseña cambiada con éxito!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.error || "❌ No se pudo cambiar la contraseña.");
      }
    } catch (err) {
      setError("❌ Error al conectar con el servidor. Intenta más tarde.");
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
            <Form.Group controlId="formNewPassword" style={{ position: "relative" }}>
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                placeholder="Ingrese su nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mt-3" style={{ position: "relative" }}>
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme su nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
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

const styles = {
  eyeIcon: {
    position: "absolute",
    right: "10px",
 Suitop: "38px",
    cursor: "pointer",
    color: "#666",
  },
};

export default RecuperarContrasena;