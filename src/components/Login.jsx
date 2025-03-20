import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useUserContext } from "../context/UserContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useUserContext();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return "El correo electrónico es requerido";
    }
    
    if (!emailRegex.test(email)) {
      return "Ingrese un correo electrónico válido";
    }
    
    return ""; // No error
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password.trim()) {
      return "La contraseña es requerida";
    }
    
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    
    return ""; // No error
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate email and password
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    // If there are validation errors, set them and prevent submission
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

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
        login(result.usuario);
        
        // Redirige según el rol del usuario
        if (result.usuario.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/cliente");
        }
      } else {
        setErrors({ 
          server: result.error || "Correo o contraseña incorrectos."
        });
      }
    } catch (err) {
      setErrors({ 
        server: "Error al conectar con el servidor. Intenta más tarde."
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "22rem", padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <h3 className="text-center">Iniciar Sesión</h3>
          {errors.server && <Alert variant="danger">{errors.server}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '', server: '' }));
                }}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPassword" className="position-relative">
              <Form.Label>Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '', server: '' }));
                  }}
                  isInvalid={!!errors.password || !!errors.server}
                  className="pe-5" // Adds padding on the right for the button
                />
                <Button 
                  variant="link" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                  style={{ 
                    zIndex: 10, 
                    right: "10px", 
                    marginTop: "-10px" 
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="gray" />
                  ) : (
                    <Eye size={20} color="gray" />
                  )}
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.password || errors.server}
              </Form.Control.Feedback>
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