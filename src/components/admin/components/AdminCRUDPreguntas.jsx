import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminCRUDPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPregunta, setCurrentPregunta] = useState({
    pregunta: '',
    respuesta: '',
    icono: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Cargar preguntas
  const cargarPreguntas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/preguntas');
      if (!response.ok) {
        throw new Error('Error al cargar las preguntas');
      }
      const data = await response.json();
      setPreguntas(data);
    } catch (error) {
      setError('Error al cargar las preguntas');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    cargarPreguntas();
  }, []);

  // Abrir modal para agregar nueva pregunta
  const handleAgregar = () => {
    setCurrentPregunta({ pregunta: '', respuesta: '', icono: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar pregunta
  const handleEditar = (pregunta) => {
    setCurrentPregunta(pregunta);
    setIsEditing(true);
    setShowModal(true);
  };

  // Eliminar pregunta
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/preguntas/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la pregunta');
        }

        cargarPreguntas();
      } catch (error) {
        setError('Error al eliminar la pregunta');
        console.error('Error:', error);
      }
    }
  };

  // Guardar o actualizar pregunta
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/preguntas/${currentPregunta._id}` 
        : 'http://localhost:5000/api/preguntas';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPregunta),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la pregunta');
      }

      cargarPreguntas();
      setShowModal(false);
    } catch (error) {
      setError('Error al guardar la pregunta');
      console.error('Error:', error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPregunta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <h2 className="my-4">Administración de Preguntas Frecuentes</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Button 
        variant="success" 
        onClick={handleAgregar} 
        className="mb-3"
      >
        <FaPlus /> Agregar Nueva Pregunta
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ícono</th>
            <th>Pregunta</th>
            <th>Respuesta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((pregunta) => (
            <tr key={pregunta._id}>
              <td>{pregunta.icono}</td>
              <td>{pregunta.pregunta}</td>
              <td>{pregunta.respuesta.substring(0, 50)}...</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  onClick={() => handleEditar(pregunta)}
                  className="me-2"
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleEliminar(pregunta._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/editar pregunta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Pregunta' : 'Agregar Nueva Pregunta'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGuardar}>
            <Form.Group className="mb-3">
              <Form.Label>Ícono</Form.Label>
              <Form.Control
                type="text"
                name="icono"
                value={currentPregunta.icono}
                onChange={handleChange}
                placeholder="Ejemplo: 📦"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pregunta</Form.Label>
              <Form.Control
                type="text"
                name="pregunta"
                value={currentPregunta.pregunta}
                onChange={handleChange}
                required
                placeholder="Escribe la pregunta"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Respuesta</Form.Label>
              <Form.Control
                as="textarea"
                name="respuesta"
                value={currentPregunta.respuesta}
                onChange={handleChange}
                required
                placeholder="Escribe la respuesta"
                rows={3}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminCRUDPreguntas;