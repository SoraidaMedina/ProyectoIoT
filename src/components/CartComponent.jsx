import React, { useRef, useEffect } from "react";
import { FaShoppingCart, FaTimes, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

// Este componente solo se usará en la página de Tienda
const CartComponent = ({ showButton = true }) => {
  const navigate = useNavigate(); // Hook para navegación
  
  const { 
    carrito, 
    carritoAbierto, 
    setCarritoAbierto,
    toggleCarrito, 
    eliminarDelCarrito, 
    cambiarCantidad,
    calcularTotal,
    getCantidadTotal
  } = useCartContext();
  
  const carritoRef = useRef(null);
  
  // Función para obtener URL de imagen
  const getImageUrl = (producto) => {
    // Si ya es una URL de Cloudinary, la usamos directamente
    if (producto.imagenUrl && (
      producto.imagenUrl.includes('cloudinary.com') || 
      producto.imagenUrl.startsWith('http')
    )) {
      return producto.imagenUrl;
    } 
    // Fallback para rutas locales antiguas
    else if (producto.imagenUrl) {
      return `http://localhost:5000${producto.imagenUrl.startsWith('/') ? producto.imagenUrl : '/' + producto.imagenUrl}`;
    }
    // Fallback para campo imagen antiguo
    else if (producto.imagen) {
      return `http://localhost:5000/uploads/${producto.imagen}`;
    }
    // Imagen por defecto en Cloudinary
    else {
      return "https://res.cloudinary.com/dozphinph/image/upload/v1710777777/products/default-product_abcdef.jpg";
    }
  };

  // Cerrar el carrito al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carritoAbierto && carritoRef.current && !carritoRef.current.contains(event.target)) {
        setCarritoAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [carritoAbierto, setCarritoAbierto]);

  // Función para manejar el botón "Seguir Comprando"
  const handleSeguirComprando = () => {
    // Cerrar el panel del carrito
    setCarritoAbierto(false);
    
    // Opcional: Hacer scroll a la sección de productos
    const productosGrid = document.querySelector("[style*='productosGrid']");
    if (productosGrid) {
      productosGrid.scrollIntoView({ behavior: "smooth" });
    }
    
    // Mostrar notificación
    if (window.mostrarNotificacion) {
      window.mostrarNotificacion("Continúa explorando nuestros productos", "info");
    }
  };

  // Función para abrir el checkout
  const abrirCheckoutDesdeCarrito = () => {
    // Cerrar el panel del carrito
    setCarritoAbierto(false);
    
    // Usar la función global definida en Tienda.jsx
    // Para evitar problemas de timing, usamos setTimeout
    setTimeout(() => {
      if (window.abrirCheckout) {
        window.abrirCheckout();
      }
    }, 300);
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      {showButton && (
        <div onClick={toggleCarrito} style={styles.iconoCarrito}>
          <FaShoppingCart style={styles.carrito} />
          {getCantidadTotal() > 0 && (
            <span style={styles.contadorCarrito}>
              {getCantidadTotal()}
            </span>
          )}
        </div>
      )}

      {/* Panel del carrito */}
      {carritoAbierto && (
        <div style={styles.carritoOverlay}>
          <div ref={carritoRef} style={styles.carritoPanel}>
            <div style={styles.carritoHeader}>
              <h2 style={styles.carritoTitulo}>Mi Carrito</h2>
              <button style={styles.cerrarCarrito} onClick={() => setCarritoAbierto(false)}>
                <FaTimes />
              </button>
            </div>

            {carrito.length === 0 ? (
              <div style={styles.carritoVacio}>
                <p style={{fontSize: "18px", fontWeight: "bold"}}>Tu carrito está vacío</p>
                <p style={styles.carritoVacioSubtexto}>Añade productos a tu carrito para comenzar a comprar</p>
                <button 
                  onClick={handleSeguirComprando} 
                  style={styles.btnSeguirComprando}
                >
                  <FaArrowLeft style={{marginRight: "8px"}} /> Volver a la tienda
                </button>
              </div>
            ) : (
              <>
                <div style={styles.carritoItems}>
                  {carrito.map((item) => (
                    <div key={item._id} style={styles.carritoItem}>
                      {/* Imagen del producto */}
                      <img 
                        src={getImageUrl(item)}
                        alt={item.nombre}
                        style={styles.carritoItemImagen}
                        onError={(e) => { 
                          e.target.src = "https://res.cloudinary.com/dozphinph/image/upload/v1710777777/products/default-product_abcdef.jpg"; 
                        }}
                      />
                      
                      <div style={styles.carritoItemInfo}>
                        <h4 style={styles.carritoItemNombre}>{item.nombre}</h4>
                        <p style={styles.carritoItemPrecio}>{item.precio} EUR</p>
                      </div>
                      
                      <div style={styles.carritoItemCantidad}>
                        <button 
                          style={styles.btnCantidad}
                          onClick={() => cambiarCantidad(item._id, item.cantidad - 1)}
                        >-</button>
                        <span style={styles.cantidadNumero}>{item.cantidad}</span>
                        <button 
                          style={styles.btnCantidad}
                          onClick={() => cambiarCantidad(item._id, item.cantidad + 1)}
                        >+</button>
                      </div>
                      
                      <button
                        style={styles.btnEliminar}
                        onClick={() => eliminarDelCarrito(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div style={styles.carritoFooter}>
                  <div style={styles.carritoTotal}>
                    <span style={styles.carritoTotalTexto}>Total:</span>
                    <span style={styles.carritoTotalPrecio}>{calcularTotal()} EUR</span>
                  </div>
                  
                  <button 
                    style={styles.btnSeguirComprando}
                    onClick={handleSeguirComprando}
                  >
                    Seguir Comprando
                  </button>
                  
                  <button 
                    style={styles.btnFinalizarCompra}
                    onClick={abrirCheckoutDesdeCarrito}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  /* ======= Icono flotante del carrito ======= */
  iconoCarrito: {
    position: "fixed",
    right: "20px",
    top: "100px",
    cursor: "pointer",
    fontSize: "1.8rem",
    color: "white",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 999,
    transition: "transform 0.2s ease",
  },

  carrito: {
    fontSize: "1.8rem",
  },

  contadorCarrito: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#ff6b6b",
    color: "white",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },

  /* ======= Panel del carrito ======= */
  carritoOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },

  carritoPanel: {
    width: "400px",
    maxWidth: "90%",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    animation: "slideInRight 0.3s ease-out",
  },

  carritoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f8f8f8",
  },

  carritoTitulo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },

  cerrarCarrito: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#666",
  },

  carritoVacio: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    height: "50%",
    textAlign: "center",
  },

  carritoVacioSubtexto: {
    color: "#888",
    marginTop: "10px",
    marginBottom: "30px",
  },

  carritoItems: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },

  carritoItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
  },

  carritoItemImagen: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    marginRight: "15px",
    border: "1px solid #eee",
  },

  carritoItemInfo: {
    flex: 1,
  },

  carritoItemNombre: {
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    color: "#333",
  },

  carritoItemPrecio: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
    fontWeight: "bold",
  },

  carritoItemCantidad: {
    display: "flex",
    alignItems: "center",
    margin: "0 15px",
  },

  btnCantidad: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  cantidadNumero: {
    margin: "0 10px",
    fontWeight: "bold",
    fontSize: "16px",
  },

  btnEliminar: {
    background: "none",
    border: "none",
    color: "#ff6b6b",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
  },

  carritoFooter: {
    padding: "20px",
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#f8f8f8",
  },

  carritoTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px 0",
    borderBottom: "2px solid #eee",
  },

  carritoTotalTexto: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },

  carritoTotalPrecio: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#4CAF50",
  },

  btnSeguirComprando: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ffcc00",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  btnFinalizarCompra: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },

  /* ======= Animaciones ======= */
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },

  "@keyframes slideInRight": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" }
  }
};

export default CartComponent;