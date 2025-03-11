import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaShoppingCart, FaStar, FaTruck } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener los productos desde la API
  useEffect(() => {
    fetch("http://localhost:5000/api/tienda")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al obtener los productos:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div style={styles.tiendaContainer}>
      <h2 style={styles.tituloTienda}>🐾 Nuestra Tienda 🐾</h2>

      <div style={styles.productosGrid}>
        {productos.map((producto) => (
          <div style={styles.productoCard} key={producto._id}>
            {/* Etiqueta de Oferta */}
            {producto.oferta && <span style={styles.ofertaLabel}>OFERTA</span>}

            {/* Etiqueta "Más Vendido" */}
            {producto.masVendido && <span style={styles.masVendido}>🔥 Más Vendido</span>}

            <img
              src={`http://localhost:5000${producto.imagenUrl.startsWith('/') ? producto.imagenUrl : '/' + producto.imagenUrl}`}
              alt={producto.nombre}
              style={styles.productoImagen}
              onError={(e) => { e.target.src = "http://localhost:5000/uploads/default.jpg"; }}
            />

            <div style={styles.productoInfo}>
              <h5 style={styles.productoTitulo}>{producto.nombre}</h5>
              <p style={styles.productoDescripcion}>{producto.descripcion}</p>

              {producto.estrellas && (
                <div style={styles.estrellas}>
                  {[...Array(producto.estrellas)].map((_, i) => (
                    <FaStar key={i} className="estrella" />
                  ))}
                </div>
              )}

              {producto.envioGratis && <p style={styles.envioGratis}><FaTruck /> Envío Gratis</p>}

              <h6 style={styles.precio}>{producto.precio} EUR</h6>
            </div>

            <div style={styles.botones}>
              <button style={styles.btnVer}>
                <FaInfoCircle style={{ marginRight: "5px" }} /> Ver Detalles
              </button>
              <button style={styles.btnComprar}>
                <FaShoppingCart style={{ marginRight: "5px" }} /> Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// **Manteniendo el Mismo CSS**
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
    marginTop: "90px", // Agregado para dar separación
  },

  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },

  /* ======= Contenedor Principal ======= */
  tiendaContainer: {
    width: "100%",
    maxWidth: "1400px",
    margin: "auto",
    backgroundColor: "#FFF2DB",
    padding: "40px 20px",
  },

  /* ======= Título ======= */
  tituloTienda: {
    color: "#2c3e50",
    fontWeight: "bold",
    fontSize: "2.2rem",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: "30px",
    marginTop: "50px", // Se agrega margen superior para separarlo
  },

  /* ======= Grid de Productos ======= */
  productosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
    transition: "transform 0.2s ease-in-out",
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

  /* ======= Etiquetas ======= */
  ofertaLabel: {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "#FF8000",
    color: "black",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    borderRadius: "5px",
  },

  masVendido: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    borderRadius: "5px",
  },

  /* ======= Botones ======= */
  botones: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  btnVer: {
    width: "50%",
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
    margin: "0 auto",
    color: "black",
  },

  btnComprar: {
    width: "50%",
    borderRadius: "5px",
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#00df38",
    color: "black",
    margin: "0 auto",
  },
};

export default Tienda;
