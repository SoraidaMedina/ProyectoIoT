import React, { useState, useEffect } from "react";

// URL base para todas las llamadas a la API
const API_BASE_URL = 'http://localhost:5000';

const AdminCRUDUsuarios = () => {
  // Estados para manejar los usuarios y el formulario
  const [usuarios, setUsuarios] = useState([]);
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    password: "",
    direccion: "",
    imagenUrl: "",
    imagenPublicId: ""
  });
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función para cargar todos los usuarios
  const cargarUsuarios = () => {
    fetch(`${API_BASE_URL}/api/admin/crud/usuarios`)
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
        setUsuarios(data);
        setMensajeError("");
      })
      .catch((error) => {
        console.error("Error al cargar usuarios:", error);
        setMensajeError(`Error al cargar los usuarios: ${error.message}`);
      });
  };

  // Función para filtrar usuarios por correo
  const filtrarUsuarios = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/admin/crud/usuarios/buscar?email=${encodeURIComponent(filtroCorreo)}`)
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
        setUsuarios(data);
        setMensajeError("");
      })
      .catch((error) => {
        console.error("Error al filtrar usuarios:", error);
        setMensajeError(`Error al buscar usuarios: ${error.message}`);
      });
  };

  // Función para resetear filtros
  const resetearFiltros = () => {
    setFiltroCorreo("");
    cargarUsuarios();
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar subida de imagen
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
    formDataImg.append('imagen', file);

    // Iniciar la carga
    setUploadingImage(true);
    setMensajeError("");

    // Subir la imagen al servidor
    fetch(`${API_BASE_URL}/api/upload/usuario`, {
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
        // Guardar la URL de la imagen en el estado del formulario
        setFormData({
          ...formData,
          imagenUrl: data.url,
          imagenPublicId: data.publicId
        });
        setMensajeExito("Imagen subida correctamente");
        setUploadingImage(false);
      })
      .catch((error) => {
        console.error("Error al subir imagen:", error);
        setMensajeError(`Error al subir la imagen: ${error.message}`);
        setUploadingImage(false);
      });
  };

  // Función para añadir un nuevo usuario
  const agregarUsuario = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.password) {
      setMensajeError("Por favor complete los campos obligatorios");
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/crud/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
          setMensajeExito("Usuario creado correctamente");
          setFormData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            email: "",
            password: "",
            direccion: "",
            imagenUrl: "",
            imagenPublicId: ""
          });
          setPreviewImage(null);
          cargarUsuarios();
        }
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
        setMensajeError(`Error al crear el usuario: ${error.message}`);
      });
  };

  // Función para preparar la edición de un usuario
  const prepararEdicion = (usuario) => {
    setUsuarioEditando(usuario._id);
    setModoEdicion(true);
    setFormData({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      email: usuario.email,
      password: "", // No incluimos la contraseña por seguridad
      direccion: usuario.direccion,
      imagenUrl: usuario.imagenUrl || "",
      imagenPublicId: usuario.imagenPublicId || ""
    });
    setPreviewImage(usuario.imagenUrl || null);
  };

  // Función para actualizar un usuario
  const actualizarUsuario = (e) => {
    e.preventDefault();
    
    const datosActualizados = {...formData};
    // Si no se ingresa una nueva contraseña, la eliminamos del objeto
    if (!datosActualizados.password) {
      delete datosActualizados.password;
    }

    fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${usuarioEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosActualizados),
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
          setMensajeExito("Usuario actualizado correctamente");
          setModoEdicion(false);
          setUsuarioEditando(null);
          setFormData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            email: "",
            password: "",
            direccion: "",
            imagenUrl: "",
            imagenPublicId: ""
          });
          setPreviewImage(null);
          cargarUsuarios();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        setMensajeError(`Error al actualizar el usuario: ${error.message}`);
      });
  };

  // Función para eliminar un usuario
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${id}`, {
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
            setMensajeExito("Usuario eliminado correctamente");
            cargarUsuarios();
          }
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          setMensajeError(`Error al eliminar el usuario: ${error.message}`);
        });
    }
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      password: "",
      direccion: "",
      imagenUrl: "",
      imagenPublicId: ""
    });
    setPreviewImage(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Administración de Usuarios</h1>
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
          <h2>🔍 Buscar Usuario</h2>
          <form onSubmit={filtrarUsuarios} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="filtroCorreo">Correo electrónico:</label>
              <input
                type="email"
                id="filtroCorreo"
                value={filtroCorreo}
                onChange={(e) => setFiltroCorreo(e.target.value)}
                style={styles.input}
                placeholder="Buscar por correo electrónico"
              />
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

        {/* Formulario para agregar/editar usuario */}
        <div style={styles.card}>
          <h2>{modoEdicion ? "✏️ Editar Usuario" : "➕ Agregar Nuevo Usuario"}</h2>
          <form
            onSubmit={modoEdicion ? actualizarUsuario : agregarUsuario}
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
                placeholder="Nombre"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
              <input
                type="text"
                id="apellidoPaterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Apellido Paterno"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="apellidoMaterno">Apellido Materno:</label>
              <input
                type="text"
                id="apellidoMaterno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Apellido Materno"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password">
                {modoEdicion ? "Nueva Contraseña (dejar en blanco para mantener la actual):" : "Contraseña:"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
                placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                required={!modoEdicion}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Dirección"
              />
            </div>

            {/* Nuevo: Campo para la imagen */}
            <div style={styles.formGroup}>
              <label htmlFor="imagen">Imagen de perfil:</label>
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

        {/* Tabla de usuarios */}
        <div style={styles.card}>
          <h2>📋 Lista de Usuarios</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario._id}>
                      <td>
                        {usuario.imagenUrl ? (
                          <img 
                            src={usuario.imagenUrl} 
                            alt={usuario.nombre} 
                            style={styles.avatarImg}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `${API_BASE_URL}/uploads/default-avatar.jpg`;
                            }}
                          />
                        ) : (
                          <div style={styles.noAvatar}>
                            {usuario.nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>{usuario.nombre}</td>
                      <td>
                        {usuario.apellidoPaterno} {usuario.apellidoMaterno}
                      </td>
                      <td>{usuario.email}</td>
                      <td>{usuario.direccion}</td>
                      <td>
                        {new Date(usuario.fechaRegistro).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={styles.buttonGroup}>
                          <button
                            onClick={() => prepararEdicion(usuario)}
                            style={styles.btnEdit}
                            title="Editar usuario"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => eliminarUsuario(usuario._id)}
                            style={styles.btnDelete}
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={styles.noData}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea con la paleta de colores del proyecto
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
    padding: "5px 10px",
    backgroundColor: "#FFD700",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnDelete: {
    padding: "5px 10px",
    backgroundColor: "#FF6B6B",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
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
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#6c757d",
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
  },
  avatarImg: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  noAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#00515F",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  }
};

export default AdminCRUDUsuarios;