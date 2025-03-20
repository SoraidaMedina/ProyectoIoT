import React, { useState, useEffect } from "react";
import { debounce } from 'lodash';

// URL base para todas las llamadas a la API
const API_BASE_URL = 'http://localhost:5000';

const AdminCRUDTienda = () => {
  // Estados para manejar los productos y el formulario
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoExpandido, setProductoExpandido] = useState(null);
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
  // Nuevo estado para manejar errores específicos de cada campo
  const [erroresForm, setErroresForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: ''
  });

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

  // Validación del formulario completo
  const validarFormulario = () => {
    const errores = {};
    
    // Validar nombre (requerido y longitud)
    if (!formData.nombre.trim()) {
      errores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 3) {
      errores.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.nombre.trim().length > 100) {
      errores.nombre = "El nombre no puede exceder los 100 caracteres";
    }
    
    // Validar descripción (requerido y longitud)
    if (!formData.descripcion.trim()) {
      errores.descripcion = "La descripción es obligatoria";
    } else if (formData.descripcion.trim().length < 10) {
      errores.descripcion = "La descripción debe tener al menos 10 caracteres";
    } else if (formData.descripcion.trim().length > 1000) {
      errores.descripcion = "La descripción no puede exceder los 1000 caracteres";
    }
    
    // Validar precio (requerido, formato numérico y rango)
    if (!formData.precio) {
      errores.precio = "El precio es obligatorio";
    } else {
      const precioNum = parseFloat(formData.precio);
      if (isNaN(precioNum)) {
        errores.precio = "El precio debe ser un número válido";
      } else if (precioNum <= 0) {
        errores.precio = "El precio debe ser mayor que cero";
      } else if (precioNum > 999999.99) {
        errores.precio = "El precio no puede exceder 999,999.99";
      }
    }
    
    // Validar categoría (requerido)
    if (!formData.categoria) {
      errores.categoria = "Debe seleccionar una categoría";
    } else if (!categorias.includes(formData.categoria)) {
      errores.categoria = "La categoría seleccionada no es válida";
    }
    
    // Opcional: validar imagen si es un campo requerido en tu negocio
    if (!modoEdicion && !formData.imagenUrl) {
      errores.imagen = "La imagen es obligatoria para nuevos productos";
    } else if (formData.imagenUrl && !validarURLImagen(formData.imagenUrl)) {
      errores.imagen = "La URL de imagen no es válida";
    }
    
    return errores;
  };
  
  // Función auxiliar para validar URLs de imágenes
  const validarURLImagen = (url) => {
    if (!url) return false;
    
    // Verificar formato básico de URL
    try {
      new URL(url);
    } catch (_) {
      return false;
    }
    
    // Verificar que la URL termina con una extensión de imagen común
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return extensionesValidas.some(ext => url.toLowerCase().endsWith(ext)) || 
           url.includes('cloudinary.com');
  };

  // Validación para el formulario de búsqueda
  const validarFormularioBusqueda = () => {
    // Verificar que al menos un campo tenga valor
    if (!filtroNombre.trim() && !filtroCategoria) {
      setMensajeError("Ingrese al menos un criterio de búsqueda");
      return false;
    }
    
    // Validar longitud mínima del nombre para evitar búsquedas demasiado amplias
    if (filtroNombre.trim() && filtroNombre.trim().length < 2) {
      setMensajeError("El término de búsqueda debe tener al menos 2 caracteres");
      return false;
    }
    
    return true;
  };

  // Implementar debounce para búsquedas
  const buscarProductosDebounce = debounce(() => {
    if (!validarFormularioBusqueda()) return;
    
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
  }, 500); // 500ms de retraso

  // Función para filtrar productos
  const filtrarProductos = (e) => {
    e.preventDefault();
    
    if (!validarFormularioBusqueda()) return;
    
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

  // Manejar cambios en el formulario con validación en tiempo real
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar el error específico del campo cuando el usuario comienza a escribir
    setErroresForm({
      ...erroresForm,
      [name]: ''
    });
    
    if (name === 'precio') {
      // Validación mejorada para precio (permite solo números y un punto decimal con máximo 2 decimales)
      const regex = /^(\d+)?(\.\d{0,2})?$/;
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

  // Sanitizar datos del producto antes de enviarlos al servidor
  const sanitizarDatosProducto = (datos) => {
    return {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: parseFloat(parseFloat(datos.precio).toFixed(2)), // Asegurar 2 decimales
      imagenUrl: datos.imagenUrl.trim(),
      imagenPublicId: datos.imagenPublicId.trim(),
      categoria: datos.categoria.trim()
    };
  };

  // Manejar subida de imagen a Cloudinary con validaciones
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      setMensajeError("Tipo de archivo no permitido. Use JPG, PNG, GIF o WEBP");
      setErroresForm({
        ...erroresForm,
        imagen: "Tipo de archivo no permitido. Use JPG, PNG, GIF o WEBP"
      });
      e.target.value = '';
      return;
    }
    
    // Validar tamaño máximo (5MB)
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > tamañoMaximo) {
      setMensajeError("El archivo es demasiado grande. El tamaño máximo es 5MB");
      setErroresForm({
        ...erroresForm,
        imagen: "El archivo es demasiado grande. El tamaño máximo es 5MB"
      });
      e.target.value = '';
      return;
    }

    // Limpiar el error de imagen si existía
    setErroresForm({
      ...erroresForm,
      imagen: ''
    });

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
          setErroresForm({
            ...erroresForm,
            imagen: data.error
          });
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
        setErroresForm({
          ...erroresForm,
          imagen: `Error al subir la imagen: ${error.message}`
        });
        setUploadingImage(false);
      });
  };

  // Función para añadir un nuevo producto con validaciones completas
  const agregarProducto = (e) => {
    e.preventDefault();
    
    // Ejecutar validación completa
    const errores = validarFormulario();
    
    // Si hay errores, actualizar estado y detener envío
    if (Object.keys(errores).length > 0) {
      setErroresForm(errores);
      setMensajeError("Por favor corrija los errores en el formulario");
      return;
    }
    
    // Limpiar errores si todo está bien
    setErroresForm({});
    
    // Sanitizar datos antes de enviar
    const productoData = sanitizarDatosProducto(formData);

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
          setMostrarFormulario(false);
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
    // Limpiar errores de formulario previos
    setErroresForm({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      imagen: ''
    });
    
    setProductoEditando(producto._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
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

  // Función para actualizar un producto con validaciones completas
  const actualizarProducto = (e) => {
    e.preventDefault();
    
    // Ejecutar validación completa
    const errores = validarFormulario();
    
    // Si hay errores, actualizar estado y detener envío
    if (Object.keys(errores).length > 0) {
      setErroresForm(errores);
      setMensajeError("Por favor corrija los errores en el formulario");
      return;
    }
    
    // Limpiar errores si todo está bien
    setErroresForm({});
    
    // Sanitizar datos antes de enviar
    const productoData = sanitizarDatosProducto(formData);

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
          setMostrarFormulario(false);
          cargarProductos();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar producto:", error);
        setMensajeError(`Error al actualizar el producto: ${error.message}`);
      });
  };

  // Función mejorada para eliminar un producto con confirmación detallada
  const eliminarProducto = (id, nombre, imagenPublicId) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) {
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
            setProductoExpandido(null);
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
    setMostrarFormulario(false);
    // Limpiar errores de formulario
    setErroresForm({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      imagen: ''
    });
  };

  // Función para expandir/contraer detalles de un producto
  const toggleExpandirProducto = (id) => {
    if (productoExpandido === id) {
      setProductoExpandido(null);
    } else {
      setProductoExpandido(id);
    }
  };

  // Formatear precio para mostrarlo con 2 decimales
  const formatearPrecio = (precio) => {
    return Number(precio).toFixed(2);
  };

  // Estilo para los mensajes de error de campo
  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px'
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
        {/* Botón para mostrar/ocultar formulario de agregar nuevo producto */}
        <div style={styles.actionBar}>
          <button 
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              if (modoEdicion) {
                cancelarEdicion();
              }
            }} 
            style={mostrarFormulario ? styles.btnSecondary : styles.btnPrimary}
          >
            {mostrarFormulario ? "Cancelar" : "➕ Agregar Nuevo Producto"}
          </button>
        </div>

        {/* Formulario de búsqueda */}
        <div style={styles.card}>
          <h2>🔍 Buscar Productos</h2>
          <form onSubmit={filtrarProductos} style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="filtroNombre">Nombre:</label>
              <input
                type="text"
                id="filtroNombre"
                value={filtroNombre}
                onChange={(e) => {
                  setFiltroNombre(e.target.value);
                  // Activar búsqueda automática con debounce si hay al menos 2 caracteres
                  if (e.target.value.length >= 2 || filtroCategoria) {
                    buscarProductosDebounce();
                  }
                }}
                style={styles.input}
                placeholder="Buscar por nombre"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="filtroCategoria">Categoría:</label>
              <select
                id="filtroCategoria"
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  // Activar búsqueda automática con debounce si se selecciona una categoría
                  buscarProductosDebounce();
                }}
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

        {/* Formulario para agregar/editar producto (condicional) */}
        {mostrarFormulario && (
          <div style={styles.card}>
            <h2>{modoEdicion ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}</h2>
            <form
              onSubmit={modoEdicion ? actualizarProducto : agregarProducto}
              style={styles.form}
            >
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label htmlFor="nombre">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      borderColor: erroresForm.nombre ? 'red' : '#ccc'
                    }}
                    placeholder="Nombre del producto"
                    required
                  />
                  {erroresForm.nombre && <div style={errorStyle}>{erroresForm.nombre}</div>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="precio">Precio:</label>
                  <input
                    type="text"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      borderColor: erroresForm.precio ? 'red' : '#ccc'
                    }}
                    placeholder="Precio (ejemplo: 99.99)"
                    required
                  />
                  {erroresForm.precio && <div style={errorStyle}>{erroresForm.precio}</div>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="categoria">Categoría:</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      borderColor: erroresForm.categoria ? 'red' : '#ccc'
                    }}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                      </option>
                    ))}
                  </select>
                  {erroresForm.categoria && <div style={errorStyle}>{erroresForm.categoria}</div>}
                </div>

                <div style={{...styles.formGroup, gridColumn: "span 3"}}>
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input, 
                      height: '100px',
                      borderColor: erroresForm.descripcion ? 'red' : '#ccc'
                    }}
                    placeholder="Descripción del producto"
                    required
                  />
                  {erroresForm.descripcion && <div style={errorStyle}>{erroresForm.descripcion}</div>}
                </div>

                <div style={{...styles.formGroup, gridColumn: "span 3"}}>
                  <label htmlFor="imagen">Imagen:</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleImageUpload}
                    style={{
                      ...styles.input,
                      borderColor: erroresForm.imagen ? 'red' : '#ccc'
                    }}
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div style={styles.uploadingMessage}>
                      Subiendo imagen a Cloudinary...
                    </div>
                  )}
                  
                  <div style={styles.formRow}>
                    <div style={{flex: 1}}>
                      <input
                        type="text"
                        name="imagenUrl"
                        value={formData.imagenUrl}
                        onChange={handleInputChange}
                        style={{
                          ...styles.input,
                          borderColor: erroresForm.imagen ? 'red' : '#ccc'
                        }}
                        placeholder="O ingrese la URL de la imagen directamente"
                      />
                      {/* Campo oculto para el ID de Cloudinary */}
                      <input
                        type="hidden"
                        name="imagenPublicId"
                        value={formData.imagenPublicId}
                      />
                    </div>
                    
                    {previewImage && (
                      <div style={styles.imagePreview}>
                        <img 
                          src={previewImage} 
                          alt="Vista previa" 
                          style={styles.previewImg}
                        />
                      </div>
                    )}
                  </div>
                  {erroresForm.imagen && <div style={errorStyle}>{erroresForm.imagen}</div>}
                </div>
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
        )}

        {/* Tabla de productos */}
        <div style={styles.card}>
          <h2>📋 Lista de Productos</h2>
          
          {productos.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Imagen</th>
                    <th style={styles.tableHeader}>Nombre</th>
                    <th style={styles.tableHeader}>Categoría</th>
                    <th style={styles.tableHeader}>Precio</th>
                    <th style={styles.tableHeader}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <React.Fragment key={producto._id}>
                      <tr style={styles.tableRow}>
                        <td style={{...styles.tableCell, width: '80px'}}>
                          <img
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            style={styles.tableThumbnail}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `${API_BASE_URL}/uploads/default-product.jpg`;
                            }}
                          />
                        </td>
                        <td style={styles.tableCell}>{producto.nombre}</td>
                        <td style={styles.tableCell}>
                          <span style={styles.categoryBadge}>
                            {producto.categoria || "sin categoría"}
                          </span>
                        </td>
                        <td style={styles.tableCell}>${formatearPrecio(producto.precio)}</td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => toggleExpandirProducto(producto._id)}
                            style={styles.btnSecondary}
                          >
                            {productoExpandido === producto._id ? "Ocultar" : "Ver más"}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Fila expandida con detalles y opciones */}
                      {productoExpandido === producto._id && (
                        <tr>
                          <td colSpan="5" style={styles.expandedRow}>
                            <div style={styles.expandedContent}>
                              <div style={styles.expandedDetails}>
                                <div style={styles.expandedImage}>
                                  <img
                                    src={producto.imagenUrl}
                                    alt={producto.nombre}
                                    style={styles.expandedImg}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${API_BASE_URL}/uploads/default-product.jpg`;
                                    }}
                                  />
                                </div>
                                <div style={styles.expandedInfo}>
                                  <h3 style={styles.expandedTitle}>{producto.nombre}</h3>
                                  <p style={styles.expandedPrice}>${formatearPrecio(producto.precio)}</p>
                                  <p style={styles.expandedCategory}>
                                    Categoría: <span style={styles.categoryBadge}>
                                      {producto.categoria || "sin categoría"}
                                    </span>
                                  </p>
                                  <p style={styles.expandedDescription}>{producto.descripcion}</p>
                                </div>
                              </div>
                              <div style={styles.expandedActions}>
                                <button
                                  onClick={() => prepararEdicion(producto)}
                                  style={styles.btnEdit}
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  onClick={() => eliminarProducto(producto._id, producto.nombre, producto.imagenPublicId)}
                                  style={styles.btnDelete}
                                >
                                  🗑️ Eliminar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.noProductsMessage}>
              No se encontraron productos
            </div>
          )}
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
  formRow: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    verticalAlign: "middle",
  },
  tableThumbnail: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  expandedRow: {
    backgroundColor: "#f9f9f9",
    padding: "0",
  },
  expandedContent: {
    padding: "15px",
  },
  expandedDetails: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  expandedImage: {
    width: "150px", 
    height: "150px",
  },
  expandedImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
  },
  expandedInfo: {
    flex: 1,
  },
  expandedTitle: {
    fontSize: "18px",
    margin: "0 0 10px 0",
  },
  expandedPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#00515F",
    margin: "0 0 10px 0",
  },
  expandedCategory: {
    margin: "0 0 10px 0",
  },
  expandedDescription: {
    margin: "0",
    color: "#666",
    lineHeight: "1.4",
  },
  expandedActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    borderTop: "1px solid #ddd",
    paddingTop: "15px",
  },
  categoryBadge: {
    backgroundColor: "#00515F",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  noProductsMessage: {
    textAlign: "center",
    padding: "50px 0",
    color: "#666666",
    fontSize: "18px",
  },
  imagePreview: {
    width: "100px",
    margin: "0 0 0 15px",
  },
  previewImg: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  uploadingMessage: {
    color: "#0066cc",
    marginTop: "5px",
    fontStyle: "italic",
  },
  actionBar: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "flex-end",
  }
};

export default AdminCRUDTienda;