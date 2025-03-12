import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaShoppingCart, FaStar, FaTruck, FaHeart, FaSearch, FaFilter } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("relevancia");
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);

  // Obtener los productos desde la API
  useEffect(() => {
    fetch("http://localhost:5000/api/tienda")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setProductosMostrados(data);
        
        // Extraer categorías únicas
        const categorias = [...new Set(data.map(producto => producto.categoria || "Sin categoría"))];
        setCategoriasUnicas(categorias);
        
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener los productos:", error);
        setIsLoading(false);
      });
  }, []);
  
  // Filtrar productos basado en categoría, búsqueda y ordenamiento
  useEffect(() => {
    if (!productos.length) return;
    
    let productosFiltrados = [...productos];
    
    // Filtro por categoría
    if (filtroCategoria !== "todos") {
      productosFiltrados = productosFiltrados.filter(
        producto => (producto.categoria || "Sin categoría") === filtroCategoria
      );
    }
    
    // Filtro por búsqueda
    if (busqueda.trim()) {
      const searchTerm = busqueda.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        producto => 
          producto.nombre.toLowerCase().includes(searchTerm) ||
          producto.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenar productos
    switch(ordenarPor) {
      case "precioAsc":
        productosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case "precioDesc":
        productosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case "nombreAsc":
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "popularidad":
        productosFiltrados.sort((a, b) => (b.masVendido ? 1 : 0) - (a.masVendido ? 1 : 0));
        break;
      case "oferta":
        productosFiltrados.sort((a, b) => (b.oferta ? 1 : 0) - (a.oferta ? 1 : 0));
        break;
      default:
        // Por defecto ordenar por relevancia (sin cambios)
        break;
    }
    
    setProductosMostrados(productosFiltrados);
  }, [productos, filtroCategoria, busqueda, ordenarPor]);

  // Manejar favoritos
  const toggleFavorito = (id) => {
    setFavoritos(prevFavoritos => 
      prevFavoritos.includes(id)
        ? prevFavoritos.filter(item => item !== id)
        : [...prevFavoritos, id]
    );
  };

  if (isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <Spinner animation="border" role="status" style={styles.spinner}>
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p style={styles.loaderText}>Cargando productos...</p>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div style={styles.mensajeVacioContainer}>
        <div style={styles.mensajeVacio}>
          <FaShoppingCart style={styles.iconoVacio} />
          <h3>No hay productos disponibles en este momento</h3>
          <p>Lo sentimos, estamos trabajando para añadir nuevos productos pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tiendaContainer}>
      <div style={styles.headerTienda}>
        <h2 style={styles.tituloTienda}>🐾 Nuestra Tienda Pet-Friendly 🐾</h2>
        <p style={styles.subtituloTienda}>Todo lo que tu mascota necesita, con la calidad que merece</p>
      </div>

      {/* Filtros y búsqueda */}
      <div style={styles.filtrosContainer}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.iconoBusqueda} />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            style={styles.inputBusqueda}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div style={styles.filtrosCategorias}>
          <div style={styles.filtroHeader}>
            <FaFilter />
            <span style={styles.filtroTitulo}>Filtrar por:</span>
          </div>
          
          <select 
            style={styles.selectFiltro}
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            {categoriasUnicas.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          
          <select 
            style={styles.selectFiltro}
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
          >
            <option value="relevancia">Más relevantes</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
            <option value="nombreAsc">Nombre A-Z</option>
            <option value="popularidad">Más populares</option>
            <option value="oferta">Ofertas</option>
          </select>
        </div>
      </div>
      
      {/* Contador de resultados */}
      <div style={styles.resultadosCounter}>
        <span>Mostrando {productosMostrados.length} de {productos.length} productos</span>
      </div>

      {/* Grid de productos */}
      <div style={styles.productosGrid}>
        {productosMostrados.length === 0 ? (
          <div style={styles.noResultados}>
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            <button 
              style={styles.btnReiniciarBusqueda}
              onClick={() => {
                setBusqueda("");
                setFiltroCategoria("todos");
                setOrdenarPor("relevancia");
              }}
            >
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          productosMostrados.map((producto) => (
            <div 
              style={{
                ...styles.productoCard,
                transform: favoritos.includes(producto._id) ? 'scale(1.02)' : 'scale(1)'
              }} 
              key={producto._id}
            >
              <div style={styles.etiquetasContainer}>
                {/* Botón de favorito */}
                <button 
                  style={{
                    ...styles.btnFavorito,
                    backgroundColor: favoritos.includes(producto._id) ? 'rgba(255, 0, 80, 0.8)' : 'rgba(0, 0, 0, 0.5)'
                  }}
                  onClick={() => toggleFavorito(producto._id)}
                >
                  <FaHeart style={styles.iconoFavorito} />
                </button>

                {/* Etiquetas */}
                <div style={styles.etiquetas}>
                  {producto.oferta && <span style={styles.ofertaLabel}>OFERTA</span>}
                  {producto.masVendido && <span style={styles.masVendido}>🔥 Más Vendido</span>}
                </div>
              </div>

              <div style={styles.imagenContainer}>
                <img
                  src={`http://localhost:5000${producto.imagenUrl.startsWith('/') ? producto.imagenUrl : '/' + producto.imagenUrl}`}
                  alt={producto.nombre}
                  style={styles.productoImagen}
                  onError={(e) => { e.target.src = "http://localhost:5000/uploads/default.jpg"; }}
                />
                {producto.stock <= 5 && producto.stock > 0 && (
                  <div style={styles.stockBajo}>¡Quedan solo {producto.stock}!</div>
                )}
                {producto.stock === 0 && (
                  <div style={styles.sinStock}>Agotado</div>
                )}
              </div>

              <div style={styles.productoInfo}>
                <span style={styles.categoriaTag}>{producto.categoria || "General"}</span>
                <h5 style={styles.productoTitulo}>{producto.nombre}</h5>
                <p style={styles.productoDescripcion}>{producto.descripcion}</p>

                {producto.estrellas && (
                  <div style={styles.estrellas}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        style={{
                          ...styles.estrella,
                          color: i < producto.estrellas ? "#ffcc00" : "#444"
                        }} 
                      />
                    ))}
                    {producto.totalReviews && (
                      <span style={styles.reviewsCount}>({producto.totalReviews})</span>
                    )}
                  </div>
                )}

                {producto.envioGratis && 
                  <p style={styles.envioGratis}>
                    <FaTruck style={styles.iconoEnvio} /> Envío Gratis
                  </p>
                }

                <div style={styles.precioContainer}>
                  {producto.precioAnterior && (
                    <span style={styles.precioAnterior}>{producto.precioAnterior} EUR</span>
                  )}
                  <h6 style={styles.precio}>
                    {producto.precio} EUR
                    {producto.precioAnterior && (
                      <span style={styles.descuentoPorcentaje}>
                        {Math.round((1 - producto.precio / producto.precioAnterior) * 100)}% OFF
                      </span>
                    )}
                  </h6>
                </div>
              </div>

              <div style={styles.botones}>
                <button style={styles.btnVer}>
                  <FaInfoCircle style={styles.iconoBoton} /> Ver Detalles
                </button>
                <button 
                  style={{
                    ...styles.btnComprar,
                    opacity: producto.stock === 0 ? 0.5 : 1,
                    cursor: producto.stock === 0 ? 'not-allowed' : 'pointer'
                  }}
                  disabled={producto.stock === 0}
                >
                  <FaShoppingCart style={styles.iconoBoton} />
                  {producto.stock === 0 ? 'Agotado' : 'Comprar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Paginación (opcional, simplificada) */}
      {productosMostrados.length > 0 && (
        <div style={styles.paginacion}>
          <button style={styles.btnPaginacion} disabled>Anterior</button>
          <span style={styles.paginaActual}>Página 1</span>
          <button style={styles.btnPaginacion} disabled={productosMostrados.length < 12}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  /* ======= Fondo Completo ======= */
  body: {
    backgroundColor: "#FFF2DB",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    marginTop: "90px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },

  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
    flexDirection: "column",
  },

  spinner: {
    color: "#FF8000",
    width: "3rem",
    height: "3rem",
  },
  
  loaderText: {
    marginTop: "15px",
    color: "#1f2427",
    fontSize: "1.1rem",
  },

  mensajeVacioContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },

  mensajeVacio: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#2c3e50",
    padding: "3rem",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    borderRadius: "15px",
    margin: "2rem auto",
    maxWidth: "600px",
    border: "1px dashed #ffcc00",
  },
  
  iconoVacio: {
    fontSize: "3rem",
    color: "#ffcc00",
    marginBottom: "1rem",
  },

  /* ======= Contenedor Principal ======= */
  tiendaContainer: {
    width: "100%",
    maxWidth: "1400px",
    margin: "auto",
    backgroundColor: "#FFF2DB",
    padding: "40px 20px 60px",
    backgroundImage: "linear-gradient(to bottom, #FFF8E8, #FFF2DB)",
    position: "relative",
  },

  /* ======= Header y Título ======= */
  headerTienda: {
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px 0",
    borderBottom: "2px dashed rgba(44, 62, 80, 0.2)",
    position: "relative",
  },

  tituloTienda: {
    color: "#2c3e50",
    fontWeight: "800",
    fontSize: "2.5rem",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: "10px",
    textShadow: "2px 2px 0px rgba(255, 204, 0, 0.5)",
    letterSpacing: "1px",
    position: "relative",
    display: "inline-block",
  },

  subtituloTienda: {
    color: "#666",
    fontSize: "1.1rem",
    marginTop: "0",
  },
  
  /* ======= Filtros y Búsqueda ======= */
  filtrosContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 0 20px 0",
    padding: "15px 20px",
    backgroundColor: "rgba(31, 36, 39, 0.03)",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  
  searchBox: {
    display: "flex",
    alignItems: "center",
    flex: "1 1 300px",
    position: "relative",
    marginRight: "15px",
    marginBottom: "10px",
  },
  
  iconoBusqueda: {
    position: "absolute",
    left: "15px",
    color: "#666",
    fontSize: "16px",
  },
  
  inputBusqueda: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  
  filtrosCategorias: {
    display: "flex",
    alignItems: "center",
    flex: "1 1 300px",
    gap: "10px",
    flexWrap: "wrap",
  },
  
  filtroHeader: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#2c3e50",
    fontWeight: "500",
  },
  
  filtroTitulo: {
    marginRight: "5px",
    display: "none",
    "@media (min-width: 768px)": {
      display: "inline",
    },
  },
  
  selectFiltro: {
    padding: "10px 15px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    outline: "none",
    cursor: "pointer",
    marginBottom: "10px",
  },
  
  resultadosCounter: {
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "0.9rem",
    color: "#666",
    padding: "0 5px",
  },
  
  noResultados: {
    gridColumn: "1 / -1", // Ocupar toda la fila
    textAlign: "center",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  
  btnReiniciarBusqueda: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#ffcc00",
    color: "#1f2427",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },

  /* ======= Grid de Productos ======= */
  productosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
    justifyContent: "center",
    margin: "0 auto",
    padding: "10px",
  },

  /* ======= Diseño de Tarjetas ======= */
  productoCard: {
    background: "linear-gradient(145deg, #1f2427, #2a3035)",
    borderRadius: "15px",
    padding: "15px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    marginBottom: "20px",
    transition: "all 0.3s ease-in-out",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },

  etiquetasContainer: {
    position: "absolute",
    width: "100%",
    top: "0",
    left: "0",
    zIndex: "5",
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
  },
  
  btnFavorito: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: "10",
    padding: "0",
  },
  
  iconoFavorito: {
    color: "white",
    fontSize: "16px",
  },
  
  etiquetas: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-end",
  },

  /* ======= Ajustar todas las imágenes ======= */
  imagenContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "10px",
    height: "200px",
    marginBottom: "15px",
  },

  productoImagen: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
    transition: "transform 0.5s ease",
  },
  
  stockBajo: {
    position: "absolute",
    bottom: "10px",
    left: "0",
    right: "0",
    margin: "0 auto",
    width: "fit-content",
    backgroundColor: "rgba(255, 128, 0, 0.85)",
    color: "white",
    fontSize: "0.8rem",
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
    textAlign: "center",
  },
  
  sinStock: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  /* ======= Información del Producto ======= */
  productoInfo: {
    textAlign: "center",
    flexGrow: 1,
    padding: "5px 10px 15px",
  },
  
  categoriaTag: {
    display: "inline-block",
    background: "rgba(255, 204, 0, 0.2)",
    color: "#ffcc00",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    marginBottom: "10px",
    fontWeight: "500",
  },

  productoTitulo: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#fff",
    letterSpacing: "0.5px",
  },

  productoDescripcion: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.4",
    marginBottom: "15px",
    display: "-webkit-box",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  estrellas: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3px",
    marginBottom: "10px",
  },

  estrella: {
    fontSize: "18px",
  },
  
  reviewsCount: {
    marginLeft: "5px",
    fontSize: "0.85rem",
    color: "#aaa",
  },

  envioGratis: {
    color: "#00df38",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 223, 56, 0.1)",
    padding: "5px 10px",
    borderRadius: "20px",
    width: "fit-content",
    margin: "10px auto",
  },

  iconoEnvio: {
    marginRight: "5px",
  },

  precioContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "15px 0",
  },
  
  precioAnterior: {
    textDecoration: "line-through",
    color: "#aaa",
    fontSize: "0.9rem",
    marginBottom: "5px",
  },

  precio: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#ffcc00",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    margin: "0",
  },
  
  descuentoPorcentaje: {
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "0.8rem",
    padding: "3px 6px",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  /* ======= Etiquetas ======= */
  ofertaLabel: {
    backgroundColor: "#FF8000",
    color: "black",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    display: "inline-block",
    marginBottom: "5px",
  },

  masVendido: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    display: "inline-block",
  },

  /* ======= Botones ======= */
  botones: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  btnVer: {
    width: "70%",
    borderRadius: "25px",
    padding: "12px",
    fontSize: "0.95rem",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#ffcc00",
    margin: "0 auto",
    color: "black",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 8px rgba(255, 204, 0, 0.3)",
  },

  btnComprar: {
    width: "70%",
    borderRadius: "25px",
    padding: "12px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#00df38",
    color: "black",
    margin: "0 auto",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 8px rgba(0, 223, 56, 0.3)",
  },

  iconoBoton: {
    marginRight: "8px",
    fontSize: "16px",
  },
  
  /* ======= Paginación ======= */
  paginacion: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "40px 0 10px",
    gap: "15px",
  },
  
  btnPaginacion: {
    padding: "8px 15px",
    backgroundColor: "#1f2427",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  
  paginaActual: {
    padding: "5px 10px",
    backgroundColor: "rgba(255, 204, 0, 0.2)",
    borderRadius: "20px",
    color: "#2c3e50",
    fontWeight: "500",
  },
};

export default Tienda;