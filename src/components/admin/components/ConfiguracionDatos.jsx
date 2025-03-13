import React, { useState, useEffect } from "react";

const ConfiguracionDatos = () => {
  const [datos, setDatos] = useState({
    titulo: "",
    descripcion: "",
    antecedentes: {
      titulo: "",
      descripcion1: "",
      descripcion2: "",
      imagen: ""
    },
    quienesSomos: {
      titulo: "",
      descripcion: "",
      imagen: ""
    },
    mision: {
      titulo: "",
      descripcion: ""
    },
    vision: {
      titulo: "",
      descripcion: ""
    },
    valores: [
      {
        titulo: "",
        descripcion: ""
      },
      {
        titulo: "",
        descripcion: ""
      },
      {
        titulo: "",
        descripcion: ""
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState({});
  const [error, setError] = useState("");

  // 🚀 Obtener todos los datos de la colección Nosotros
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        console.log("Obteniendo datos de Nosotros...");
        const response = await fetch("http://localhost:5000/api/configuracion");
        
        if (!response.ok) {
          console.error("Error en la respuesta:", response.status);
          throw new Error("Error al obtener los datos");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        setDatos(data);
      } catch (err) {
        console.error("Error completo:", err);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // 🚀 Manejo de cambios en textos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  // 🚀 Manejo de cambios en objetos anidados
  const handleNestedChange = (section, field, value) => {
    setDatos({
      ...datos,
      [section]: {
        ...datos[section],
        [field]: value
      }
    });
  };

  // 🚀 Manejo de cambios en arrays
  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...datos[arrayName]];
    newArray[index] = {
      ...newArray[index],
      [field]: value
    };
    
    setDatos({
      ...datos,
      [arrayName]: newArray
    });
  };

  // 🚀 Manejar carga de imagen
  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Actualizar estado para mostrar que se está cargando
    setUploadingImages({
      ...uploadingImages,
      [`${section}.${field}`]: true
    });

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('imagen', file);

      // Enviar archivo al servidor
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      // Actualizar la URL de la imagen en el estado
      if (section === 'root') {
        setDatos({
          ...datos,
          [field]: data.url
        });
      } else {
        handleNestedChange(section, field, data.url);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError("Error al subir la imagen");
    } finally {
      // Quitar estado de carga
      setUploadingImages({
        ...uploadingImages,
        [`${section}.${field}`]: false
      });
    }
  };

  // 🚀 Guardar cambios en la API
  const handleGuardar = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) throw new Error("Error al guardar los datos");

      const result = await response.json();
      console.log("Respuesta al guardar:", result);
      
      alert("✅ Datos actualizados correctamente.");
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("❌ Error al guardar los datos.");
    }
  };

  // Función para generar URL completa
  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/') ? `http://localhost:5000${url}` : url;
  };

  return (
    <div style={styles.configuracionContainer}>
      <div style={styles.configuracionCard}>
        <h2>⚙️ Configuración de Datos</h2>

        {loading ? (
          <p style={styles.configuracionLoading}>Cargando configuración...</p>
        ) : (
          <form style={styles.configuracionForm}>
            <h3>Información Principal</h3>
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={datos.titulo}
              onChange={handleChange}
              style={styles.configuracionInput}
            />

            <label>Descripción</label>
            <textarea
              rows={2}
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              style={styles.configuracionInput}
            />

            <h3>Antecedentes</h3>
            <label>Título</label>
            <input
              type="text"
              value={datos.antecedentes.titulo}
              onChange={(e) => handleNestedChange('antecedentes', 'titulo', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Descripción 1</label>
            <textarea
              rows={2}
              value={datos.antecedentes.descripcion1}
              onChange={(e) => handleNestedChange('antecedentes', 'descripcion1', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Descripción 2</label>
            <textarea
              rows={2}
              value={datos.antecedentes.descripcion2}
              onChange={(e) => handleNestedChange('antecedentes', 'descripcion2', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Imagen</label>
            <div style={styles.imagePreviewContainer}>
              <div style={styles.imageUploadContainer}>
                <input
                  type="text"
                  value={datos.antecedentes.imagen}
                  onChange={(e) => handleNestedChange('antecedentes', 'imagen', e.target.value)}
                  style={styles.configuracionInput}
                  placeholder="URL de la imagen (ej: /uploads/imagen.jpg)"
                />
                <div style={styles.uploadButtonContainer}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'antecedentes', 'imagen')}
                    style={styles.fileInput}
                    id="antecedentes-imagen-upload"
                  />
                  <label htmlFor="antecedentes-imagen-upload" style={styles.uploadButton}>
                    {uploadingImages['antecedentes.imagen'] ? 'Subiendo...' : 'Subir Imagen'}
                  </label>
                </div>
              </div>
              {datos.antecedentes.imagen && (
                <div style={styles.imagePreview}>
                  <img 
                    src={getFullImageUrl(datos.antecedentes.imagen)} 
                    alt="Antecedentes" 
                    style={styles.previewImage} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible'}
                  />
                </div>
              )}
            </div>

            <h3>Quiénes Somos</h3>
            <label>Título</label>
            <input
              type="text"
              value={datos.quienesSomos.titulo}
              onChange={(e) => handleNestedChange('quienesSomos', 'titulo', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Descripción</label>
            <textarea
              rows={2}
              value={datos.quienesSomos.descripcion}
              onChange={(e) => handleNestedChange('quienesSomos', 'descripcion', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Imagen</label>
            <div style={styles.imagePreviewContainer}>
              <div style={styles.imageUploadContainer}>
                <input
                  type="text"
                  value={datos.quienesSomos.imagen}
                  onChange={(e) => handleNestedChange('quienesSomos', 'imagen', e.target.value)}
                  style={styles.configuracionInput}
                  placeholder="URL de la imagen (ej: /uploads/imagen.jpg)"
                />
                <div style={styles.uploadButtonContainer}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'quienesSomos', 'imagen')}
                    style={styles.fileInput}
                    id="quienes-somos-imagen-upload"
                  />
                  <label htmlFor="quienes-somos-imagen-upload" style={styles.uploadButton}>
                    {uploadingImages['quienesSomos.imagen'] ? 'Subiendo...' : 'Subir Imagen'}
                  </label>
                </div>
              </div>
              {datos.quienesSomos.imagen && (
                <div style={styles.imagePreview}>
                  <img 
                    src={getFullImageUrl(datos.quienesSomos.imagen)}
                    alt="Quiénes Somos" 
                    style={styles.previewImage} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible'}
                  />
                </div>
              )}
            </div>

            <h3>Misión</h3>
            <label>Título</label>
            <input
              type="text"
              value={datos.mision.titulo}
              onChange={(e) => handleNestedChange('mision', 'titulo', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Descripción</label>
            <textarea
              rows={2}
              value={datos.mision.descripcion}
              onChange={(e) => handleNestedChange('mision', 'descripcion', e.target.value)}
              style={styles.configuracionInput}
            />

            <h3>Visión</h3>
            <label>Título</label>
            <input
              type="text"
              value={datos.vision.titulo}
              onChange={(e) => handleNestedChange('vision', 'titulo', e.target.value)}
              style={styles.configuracionInput}
            />

            <label>Descripción</label>
            <textarea
              rows={2}
              value={datos.vision.descripcion}
              onChange={(e) => handleNestedChange('vision', 'descripcion', e.target.value)}
              style={styles.configuracionInput}
            />

            <h3>Valores</h3>
            {datos.valores && datos.valores.map((valor, index) => (
              <div key={index} style={styles.valorContainer}>
                <h4>Valor {index + 1}</h4>
                <label>Título</label>
                <input
                  type="text"
                  value={valor.titulo}
                  onChange={(e) => handleArrayChange('valores', index, 'titulo', e.target.value)}
                  style={styles.configuracionInput}
                />

                <label>Descripción</label>
                <textarea
                  rows={2}
                  value={valor.descripcion}
                  onChange={(e) => handleArrayChange('valores', index, 'descripcion', e.target.value)}
                  style={styles.configuracionInput}
                />
              </div>
            ))}

            <button type="button" style={styles.configuracionBtn} onClick={handleGuardar}>
              Guardar Cambios
            </button>
          </form>
        )}

        {error && <p style={styles.configuracionError}>{error}</p>}
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  configuracionContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  configuracionCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  configuracionForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  configuracionInput: {
    backgroundColor: "#ffffff",
    color: "black",
    border: "1px solid #bdc3c7",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
    resize: "none",
  },
  configuracionBtn: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    marginTop: "20px",
  },
  configuracionBtnHover: {
    backgroundColor: "#FFDD44",
  },
  configuracionError: {
    color: "#FF2DB",
    fontWeight: "bold",
  },
  configuracionLoading: {
    textAlign: "center",
    padding: "20px",
  },
  valorContainer: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "5px",
  },
  imagePreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  imageUploadContainer: {
    display: 'flex',
    gap: '10px',
  },
  uploadButtonContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fileInput: {
    position: 'absolute',
    width: '0.1px',
    height: '0.1px',
    opacity: '0',
    overflow: 'hidden',
    zIndex: '-1',
  },
  uploadButton: {
    backgroundColor: '#00515F',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    display: 'inline-block',
  },
  imagePreview: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '5px',
  }
};

export default ConfiguracionDatos;