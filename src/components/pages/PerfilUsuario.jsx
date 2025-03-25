// src/components/pages/PerfilUsuario.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useUserContext } from '../../context/UserContext';
import MisDispositivos from '../MisDispositivos';

const PerfilUsuario = () => {
  const { user, token, updateUser } = useUserContext();
  
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    direccion: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  // Cargar datos del perfil
  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        apellidoPaterno: user.apellidoPaterno || '',
        apellidoMaterno: user.apellidoMaterno || '',
        email: user.email || '',
        direccion: user.direccion || ''
      });
    }
  }, [user]);
  
  // Manejar cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/auth/perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: profileData.nombre,
          apellidoPaterno: profileData.apellidoPaterno,
          apellidoMaterno: profileData.apellidoMaterno,
          direccion: profileData.direccion
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        
        // Actualizar datos del usuario en el contexto
        if (data.data) {
          updateUser(data.data);
        }
      } else {
        setMessage({ type: 'danger', text: data.message || 'Error al actualizar perfil' });
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setMessage({ type: 'danger', text: 'Error de conexión al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };
  
  // Cambiar contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwordData.passwordNueva !== passwordData.confirmarPassword) {
      setPasswordMessage({ type: 'danger', text: 'Las contraseñas no coinciden' });
      return;
    }
    
    setLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passwordActual: passwordData.passwordActual,
          passwordNueva: passwordData.passwordNueva
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
        
        // Limpiar formulario
        setPasswordData({
          passwordActual: '',
          passwordNueva: '',
          confirmarPassword: ''
        });
      } else {
        setPasswordMessage({ type: 'danger', text: data.message || 'Error al cambiar contraseña' });
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setPasswordMessage({ type: 'danger', text: 'Error de conexión al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Perfil de Usuario</h1>
      
      <Tabs defaultActiveKey="perfil" className="mb-4">
        <Tab eventKey="perfil" title="Información Personal">
          <Card>
            <Card.Body>
              <h2 className="mb-4">Datos Personales</h2>
              
              {message.text && (
                <Alert variant={message.type}>
                  {message.text}
                </Alert>
              )}
              
              <Form onSubmit={handleProfileSubmit}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={profileData.nombre}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido Paterno</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidoPaterno"
                        value={profileData.apellidoPaterno}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido Materno</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidoMaterno"
                        value={profileData.apellidoMaterno}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    No se puede cambiar el correo electrónico.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="direccion"
                    value={profileData.direccion}
                    onChange={handleProfileChange}
                    rows={3}
                    required
                  />
                </Form.Group>
                
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Body>
              <h2 className="mb-4">Cambiar Contraseña</h2>
              
              {passwordMessage.text && (
                <Alert variant={passwordMessage.type}>
                  {passwordMessage.text}
                </Alert>
              )}
              
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordActual"
                    value={passwordData.passwordActual}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordNueva"
                    value={passwordData.passwordNueva}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <Form.Text className="text-muted">
                    La contraseña debe tener al menos 8 caracteres.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarPassword"
                    value={passwordData.confirmarPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                </Form.Group>
                
                <Button
                  variant="warning"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="dispositivos" title="Mis Dispensadores">
          <MisDispositivos />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PerfilUsuario;