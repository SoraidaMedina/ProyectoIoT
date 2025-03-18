import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminCRUDPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [formData, setFormData] = useState({
    estado: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Obtener todos los pedidos al cargar
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      console.log("Intentando obtener pedidos...");
      
      // Usando URL absoluta en lugar de relativa
      const response = await fetch("http://localhost:5000/api/admin/pedidos");
      
      if (!response.ok) {
        const text = await response.text();
        console.error("Error en la respuesta:", text);
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos recibidos:", data);
      setPedidos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setError("Error al cargar los pedidos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Abrir modal para editar
  const handleEdit = (pedido) => {
    setCurrentPedido(pedido);
    setFormData({
      estado: pedido.estado,
    });
    setShowModal(true);
  };

  // Ver detalles del pedido
  const handleVerDetalles = (pedido) => {
    setCurrentPedido(pedido);
    setShowDetalleModal(true);
  };

  // Actualizar pedido
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Usando URL absoluta en lugar de relativa
      const response = await fetch(`http://localhost:5000/api/admin/pedidos/${currentPedido._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error en la respuesta:", text);
        throw new Error(`Error: ${response.status}`);
      }

      setSuccess("Pedido actualizado correctamente");
      fetchPedidos();
      setShowModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      setError("Error al actualizar el pedido");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar pedido
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
      try {
        setLoading(true);
        // Usando URL absoluta en lugar de relativa
        const response = await fetch(`http://localhost:5000/api/admin/pedidos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Error en la respuesta:", text);
          throw new Error(`Error: ${response.status}`);
        }

        setSuccess("Pedido eliminado correctamente");
        fetchPedidos();
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error al eliminar pedido:", error);
        setError("Error al eliminar el pedido");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para obtener color del badge según estado
  const getBadgeVariant = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "procesando":
        return "info";
      case "enviado":
        return "primary";
      case "entregado":
        return "success";
      case "cancelado":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Formatear fecha
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-fluid mt-4">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white">
          <h2>Administración de Pedidos</h2>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="bg-light">
                  <tr>
                    <th>Referencia</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                      <tr key={pedido._id}>
                        <td>{pedido.numeroReferencia}</td>
                        <td>{pedido.datosCliente?.nombre}</td>
                        <td>{formatFecha(pedido.fechaCreacion)}</td>
                        <td>${pedido.total?.toFixed(2)}</td>
                        <td>
                          <Badge bg={getBadgeVariant(pedido.estado)}>
                            {pedido.estado}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="info" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleVerDetalles(pedido)}
                          >
                            <FaEye /> Ver
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleEdit(pedido)}
                          >
                            <FaEdit /> Editar
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(pedido._id)}
                          >
                            <FaTrash /> Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No hay pedidos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Estado del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Estado del Pedido</Form.Label>
              <Form.Select 
                name="estado" 
                value={formData.estado} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar estado...</option>
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Detalles */}
      <Modal 
        show={showDetalleModal} 
        onHide={() => setShowDetalleModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPedido && (
            <>
              <h5>Información del Pedido</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Referencia:</strong> {currentPedido.numeroReferencia}</p>
                  <p><strong>Fecha:</strong> {formatFecha(currentPedido.fechaCreacion)}</p>
                  <p><strong>Estado:</strong> <Badge bg={getBadgeVariant(currentPedido.estado)}>{currentPedido.estado}</Badge></p>
                  <p><strong>Total:</strong> ${currentPedido.total?.toFixed(2)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Cliente:</strong> {currentPedido.datosCliente?.nombre}</p>
                  <p><strong>Email:</strong> {currentPedido.datosCliente?.email}</p>
                  <p><strong>Teléfono:</strong> {currentPedido.datosCliente?.telefono}</p>
                  <p><strong>Dirección:</strong> {currentPedido.datosCliente?.direccion}</p>
                </Col>
              </Row>

              <h5>Detalles de la Compra</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPedido.productos.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.imagenUrl && (
                            <img 
                              src={item.imagenUrl} 
                              alt={item.nombre} 
                              style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                            />
                          )}
                          {item.nombre}
                        </div>
                      </td>
                      <td>${item.precio?.toFixed(2)}</td>
                      <td>{item.cantidad}</td>
                      <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>${currentPedido.total?.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>

              <h5>Información de Envío y Pago</h5>
              <Row>
                <Col md={6}>
                  <p><strong>Método de Envío:</strong> {currentPedido.datosCliente?.metodoEnvio === 'express' ? 'Express' : 'Normal'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Método de Pago:</strong> {currentPedido.datosCliente?.metodoPago === 'contraentrega' ? 'Contra entrega' : 'Transferencia'}</p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCRUDPedidos;