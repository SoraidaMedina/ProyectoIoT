// components/ConfirmacionPedido.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck, FaBoxOpen, FaTruck, FaHome } from 'react-icons/fa';

const ConfirmacionPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar datos del pedido
    const cargarPedido = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pedidos/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el pedido');
        }
        
        const data = await response.json();
        setPedido(data);
      } catch (err) {
        console.error('Error al cargar el pedido:', err);
        setError('Lo sentimos, no pudimos encontrar tu pedido');
      } finally {
        setCargando(false);
      }
    };
    
    cargarPedido();
  }, [id]);

  if (cargando) {
    return <div>Cargando detalles del pedido...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/tienda">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div style={styles.confirmacionContainer}>
      <div style={styles.confirmacionBox}>
        <div style={styles.iconoExito}>
          <FaCheck size={50} />
        </div>
        
        <h1 style={styles.tituloConfirmacion}>¡Pedido Confirmado!</h1>
        
        <p style={styles.mensaje}>
          Gracias por tu compra. Tu pedido ha sido procesado correctamente.
        </p>
        
        <div style={styles.detallesPedido}>
          <h2>Detalles del Pedido</h2>
          <p><strong>Número de Referencia:</strong> {pedido.numeroReferencia}</p>
          <p><strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
          <p><strong>Total:</strong> {pedido.total.toFixed(2)} EUR</p>
          
          <div style={styles.divider}></div>
          
          <h3>Productos</h3>
          <div style={styles.productosList}>
            {pedido.productos.map((producto, index) => (
              <div key={index} style={styles.productoItem}>
                <div style={styles.productoInfo}>
                  <p style={styles.productoNombre}>{producto.nombre}</p>
                  <p style={styles.productoCantidad}>Cantidad: {producto.cantidad}</p>
                </div>
                <p style={styles.productoPrecio}>
                  {(producto.precio * producto.cantidad).toFixed(2)} EUR
                </p>
              </div>
            ))}
          </div>
          
          <div style={styles.divider}></div>
          
          <h3>Datos de Envío</h3>
          <p><strong>Nombre:</strong> {pedido.datosCliente.nombre}</p>
          <p><strong>Dirección:</strong> {pedido.datosCliente.direccion}</p>
          <p><strong>Método de envío:</strong> {pedido.datosCliente.metodoEnvio === 'express' ? 'Express (1-2 días)' : 'Normal (3-5 días)'}</p>
          <p><strong>Método de pago:</strong> {pedido.datosCliente.metodoPago === 'contraentrega' ? 'Pago contra entrega' : 'Transferencia bancaria'}</p>
        </div>
        
        <div style={styles.pasos}>
          <div style={styles.paso}>
            <div style={styles.iconoPaso}>
              <FaBoxOpen />
            </div>
            <div>
              <h4>Preparando tu pedido</h4>
              <p>Estamos preparando tus productos</p>
            </div>
          </div>
          
          <div style={styles.paso}>
            <div style={styles.iconoPaso}>
              <FaTruck />
            </div>
            <div>
              <h4>En camino</h4>
              <p>Pronto recibirás un email con la información de seguimiento</p>
            </div>
          </div>
          
          <div style={styles.paso}>
            <div style={styles.iconoPaso}>
              <FaHome />
            </div>
            <div>
              <h4>Entrega</h4>
              <p>Tu pedido será entregado en la dirección indicada</p>
            </div>
          </div>
        </div>
        
        <Link to="/tienda" style={styles.botonVolver}>
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
};

const styles = {
  // Estilos para la página de confirmación
  confirmacionContainer: {
    padding: '40px 20px',
    backgroundColor: '#FFF2DB',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  confirmacionBox: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center'
  },
  iconoExito: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
    color: 'white'
  },
  tituloConfirmacion: {
    color: '#1f2427',
    fontSize: '2rem',
    marginBottom: '15px'
  },
  mensaje: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '30px'
  },
  detallesPedido: {
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  divider: {
    height: '1px',
    backgroundColor: '#ddd',
    margin: '20px 0'
  },
  productosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  productoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  productoInfo: {
    flex: 1
  },
  productoNombre: {
    fontWeight: 'bold',
    margin: '0 0 5px 0'
  },
  productoCantidad: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0
  },
  productoPrecio: {
    fontWeight: 'bold'
  },
  pasos: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  paso: {
    flex: '1 1 30%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    textAlign: 'left'
  },
  iconoPaso: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#1f2427',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  botonVolver: {
    display: 'inline-block',
    padding: '12px 25px',
    backgroundColor: '#ffcc00',
    color: '#1f2427',
    fontWeight: 'bold',
    borderRadius: '5px',
    textDecoration: 'none',
    marginTop: '20px',
    transition: 'background-color 0.2s ease'
  }
};

export default ConfirmacionPedido;