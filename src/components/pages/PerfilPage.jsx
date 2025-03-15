import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useUserContext } from '../../context/UserContext';

function PerfilPage() {
  const { user } = useUserContext();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    direccion: ''
  });

  useEffect(() => {
    const obtenerPerfil = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/perfil/${user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el perfil');
        }

        const data = await response.json();
        setPerfil(data);
        setFormData({
          nombre: data.nombre || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          direccion: data.direccion || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener el perfil:', err);
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/perfil/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil');
      }

      const data = await response.json();
      setPerfil(data.usuario);
      alert(data.mensaje || 'Perfil actualizado exitosamente');
      setLoading(false);
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setLoading(false);
    }
  };

  return (
    <div 
      className="bg-light" 
      style={{ 
        minHeight: 'calc(100vh - 100px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px 0',
        marginTop: '120px',
        backgroundColor: '#ff2db'  // Color de fondo exterior
      }}
    >
      <Container>
        <Card className="shadow-lg border-0" style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          <Card.Header 
            className="text-center py-4" 
            style={{ 
              backgroundColor: '#00515f', 
              color: 'white' 
            }}
          >
            <h2 className="mb-0">Perfil de Usuario</h2>
          </Card.Header>
          <Card.Body className="p-5">
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ingresa tu nombre"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label>Apellido Paterno</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidoPaterno"
                      value={formData.apellidoPaterno}
                      onChange={handleChange}
                      required
                      placeholder="Apellido paterno"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidoMaterno"
                      value={formData.apellidoMaterno}
                      onChange={handleChange}
                      placeholder="Apellido materno"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12 mb-3">
                  <Form.Group>
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      disabled
                      className="form-control-lg bg-light"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12 mb-4">
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Ingresa tu dirección"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="w-100 btn-lg"
                    style={{ 
                      backgroundColor: '#00515f', 
                      borderColor: '#00515f' 
                    }}
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                  </Button>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default PerfilPage;