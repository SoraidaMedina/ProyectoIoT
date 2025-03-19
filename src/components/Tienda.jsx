import React, { useEffect, useState, useRef } from "react";
import { FaInfoCircle, FaTruck, FaStar, FaTimes, FaArrowLeft, FaArrowRight, FaSearch, FaFilter, FaShoppingCart, FaTrash, FaCheckCircle, FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext"; // Importamos el contexto de usuario
import { useCartContext } from "../context/CartContext"; // Importamos el contexto del carrito
import CartComponent from "./CartComponent"; // Importamos el componente del carrito

const Tienda = () => {
  const navigate = useNavigate();
  const { user } = useUserContext(); // Obtenemos el usuario actual
  
  // Usamos el contexto del carrito en lugar de estados locales
  const { 
    carrito, 
    carritoAbierto, 
    setCarritoAbierto,
    toggleCarrito, 
    agregarAlCarrito, 
    eliminarDelCarrito, 
    cambiarCantidad,
    calcularTotal,
  } = useCartContext();
  
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(8); // 8 productos por página (4 arriba y 4 abajo)
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  // Mantenemos estos estados locales para el checkout
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: "", tipo: "" });
  const [procesandoPedido, setProcesandoPedido] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    metodoEnvio: "normal",
    metodoPago: "contraentrega"
  });
  
  // Referencias para cerrar modales al hacer clic fuera
  const checkoutRef = useRef(null);

  // Llenar automáticamente los datos de envío cuando hay un usuario logueado
  useEffect(() => {
    if (user) {
      setDatosEnvio({
        nombre: `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno || ''}`.trim(),
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        metodoEnvio: "normal",
        metodoPago: "contraentrega"
      });
    }
  }, [user]);

  // Obtener los productos desde la API
  useEffect(() => {
    fetch("http://localhost:5000/api/tienda")
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Productos recibidos:", data);
        setProductos(data);
        setProductosFiltrados(data);
        
        // Extraer todas las categorías únicas
        const todasCategorias = [...new Set(data.map(producto => producto.categoria))];
        setCategorias(todasCategorias);
        
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener los productos:", error);
        setIsLoading(false);
      });
  }, []);

  // Función para manejar URLs de imágenes (Cloudinary o locales)
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

  // Función para filtrar productos basados en la búsqueda y categoría
  useEffect(() => {
    let resultado = productos;
    
    // Filtrar por término de búsqueda
    if (busqueda.trim() !== "") {
      resultado = resultado.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(producto => producto.categoria === categoriaSeleccionada);
    }
    
    setProductosFiltrados(resultado);
    setPaginaActual(1); // Volver a la primera página al cambiar filtros
  }, [busqueda, categoriaSeleccionada, productos]);

  // Cerrar modal de checkout al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkoutAbierto && checkoutRef.current && !checkoutRef.current.contains(event.target)) {
        setCheckoutAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [checkoutAbierto]);

  // Mostrar notificación con temporizador para ocultarla
  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, mensaje: "", tipo: "" });
    }, 3000);
  };
  
  // Hacemos la función accesible desde fuera del componente
  window.mostrarNotificacion = mostrarNotificacion;

  // Función para manejar la búsqueda
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  // Función para manejar cambio de categoría
  const manejarCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  // Función para abrir el modal con los detalles del producto
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  // Función para abrir el checkout
  const abrirCheckout = () => {
    if (carrito.length === 0) {
      mostrarNotificacion("Tu carrito está vacío", "error");
      return;
    }
    
    setCheckoutAbierto(true);
    setCarritoAbierto(false);
  };
  
  // IMPORTANTE: Hacemos la función accesible desde fuera del componente
  // Esta línea es clave para que el botón "Finalizar Compra" del CartComponent funcione
  window.abrirCheckout = abrirCheckout;

  // Manejar cambios en el formulario de checkout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosEnvio({
      ...datosEnvio,
      [name]: value
    });
  };

  // Procesar la orden - Función actualizada para enviar datos al backend
  const procesarOrden = async (e) => {
    e.preventDefault();
    
    if (carrito.length === 0) {
      mostrarNotificacion("Tu carrito está vacío", "error");
      return;
    }
    
    try {
      // Indicar que estamos procesando el pedido
      setProcesandoPedido(true);
      
      // Preparar los datos del pedido
      const pedidoData = {
        productos: carrito.map(item => ({
          productoId: item._id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          imagenUrl: getImageUrl(item) // Usar la función de manejo de URLs
        })),
        datosCliente: datosEnvio,
        // Si el usuario está logueado, incluir su ID
        ...(user && { usuarioId: user._id })
      };
      
      // Enviar al backend
      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Mostrar notificación de éxito
        mostrarNotificacion(`¡Pedido realizado con éxito! Referencia: ${data.pedido.numeroReferencia}`);
        
        // Vaciar carrito - Usamos la función del contexto global
        // Aquí necesitaríamos acceder a la función vaciarCarrito del contexto
        // Por ahora, podemos simplemente limpiar los productos uno a uno
        carrito.forEach(item => eliminarDelCarrito(item._id));
        
        // Cerrar checkout y resetear datos
        setCheckoutAbierto(false);
        setDatosEnvio({
          nombre: user ? `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno || ''}`.trim() : "",
          email: user ? user.email : "",
          telefono: user ? user.telefono || "" : "",
          direccion: user ? user.direccion || "" : "",
          metodoEnvio: "normal",
          metodoPago: "contraentrega"
        });
        
        // Guardar referencia del pedido
        localStorage.setItem('ultimoPedido', data.pedido._id);
        
        // Redirigir a página de confirmación
        navigate(`/confirmacion/${data.pedido._id}`);
      } else {
        throw new Error(data.mensaje || 'Error al procesar el pedido');
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      mostrarNotificacion("Error al procesar el pedido: " + error.message, "error");
    } finally {
      setProcesandoPedido(false);
    }
  };

  // Calcular los productos que se deben mostrar en la página actual
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  // Cambiar a la página siguiente
  const paginaSiguiente = () => {
    if (paginaActual < Math.ceil(productosFiltrados.length / productosPorPagina)) {
      setPaginaActual(paginaActual + 1);
    }
  };

  // Cambiar a la página anterior
  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.body}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div style={styles.body}>
      {/* Componente de carrito flotante */}
      <CartComponent />
      
      {/* Notificación flotante */}
      {notificacion.visible && (
        <div style={{
          ...styles.notificacion,
          backgroundColor: notificacion.tipo === "error" ? "#ff6b6b" : 
                          notificacion.tipo === "info" ? "#3498db" : "#4CAF50"
        }}>
          {notificacion.tipo === "success" && <FaCheckCircle style={{ marginRight: "8px" }} />}
          {notificacion.mensaje}
        </div>
      )}
      
      <div style={styles.tiendaContainer}>
        {/* Header con título */}
        <div style={styles.barraNavegacion}>
          <h2 style={styles.tituloTienda}>🐾 Nuestra Tienda 🐾</h2>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div style={styles.filtrosContainer}>
          <div style={styles.barraBusqueda}>
            <FaSearch style={styles.iconoBusqueda} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={manejarBusqueda}
              style={styles.inputBusqueda}
            />
          </div>
          
          <div style={styles.filtroCategoria}>
            <FaFilter style={styles.iconoFiltro} />
            <select 
              value={categoriaSeleccionada} 
              onChange={manejarCategoria}
              style={styles.selectCategoria}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Mostrar resultados de búsqueda */}
        <div style={styles.resultadosBusqueda}>
          {productosFiltrados.length === 0 ? (
            <p style={styles.noResultados}>No se encontraron productos</p>
          ) : (
            <p>Mostrando {productosFiltrados.length} productos</p>
          )}
        </div>

        {/* Grid de productos (4 arriba y 4 abajo) */}
        <div style={styles.productosGrid}>
          {productosActuales.map((producto) => (
            <div style={styles.productoCard} key={producto._id}>
              {/* Etiqueta de Oferta */}
              {producto.oferta && <span style={styles.ofertaLabel}>OFERTA</span>}

              {/* Etiqueta "Más Vendido" */}
              {producto.masVendido && <span style={styles.masVendido}>🔥 Más Vendido</span>}
              
              {/* Etiqueta de Categoría */}
              {producto.categoria && <span style={styles.categoriaLabel}>{producto.categoria}</span>}

              {/* Imagen del producto - ACTUALIZADA PARA CLOUDINARY */}
              <img
                src={getImageUrl(producto)}
                alt={producto.nombre}
                style={styles.productoImagen}
                onError={(e) => { 
                  e.target.src = "https://res.cloudinary.com/dozphinph/image/upload/v1710777777/products/default-product_abcdef.jpg"; 
                }}
              />

              {/* Información del producto */}
              <div style={styles.productoInfo}>
                <h5 style={styles.productoTitulo}>{producto.nombre}</h5>
                <p style={styles.productoDescripcion}>{producto.descripcion}</p>

                {/* Precio */}
                <p style={styles.productoPrecio}>
                  {producto.precio} EUR
                </p>

                {/* Estrellas de calificación */}
                {producto.estrellas && (
                  <div style={styles.estrellas}>
                    {[...Array(producto.estrellas)].map((_, i) => (
                      <FaStar key={i} style={styles.estrella} />
                    ))}
                  </div>
                )}

                {/* Envío gratis */}
                {producto.envioGratis && <p style={styles.envioGratis}><FaTruck /> Envío Gratis</p>}
              </div>

              {/* Botones */}
              <div style={styles.botones}>
                <button style={styles.btnVer} onClick={() => abrirModal(producto)}>
                  <FaInfoCircle style={{ marginRight: "5px" }} /> Ver Detalles
                </button>
                
                {/* Botón para añadir al carrito */}
                <button 
                  style={styles.btnAgregar} 
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito(producto);
                    // Mostramos notificación usando la función local
                    mostrarNotificacion(`${producto.nombre} añadido al carrito`);
                  }}
                >
                  <FaShoppingCart style={{ marginRight: "5px" }} /> Añadir al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
        <div style={styles.paginacion}>
          <button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            style={{
              ...styles.botonPaginacion,
              opacity: paginaActual === 1 ? 0.5 : 1
            }}
          >
            <FaArrowLeft />
          </button>
          <span style={styles.paginaActual}>
            Página {paginaActual} de {Math.ceil(productosFiltrados.length / productosPorPagina)}
          </span>
          <button
            onClick={paginaSiguiente}
            disabled={paginaActual === Math.ceil(productosFiltrados.length / productosPorPagina)}
            style={{
              ...styles.botonPaginacion,
              opacity: paginaActual === Math.ceil(productosFiltrados.length / productosPorPagina) ? 0.5 : 1
            }}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Modal para mostrar detalles del producto */}
      {modalAbierto && productoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Botón para cerrar el modal */}
            <button style={styles.cerrarModal} onClick={cerrarModal}>
              <FaTimes />
            </button>

            {/* Título del producto */}
            <h2 style={styles.modalTitulo}>{productoSeleccionado.nombre}</h2>

            {/* Imagen del producto - ACTUALIZADA PARA CLOUDINARY */}
            <img
              src={getImageUrl(productoSeleccionado)}
              alt={productoSeleccionado.nombre}
              style={styles.modalImagen}
              onError={(e) => { 
                e.target.src = "https://res.cloudinary.com/dozphinph/image/upload/v1710777777/products/default-product_abcdef.jpg"; 
              }}
            />

            {/* Categoría */}
            {productoSeleccionado.categoria && (
              <p style={styles.modalCategoria}>
                <strong>Categoría:</strong> {productoSeleccionado.categoria}
              </p>
            )}

            {/* Descripción del producto */}
            <p style={styles.modalDescripcion}>{productoSeleccionado.descripcion}</p>

            {/* Precio (solo se muestra en el modal) */}
            <p style={styles.modalPrecio}>
              <strong>Precio:</strong> {productoSeleccionado.precio} EUR
            </p>

            {/* Envío gratis */}
            {productoSeleccionado.envioGratis && (
              <p style={styles.modalEnvioGratis}>
                <FaTruck /> Envío Gratis
              </p>
            )}

            {/* Estrellas de calificación */}
            {productoSeleccionado.estrellas && (
              <div style={styles.modalEstrellas}>
                {[...Array(productoSeleccionado.estrellas)].map((_, i) => (
                  <FaStar key={i} style={styles.estrella} />
                ))}
              </div>
            )}

            {/* Botón para añadir al carrito desde el modal */}
            <button 
              style={styles.btnAgregar}
              onClick={() => {
                agregarAlCarrito(productoSeleccionado);
                mostrarNotificacion(`${productoSeleccionado.nombre} añadido al carrito`);
                cerrarModal();
              }}
            >
              <FaShoppingCart style={{ marginRight: "5px" }} /> Añadir al Carrito
            </button>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {checkoutAbierto && (
        <div style={styles.modalOverlay}>
          <div ref={checkoutRef} style={styles.modalCheckout}>
            <button style={styles.cerrarModal} onClick={() => setCheckoutAbierto(false)}>
              <FaTimes />
            </button>
            
            <h2 style={styles.checkoutTitulo}>Finalizar Compra</h2>
            
            <div style={styles.checkoutSecciones}>
              {/* Sección Resumen del Pedido */}
              <div style={styles.checkoutSeccion}>
                <h3 style={styles.checkoutSubtitulo}>Resumen del pedido</h3>
                
                <div style={styles.resumenPedido}>
                  {carrito.map(item => (
                    <div key={item._id} style={styles.resumenItem}>
                      <div style={styles.resumenItemInfo}>
                        <span style={styles.resumenItemNombre}>{item.nombre}</span>
                        <span style={styles.resumenItemCantidad}>x{item.cantidad}</span>
                      </div>
                      <span style={styles.resumenItemPrecio}>{(item.precio * item.cantidad).toFixed(2)} EUR</span>
                    </div>
                  ))}
                  
                  {datosEnvio.metodoEnvio === "express" && (
                    <div style={styles.resumenItem}>
                      <div style={styles.resumenItemInfo}>
                        <span style={styles.resumenItemNombre}>Envío Express</span>
                      </div>
                      <span style={styles.resumenItemPrecio}>5.00 EUR</span>
                    </div>
                  )}
                  
                  <div style={styles.resumenTotal}>
                    <span style={styles.resumenTotalTexto}>Total:</span>
                    <span style={styles.resumenTotalPrecio}>
                      {calcularTotal(datosEnvio.metodoEnvio === "express" ? 5 : 0)} EUR
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Sección Datos de Envío */}
              <div style={styles.checkoutSeccion}>
                <h3 style={styles.checkoutSubtitulo}>Datos de envío</h3>
                
                <form style={styles.checkoutForm} onSubmit={procesarOrden}>
                  {/* Mostrar información del usuario si está logueado */}
                  {user ? (
                    <div style={styles.usuarioLogueado}>
                      <div style={styles.infoUsuario}>
                        <FaUser style={{ fontSize: "32px", color: "#4CAF50", marginRight: "12px" }} />
                        <div>
                          <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "16px" }}>
                            Hola {user.nombre}, usaremos tus datos guardados
                          </p>
                          <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}><strong>Email:</strong> {user.email}</p>
                        </div>
                      </div>
                      
                      {/* Solo pedir la dirección si no está disponible */}
                      <div style={styles.checkoutCampo}>
                        <label htmlFor="direccion" style={styles.checkoutLabel}>
                          {user.direccion ? "Confirma tu dirección de envío" : "Añade tu dirección de envío"}
                        </label>
                        <textarea
                          id="direccion"
                          name="direccion"
                          value={datosEnvio.direccion}
                          onChange={handleInputChange}
                          style={styles.checkoutTextarea}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    // Formulario completo para usuarios no logueados
                    <>
                      <div style={styles.checkoutCampo}>
                        <label htmlFor="nombre" style={styles.checkoutLabel}>Nombre completo</label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={datosEnvio.nombre}
                          onChange={handleInputChange}
                          style={styles.checkoutInput}
                          required
                        />
                      </div>
                      
                      <div style={styles.checkoutCampo}>
                        <label htmlFor="email" style={styles.checkoutLabel}>Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={datosEnvio.email}
                          onChange={handleInputChange}
                          style={styles.checkoutInput}
                          required
                        />
                      </div>
                      
                      <div style={styles.checkoutCampo}>
                        <label htmlFor="telefono" style={styles.checkoutLabel}>Teléfono</label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={datosEnvio.telefono}
                          onChange={handleInputChange}
                          style={styles.checkoutInput}
                          required
                        />
                      </div>
                      
                      <div style={styles.checkoutCampo}>
                        <label htmlFor="direccion" style={styles.checkoutLabel}>Dirección de envío</label>
                        <textarea
                          id="direccion"
                          name="direccion"
                          value={datosEnvio.direccion}
                          onChange={handleInputChange}
                          style={styles.checkoutTextarea}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Método de envío (siempre visible) */}
                  <div style={styles.checkoutCampo}>
                    <label style={styles.checkoutLabel}>Método de envío</label>
                    <div style={styles.checkoutOpciones}>
                      <div style={styles.checkoutOpcion}>
                        <input
                          type="radio"
                          id="envioNormal"
                          name="metodoEnvio"
                          value="normal"
                          checked={datosEnvio.metodoEnvio === "normal"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="envioNormal" style={styles.checkoutOpcionLabel}>
                          Envío normal (3-5 días)
                        </label>
                      </div>
                      
                      <div style={styles.checkoutOpcion}>
                        <input
                          type="radio"
                          id="envioExpress"
                          name="metodoEnvio"
                          value="express"
                          checked={datosEnvio.metodoEnvio === "express"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="envioExpress" style={styles.checkoutOpcionLabel}>
                          Envío express (1-2 días) + 5€
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Método de pago (siempre visible) */}
                  <div style={styles.checkoutCampo}>
                    <label style={styles.checkoutLabel}>Método de pago</label>
                    <div style={styles.checkoutOpciones}>
                      <div style={styles.checkoutOpcion}>
                        <input
                          type="radio"
                          id="pagoContraentrega"
                          name="metodoPago"
                          value="contraentrega"
                          checked={datosEnvio.metodoPago === "contraentrega"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="pagoContraentrega" style={styles.checkoutOpcionLabel}>
                          Pago contra entrega
                        </label>
                      </div>
                      
                      <div style={styles.checkoutOpcion}>
                        <input
                          type="radio"
                          id="pagoTransferencia"
                          name="metodoPago"
                          value="transferencia"
                          checked={datosEnvio.metodoPago === "transferencia"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="pagoTransferencia" style={styles.checkoutOpcionLabel}>
                          Transferencia bancaria
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {datosEnvio.metodoPago === "transferencia" && (
                    <div style={styles.infoBancaria}>
                      <p style={styles.infoBancariaTexto}>Datos para la transferencia:</p>
                      <p>Banco: Banco Ejemplo</p>
                      <p>IBAN: ES12 3456 7890 1234 5678 9012</p>
                      <p>Beneficiario: Tienda de Mascotas S.L.</p>
                      <p>Concepto: Pedido + Nombre completo</p>
                    </div>
                  )}
                  
                  <button 
                    id="btn-checkout"
                    type="submit" 
                    style={{
                      ...styles.btnConfirmarPedido,
                      opacity: procesandoPedido ? 0.7 : 1,
                      cursor: procesandoPedido ? "not-allowed" : "pointer"
                    }}
                    disabled={procesandoPedido}
                  >
                    {procesandoPedido ? "Procesando..." : "Confirmar Pedido"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos adicionales para usuario logueado
const newStyles = {
  // Estilo para la sección de usuario logueado
  usuarioLogueado: {
    marginBottom: "20px",
  },
  
  // Estilo para la información del usuario
  infoUsuario: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};

const styles = {
  /* ======= Fondo Completo ======= */
  body: {
    backgroundColor: "#FFF2DB", // Fondo cremita
    minHeight: "100vh", // Abarca toda la altura de la pantalla
    margin: 0,
    padding: "20px",
    position: "relative", // Para notificación flotante
  },

  /* ======= Contenedor Principal ======= */
  tiendaContainer: {
    width: "100%",
    maxWidth: "1400px",
    margin: "auto",
    backgroundColor: "#FFF2DB",
    padding: "20px",
  },

  /* ======= Notificación flotante ======= */
  notificacion: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    zIndex: "2000",
    animation: "slideIn 0.3s ease-out",
    maxWidth: "300px",
  },

  /* ======= Barra de navegación ======= */
  barraNavegacion: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "15px",
    borderBottom: "1px solid #e0e0e0",
  },

  /* ======= Título ======= */
  tituloTienda: {
    color: "#ffcc00",
    fontWeight: "bold",
    fontSize: "2.2rem",
    textTransform: "uppercase",
    margin: 0,
  },

  /* ======= Barra de búsqueda y filtros ======= */
  filtrosContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },

  barraBusqueda: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "30px",
    padding: "10px 15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },

  iconoBusqueda: {
    color: "#1f2427",
    marginRight: "10px",
  },

  inputBusqueda: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
  },

  filtroCategoria: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "30px",
    padding: "10px 15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },

  iconoFiltro: {
    color: "#1f2427",
    marginRight: "10px",
  },

  selectCategoria: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "1rem",
    cursor: "pointer",
  },

  /* ======= Resultados de búsqueda ======= */
  resultadosBusqueda: {
    marginBottom: "20px",
    color: "#1f2427",
    fontWeight: "bold",
  },

  noResultados: {
    textAlign: "center",
    color: "#ff6b6b",
    fontWeight: "bold",
  },

  /* ======= Grid de Productos (4 arriba y 4 abajo) ======= */
  productosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 columnas
    gap: "20px",
    justifyContent: "center",
    margin: "0 auto",
    padding: "10px",
  },

  /* ======= Diseño de Tarjetas ======= */
  productoCard: {
    background: "#1f2427",
    borderRadius: "15px",
    padding: "15px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
  },

  /* ======= Etiquetas ======= */
  ofertaLabel: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff6b6b",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    zIndex: "1",
  },

  masVendido: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#ffcc00",
    color: "#1f2427",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    zIndex: "1",
  },

  categoriaLabel: {
    position: "absolute",
    bottom: "80px",
    right: "10px",
    backgroundColor: "#3498db",
    color: "white",
    padding: "3px 8px",
    borderRadius: "3px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    zIndex: "1",
  },

  /* ======= Ajustar todas las imágenes ======= */
  productoImagen: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  /* ======= Información del Producto ======= */
  productoInfo: {
    textAlign: "center",
    flexGrow: 1,
  },

  productoTitulo: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#fff",
  },

  productoDescripcion: {
    fontSize: "1rem",
    color: "#fff",
  },

  productoPrecio: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#ffcc00",
  },

  /* ======= Estrellas de calificación ======= */
  estrellas: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },

  estrella: {
    color: "#ffcc00",
    fontSize: "1.2rem",
    margin: "0 2px",
  },

  /* ======= Envío gratis ======= */
  envioGratis: {
    fontSize: "1rem",
    color: "#fff",
    marginBottom: "10px",
  },

  /* ======= Botones ======= */
  botones: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  /* ======= Botón Ver Detalles ======= */
  btnVer: {
    width: "100%",
    borderRadius: "5px",
    padding: "12px",
    fontSize: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#ffcc00",
    color: "black",
    transition: "transform 0.1s ease, background-color 0.2s ease",
  },

  /* ======= Botón Añadir al Carrito ======= */
  btnAgregar: {
    width: "100%",
    borderRadius: "5px",
    padding: "12px",
    fontSize: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#4CAF50", // Verde
    color: "white",
    transition: "transform 0.1s ease, background-color 0.2s ease",
  },

  /* ======= Paginación ======= */
  paginacion: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
    gap: "15px",
  },

  botonPaginacion: {
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "5px",
    padding: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },

  paginaActual: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#1f2427",
  },

  /* ======= Modal Overlay ======= */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },

  /* ======= Modal ======= */
  modal: {
    backgroundColor: "#FFF2DB",
    borderRadius: "15px",
    padding: "25px",
    maxWidth: "500px",
    width: "90%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "scaleIn 0.3s ease-out",
  },

  /* ======= Botón para cerrar el modal ======= */
  cerrarModal: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#1f2427",
    transition: "transform 0.2s ease",
  },

  /* ======= Imagen del modal (ajustada para verse completa) ======= */
  modalImagen: {
    width: "100%",
    maxHeight: "300px", // Altura máxima para la imagen
    objectFit: "contain", // Ajusta la imagen sin recortarla
    borderRadius: "10px",
    marginBottom: "15px",
  },

  /* ======= Título del modal ======= */
  modalTitulo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1f2427",
    marginBottom: "15px",
    textAlign: "center",
  },

  /* ======= Categoría en modal ======= */
  modalCategoria: {
    fontSize: "1rem",
    color: "#3498db",
    marginBottom: "10px",
  },

  /* ======= Descripción del modal ======= */
  modalDescripcion: {
    fontSize: "1rem",
    color: "#1f2427",
    textAlign: "center",
    marginBottom: "15px",
    lineHeight: "1.5",
  },

  /* ======= Precio del modal ======= */
  modalPrecio: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#1f2427",
    marginBottom: "15px",
  },

  /* ======= Envío gratis del modal ======= */
  modalEnvioGratis: {
    fontSize: "1rem",
    color: "#1f2427",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  /* ======= Estrellas del modal ======= */
  modalEstrellas: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },

  /* ======= Modal Checkout ======= */
  modalCheckout: {
    backgroundColor: "#FFF2DB",
    borderRadius: "15px",
    padding: "25px",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    position: "relative",
    overflowY: "auto",
    animation: "scaleIn 0.3s ease-out",
  },

  checkoutTitulo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 25px 0",
    color: "#1f2427",
  },

  checkoutSecciones: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },

  checkoutSeccion: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },

  checkoutSubtitulo: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0 0 15px 0",
    color: "#1f2427",
    paddingBottom: "10px",
    borderBottom: "2px solid #ffcc00",
  },

  resumenPedido: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  resumenItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1rem",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  resumenItemInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  resumenItemNombre: {
    fontWeight: "bold",
  },

  resumenItemCantidad: {
    color: "#666",
  },

  resumenItemPrecio: {
    fontWeight: "bold",
  },

  resumenTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0 5px 0",
    borderTop: "2px solid #ddd",
    marginTop: "10px",
  },

  resumenTotalTexto: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },

  resumenTotalPrecio: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#1f2427",
  },

  checkoutForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  checkoutCampo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  checkoutLabel: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#555",
  },

  checkoutInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },

  checkoutTextarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    minHeight: "80px",
    resize: "vertical",
  },

  checkoutOpciones: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  checkoutOpcion: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  checkoutOpcionLabel: {
    fontSize: "0.95rem",
  },

  infoBancaria: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },

  infoBancariaTexto: {
    fontWeight: "bold",
    marginBottom: "10px",
  },

  btnConfirmarPedido: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background-color 0.2s ease",
  },

  /* ======= Animaciones ======= */
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },

  "@keyframes scaleIn": {
    from: { transform: "scale(0.9)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 }
  },

  "@keyframes slideInRight": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" }
  },

  "@keyframes slideIn": {
    from: { transform: "translateY(-20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 }
  },

  /* ======= Ajuste Responsivo ======= */
  "@media (max-width: 1024px)": {
    productosGrid: {
      gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas en tablets
    },
    checkoutSecciones: {
      flexDirection: "column",
    }
  },

  "@media (max-width: 768px)": {
    productosGrid: {
      gridTemplateColumns: "repeat(2, 1fr)", // 2 columnas en móviles más grandes
    },
    filtrosContainer: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    barraBusqueda: {
      marginBottom: "10px",
    },
    carritoPanel: {
      width: "100%",
    }
  },

  "@media (max-width: 480px)": {
    productosGrid: {
      gridTemplateColumns: "repeat(1, 1fr)", // 1 columna en móviles pequeños
    },
    tituloTienda: {
      fontSize: "1.8rem",
    }
  },
  
  // Añadir los nuevos estilos al objeto principal
  ...newStyles
};

export default Tienda;