import React, { useState, useEffect } from "react";

// URL base para todas las llamadas a la API
const API_BASE_URL = 'http://localhost:5000';

const AdminCRUDTienda = () => {
  // Estados para manejar los productos y el formulario
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagenUrl: "",
    imagenPublicId: "",
    categoria: ""
  });
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [categorias, setCategorias] = useState(['accesorios', 'alimento', 'otros']);

  // Cargar productos al iniciar el componente
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Función para cargar todos los productos
  const cargarProductos = () => {
    fetch(`${API_BASE_URL}/api/admin/crud/tienda`)
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Error en la respuesta del servidor:", text);
            throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setMensajeError("");
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
        setMensajeError(`Error al cargar los productos: ${error.message}`);
      });
  };

  // Función para cargar categorías disponibles
  const cargarCategorias = () => {
    fetch(`${API_BASE_URL}/api/admin/crud/tienda/categorias`)
      .then((res) => {
        if (!res.ok) {
          console.error("Error al obtener categorías");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setCategorias(data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
  };

  // Función para filtrar productos
  const filtrarProductos = (e) => {
    e.preventDefault();
    
    let url = `${API_BASE_URL}/api/admin/crud/tienda/buscar?`;
    
    if (filtroNombre) {
      url += `nombre=${encodeURIComponent(filtroNombre)}`;
    }
    
    if (filtroCategoria) {
      url += `${filtroNombre ? '&' : ''}categoria=${encodeURIComponent(filtroCategoria)}`;
    }
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Error en la respuesta del servidor:", text);
            throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setMensajeError("");
      })
      .catch((error) => {
        console.error("Error al filtrar productos:", error);
        setMensajeError(`Error al buscar productos: ${error.message}`);
      });
  };

  // Función para resetear filtros
  const resetearFiltros = () => {
    setFiltroNombre("");
    setFiltroCategoria("");
    cargarProductos();
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'precio') {
      // Asegurarse de que solo se acepten números para el precio
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (value === '' || regex.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manejar subida de imagen a Cloudinary
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Crear un objeto FormData para enviar la imagen
    const formDataImg = new FormData();
    formDataImg.append('image', file);

    // Iniciar la carga
    setUploadingImage(true);
    setMensajeError("");

    // Subir la imagen al servidor (Cloudinary)
    fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formDataImg,
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Error en la respuesta del servidor:", text);
            throw new Error(`Error al subir la imagen: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setMensajeError(data.error);
        } else {
          // Guardar la URL y publicId de Cloudinary en el estado del formulario
          setFormData({
            ...formData,
            imagenUrl: data.url,
            imagenPublicId: data.publicId
          });
          setMensajeExito("Imagen subida correctamente");
        }
        setUploadingImage(false);
      })
      .catch((error) => {
        console.error("Error al subir imagen:", error);
        setMensajeError(`Error al subir la imagen: ${error.message}`);
        setUploadingImage(false);
      });
  };

  // Función para añadir un nuevo producto
  const agregarProducto = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.categoria) {
      setMensajeError("Por favor complete todos los campos obligatorios");
      return;
    }

    // Convertir el precio a número
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio)
    };

    fetch(`${API_BASE_URL}/api/admin/crud/tienda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Error en la respuesta del servidor:", text);
            throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setMensajeError(data.error);
        } else {
          setMensajeExito("Producto creado correctamente");
          setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            imagenUrl: "",
            imagenPublicId: "",
            categoria: ""
          });
          setPreviewImage(null);
          cargarProductos();
        }
      })
      .catch((error) => {
        console.error("Error al crear producto:", error);
        setMensajeError(`Error al crear el producto: ${error.message}`);
      });
  };

  // Función para preparar la edición de un producto
  const prepararEdicion = (producto) => {
    setProductoEditando(producto._id);
    setModoEdicion(true);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      imagenUrl: producto.imagenUrl,
      imagenPublicId: producto.imagenPublicId || "",
      categoria: producto.categoria
    });
    setPreviewImage(producto.imagenUrl);
  };

  // Función para actualizar un producto
  const actualizarProducto = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      setMensajeError("Por favor complete todos los campos obligatorios");
      return;
    }

    // Convertir el precio a número
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio)
    };

    fetch(`${API_BASE_URL}/api/admin/crud/tienda/${productoEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Error en la respuesta del servidor:", text);
            throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setMensajeError(data.error);
        } else {
          setMensajeExito("Producto actualizado correctamente");
          setModoEdicion(false);
          setProductoEditando(null);
          setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            imagenUrl: "",
            imagenPublicId: "",
            categoria: ""
          });
          setPreviewImage(null);
          cargarProductos();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar producto:", error);
        setMensajeError(`Error al actualizar el producto: ${error.message}`);
      });
  };

  // Función para eliminar un producto
  const eliminarProducto = (id, imagenPublicId) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      // Si hay un publicId de imagen en Cloudinary, primero intentamos eliminarla
      if (imagenPublicId) {
        fetch(`${API_BASE_URL}/api/upload/${encodeURIComponent(imagenPublicId)}`, {
          method: "DELETE"
        }).catch(error => {
          console.error("Error al eliminar imagen:", error);
          // Continuamos con la eliminación del producto incluso si falla la eliminación de la imagen
        });
      }

      fetch(`${API_BASE_URL}/api/admin/crud/tienda/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then(text => {
              console.error("Error en la respuesta del servidor:", text);
              throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setMensajeError(data.error);
          } else {
            setMensajeExito("Producto eliminado correctamente");
            cargarProductos();
          }
        })
        .catch((error) => {
          console.error("Error al eliminar producto:", error);
          setMensajeError(`Error al eliminar el producto: ${error.message}`);
        });
    }
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setProductoEditando(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagenUrl: "",
      imagenPublicId: "",
      categoria: ""
    });
    setPreviewImage(null);
  };

  // Formatear precio para mostrarlo con 2 decimales
  const formatearPrecio = (precio) => {
    return Number(precio).toFixed(2);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Administración de Productos</h1>
      </div>

      {/* Mensajes de éxito o error */}
      {mensajeExito && (
        <div style={styles.mensajeExito}>
          <p>{mensajeExito}</p>
          <button onClick={() => setMensajeExito("")} style={styles.btnCerrar}>
            X
          </button>
        </div>
      )}

      {mensajeError && (
        <div style={styles.mensajeError}>
          <p>{mensajeError}</p>
          <button onClick={() => setMensajeError("")} style={styles.btnCerrar}>
            X
          </button>
        </div>
      )}

      <div style={styles.content}>
        {/* Formulario de búsqueda */}
        <div style={styles.card}>
          <h2>🔍 Buscar Productos</h2>
          <form onSubmit={filtrarProductos} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="filtroNombre">Nombre del producto:</label>
              <input
                type="text"
                id="filtroNombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                style={styles.input}
                placeholder="Buscar por nombre"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="filtroCategoria">Categoría:</label>
              <select
                id="filtroCategoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={styles.input}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.btnPrimary}>
                Buscar
              </button>
              <button
                type="button"
                onClick={resetearFiltros}
                style={styles.btnSecondary}
              >
                Mostrar Todos
              </button>
            </div>
          </form>
        </div>

        {/* Formulario para agregar/editar producto */}
        <div style={styles.card}>
          <h2>{modoEdicion ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}</h2>
          <form
            onSubmit={modoEdicion ? actualizarProducto : agregarProducto}
            style={styles.form}
          >
            <div style={styles.formGroup}>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                style={{...styles.input, height: '100px'}}
                placeholder="Descripción del producto"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="precio">Precio:</label>
              <input
                type="text"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Precio (ejemplo: 99.99)"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="categoria">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="imagen">Imagen:</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleImageUpload}
                style={styles.input}
                accept="image/*"
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div style={styles.uploadingMessage}>
                  Subiendo imagen a Cloudinary...
                </div>
              )}
              {previewImage && (
                <div style={styles.imagePreview}>
                  <img 
                    src={previewImage} 
                    alt="Vista previa" 
                    style={styles.previewImg}
                  />
                </div>
              )}
              <input
                type="text"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="O ingrese la URL de la imagen directamente"
              />
              {/* Campo oculto para el ID de Cloudinary */}
              <input
                type="hidden"
                name="imagenPublicId"
                value={formData.imagenPublicId}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button 
                type="submit" 
                style={styles.btnPrimary}
                disabled={uploadingImage}
              >
                {modoEdicion ? "Actualizar" : "Agregar"}
              </button>
              {modoEdicion && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  style={styles.btnSecondary}
                  disabled={uploadingImage}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado de productos */}
        <div style={styles.card}>
          <h2>📋 Lista de Productos</h2>
          <div style={styles.productGrid}>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div key={producto._id} style={styles.productCard}>
                  <div style={styles.productImageContainer}>
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombre}
                      style={styles.productImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${API_BASE_URL}/uploads/default-product.jpg`;
                      }}
                    />
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{producto.nombre}</h3>
                    <p style={styles.productCategory}>
                      <span style={styles.categoryBadge}>
                        {producto.categoria || "sin categoría"}
                      </span>
                    </p>
                    <p style={styles.productPrice}>
                      ${formatearPrecio(producto.precio)}
                    </p>
                    <p style={styles.productDescription}>
                      {producto.descripcion.length > 100
                        ? `${producto.descripcion.substring(0, 100)}...`
                        : producto.descripcion}
                    </p>
                    <div style={styles.productActions}>
                      <button
                        onClick={() => prepararEdicion(producto)}
                        style={styles.btnEdit}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto._id, producto.imagenPublicId)}
                        style={styles.btnDelete}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noProductsMessage}>
                No se encontraron productos
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    marginBottom: "20px",
    borderBottom: "2px solid #00515F",
    paddingBottom: "10px",
  },
  title: {
    color: "#00515F",
    fontSize: "28px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  btnPrimary: {
    padding: "10px 15px",
    backgroundColor: "#00515F",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 15px",
    backgroundColor: "#FFFFFF",
    color: "#00515F",
    border: "1px solid #00515F",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnEdit: {
    padding: "8px 12px",
    backgroundColor: "#FFD700",
    color: "#000000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnDelete: {
    padding: "8px 12px",
    backgroundColor: "#FF6B6B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnCerrar: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  mensajeExito: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mensajeError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  productCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },
  productImageContainer: {
    height: "200px",
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productInfo: {
    padding: "15px",
  },
  productName: {
    margin: "0 0 5px 0",
    fontSize: "18px",
    color: "#333333",
  },
  productCategory: {
    margin: "0 0 10px 0",
  },
  categoryBadge: {
    backgroundColor: "#00515F",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  productPrice: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
    color: "#00515F",
    fontSize: "18px",
  },
  productDescription: {
    margin: "0 0 15px 0",
    color: "#666666",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  productActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  noProductsMessage: {
    textAlign: "center",
    padding: "50px 0",
    gridColumn: "1 / -1",
    color: "#666666",
    fontSize: "18px",
  },
  imagePreview: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  previewImg: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  uploadingMessage: {
    color: "#0066cc",
    marginTop: "5px",
    fontStyle: "italic",
  }
};

export default AdminCRUDTienda;