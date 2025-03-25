// src/components/MisDispositivos.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCog, FaBone, FaPaw, FaDog, FaCat } from 'react-icons/fa';
import { useUserContext } from '../context/UserContext';
import RegistroDispositivo from './RegistroDispositivo';
import { useNavigate } from 'react-router-dom';

const MisDispositivos = () => {
  const { user, token } = useUserContext();
  const navigate = useNavigate();
  
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [dispositivoEditando, setDispositivoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidadDispensacion: '',
    mascota: {
      nombre: '',
      tipo: 'perro',
      raza: '',
      peso: '',
      edad: ''
    }
  });
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dispositivoEliminando, setDispositivoEliminando] = useState(null);
  
  // Cargar dispositivos al montar el componente
  useEffect(() => {
    cargarDispositivos();
  }, []);
  
  // Función para cargar dispositivos
  const cargarDispositivos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/dispositivos-usuario/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDispositivos(data.data);
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
  
  // Función para manejar registro exitoso
  const handleRegistroExitoso = (nuevoDispositivo) => {
    setDispositivos([...dispositivos, nuevoDispositivo]);
    setMostrarRegistro(false);
  };
  
  // Función para abrir modal de edición
  const abrirModalEdicion = (dispositivo) => {
    setDispositivoEditando(dispositivo);
    setFormData({
      nombre: dispositivo.nombre || '',
      cantidadDispensacion: dispositivo.configuracion?.cantidadDispensacion || '50',
      mascota: {
        nombre: dispositivo.mascota?.nombre || '',
        tipo: dispositivo.mascota?.tipo || 'perro',
        raza: dispositivo.mascota?.raza || '',
        peso: dispositivo.mascota?.peso || '',
        edad: dispositivo.mascota?.edad || ''
      }
    });
    setShowEditModal(true);
  };
  
  // Función para guardar cambios en el dispositivo
  const guardarCambios = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dispositivos-usuario/${dispositivoEditando._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          configuracion: {
            cantidadDispensacion: parseInt(formData.cantidadDispensacion)
          },
          mascota: {
            nombre: formData.mascota.nombre,
            tipo: formData.mascota.tipo,
            raza: formData.mascota.raza,
            peso: formData.mascota.peso ? parseFloat(formData.mascota.peso) : null,
            edad: formData.mascota.edad ? parseInt(formData.mascota.edad) : null
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Actualizar el dispositivo en la lista
        const nuevosDispositivos = dispositivos.map(d => 
          d._id === dispositivoEditando._id ? data.data : d
        );
        setDispositivos(nuevosDispositivos);
        setShowEditModal(false);
      } else {
        setError(data.message || 'Error al actualizar el dispositivo');
      }
    } catch (err) {
      setError('Error de conexión al actualizar el dispositivo');
      console.error(err);
    }
  };
  
  // Función para abrir modal de confirmación de eliminación
  const confirmarEliminacion = (dispositivo) => {
    setDispositivoEliminando(dispositivo);
    setShowDeleteModal(true);
  };
  
  // Función para eliminar dispositivo
  const eliminarDispositivo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dispositivos-usuario/${dispositivoEliminando._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Eliminar el dispositivo de la lista
        const nuevosDispositivos = dispositivos.filter(d => d._id !== dispositivoEliminando._id);
        setDispositivos(nuevosDispositivos);
        setShowDeleteModal(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al eliminar el dispositivo');
      }
    } catch (err) {
      setError('Error de conexión al eliminar el dispositivo');
      console.error(err);
    }
  };
  
  // Función para abrir la página de control del dispensador
  const irAControlDispensador = (id) => {
    navigate(`/Estado-Dispensador?id=${id}`);
  };
  
  // Renderizar icono según tipo de mascota
  const renderIconoMascota = (tipo) => {
    switch (tipo) {
      case 'perro':
        return <FaDog className="text-primary" />;
      case 'gato':
        return <FaCat className="text-warning" />;
      default:
        return <FaPaw className="text-secondary" />;
    }
  };
  
  return (
    <div className="mis-dispositivos-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Dispensadores</h2>
        <Button 
          variant="primary"
          onClick={() => setMostrarRegistro(!mostrarRegistro)}
        >
          {mostrarRegistro ? 'Ocultar Formulario' : 'Registrar Nuevo Dispensador'}
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {mostrarRegistro && (
        <div className="mb-4">
          <RegistroDispositivo 
            onRegistroExitoso={handleRegistroExitoso}
          />
        </div>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando tus dispositivos...</p>
        </div>
      ) : dispositivos.length === 0 ? (
        <Alert variant="info">
          No tienes dispensadores registrados. ¡Registra uno nuevo para comenzar!
        </Alert>
      ) : (
        <div className="row">
          {dispositivos.map(dispositivo => (
            <div key={dispositivo._id} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{dispositivo.nombre}</h5>
                  <Badge 
                    bg={dispositivo.estado?.activo ? "success" : "secondary"}
                  >
                    {dispositivo.estado?.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>MAC:</strong> {dispositivo.macAddress}
                  </div>
                  
                  {dispositivo.mascota && dispositivo.mascota.nombre && (
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        {renderIconoMascota(dispositivo.mascota.tipo)}
                        <strong className="ms-2">Mascota:</strong>
                      </div>
                      <ul className="list-unstyled ms-3">
                        <li>Nombre: {dispositivo.mascota.nombre}</li>
                        {dispositivo.mascota.raza && <li>Raza: {dispositivo.mascota.raza}</li>}
                        {dispositivo.mascota.peso && <li>Peso: {dispositivo.mascota.peso} kg</li>}
                        {dispositivo.mascota.edad && <li>Edad: {dispositivo.mascota.edad} meses</li>}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <strong>Configuración:</strong>
                    <ul className="list-unstyled ms-3">
                      <li>Cantidad de dispensación: {dispositivo.configuracion?.cantidadDispensacion || 50}g</li>
                      <li>Última conexión: {dispositivo.estado?.ultimaConexion ? new Date(dispositivo.estado.ultimaConexion).toLocaleString() : 'Nunca'}</li>
                    </ul>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary"
                      onClick={() => abrirModalEdicion(dispositivo)}
                      className="btn-sm"
                    >
                      <FaEdit /> Editar
                    </Button>
                    
                    <Button 
                      variant="outline-danger"
                      onClick={() => confirmarEliminacion(dispositivo)}
                      className="btn-sm"
                    >
                      <FaTrash /> Eliminar
                    </Button>
                    
                    <Button 
                      variant="primary"
                      onClick={() => irAControlDispensador(dispositivo._id)}
                      className="btn-sm"
                    >
                      <FaCog className="me-1" /> Controlar
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Dispensador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Dispensador</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Dispensación (gramos)</Form.Label>
              <Form.Control
                type="number"
                value={formData.cantidadDispensacion}
                onChange={(e) => setFormData({...formData, cantidadDispensacion: e.target.value})}
                required
                min="10"
                max="500"
              />
              <Form.Text className="text-muted">
                Cantidad de alimento a dispensar (entre 10g y 500g)
              </Form.Text>
            </Form.Group>
            
            <h6 className="mb-3">Información de la Mascota</h6>
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Mascota</Form.Label>
              <Form.Control
                type="text"
                value={formData.mascota.nombre}
                onChange={(e) => setFormData({
                  ...formData, 
                  mascota: {...formData.mascota, nombre: e.target.value}
                })}
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Mascota</Form.Label>
                  <Form.Select
                    value={formData.mascota.tipo}
                    onChange={(e) => setFormData({
                      ...formData, 
                      mascota: {...formData.mascota, tipo: e.target.value}
                    })}
                  >
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Raza</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.mascota.raza}
                    onChange={(e) => setFormData({
                      ...formData, 
                      mascota: {...formData.mascota, raza: e.target.value}
                    })}
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.mascota.peso}
                    onChange={(e) => setFormData({
                      ...formData, 
                      mascota: {...formData.mascota, peso: e.target.value}
                    })}
                    min="0"
                    step="0.1"
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Edad (meses)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.mascota.edad}
                    onChange={(e) => setFormData({
                      ...formData, 
                      mascota: {...formData.mascota, edad: e.target.value}
                    })}
                    min="0"
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas desvincular el dispensador "{dispositivoEliminando?.nombre}"?</p>
          <Alert variant="warning">
            Esta acción no eliminará el dispositivo de la base de datos, solo lo desvinculará de tu cuenta.
            El dispositivo podrá ser registrado nuevamente por cualquier usuario.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarDispositivo}>
            Confirmar Eliminación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MisDispositivos;