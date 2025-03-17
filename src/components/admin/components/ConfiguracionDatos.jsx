import React, { useState, useEffect } from "react";

const ConfiguracionDatos = () => {
  // Estado para almacenar el documento completo
  const [documentoCompleto, setDocumentoCompleto] = useState(null);
  
  // Estado para editar solo la sección footer
  const [datos, setDatos] = useState({
    footer: {
      politicas: {
        privacidad: {
          titulo: "Política de Privacidad",
          contenido: ""
        },
        terminosCondiciones: {
          titulo: "Términos y Condiciones",
          contenido: ""
        }
      },
      redesSociales: {
        facebook: {
          url: "",
          nombrePagina: ""
        },
        instagram: {
          url: "",
          nombrePagina: ""
        },
        twitter: {
          url: "",
          nombrePagina: ""
        }
      },
      soporte: {
        contacto: {
          telefono: "",
          email: ""
        }
      },
      misionVision: {
        mision: {
          titulo: "Misión",
          contenido: ""
        },
        vision: {
          titulo: "Visión",
          contenido: ""
        },
        valores: [
          {
            titulo: "",
            contenido: ""
          }
        ]
      }
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        console.log("Cargando configuración...");
        const respuesta = await fetch("http://localhost:5000/api/nosotros/configuracion", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!respuesta.ok) {
          throw new Error('Error al cargar la configuración');
        }

        const datosRecibidos = await respuesta.json();
        console.log("Datos recibidos:", datosRecibidos);
        
        // Guardar documento completo
        setDocumentoCompleto(datosRecibidos);
        
        // Asegurar que todas las propiedades necesarias existan con operador opcional
        const datosFormateados = {
          footer: {
            politicas: {
              privacidad: {
                titulo: datosRecibidos.footer?.politicas?.privacidad?.titulo || "Política de Privacidad",
                contenido: datosRecibidos.footer?.politicas?.privacidad?.contenido || ""
              },
              terminosCondiciones: {
                titulo: datosRecibidos.footer?.politicas?.terminosCondiciones?.titulo || "Términos y Condiciones",
                contenido: datosRecibidos.footer?.politicas?.terminosCondiciones?.contenido || ""
              }
            },
            redesSociales: {
              facebook: {
                url: datosRecibidos.footer?.redesSociales?.facebook?.url || "",
                nombrePagina: datosRecibidos.footer?.redesSociales?.facebook?.nombrePagina || ""
              },
              instagram: {
                url: datosRecibidos.footer?.redesSociales?.instagram?.url || "",
                nombrePagina: datosRecibidos.footer?.redesSociales?.instagram?.nombrePagina || ""
              },
              twitter: {
                url: datosRecibidos.footer?.redesSociales?.twitter?.url || "",
                nombrePagina: datosRecibidos.footer?.redesSociales?.twitter?.nombrePagina || ""
              }
            },
            soporte: {
              contacto: {
                telefono: datosRecibidos.footer?.soporte?.contacto?.telefono || "",
                email: datosRecibidos.footer?.soporte?.contacto?.email || ""
              }
            },
            misionVision: {
              mision: {
                titulo: datosRecibidos.footer?.misionVision?.mision?.titulo || "Misión",
                contenido: datosRecibidos.footer?.misionVision?.mision?.contenido || ""
              },
              vision: {
                titulo: datosRecibidos.footer?.misionVision?.vision?.titulo || "Visión",
                contenido: datosRecibidos.footer?.misionVision?.vision?.contenido || ""
              },
              valores: datosRecibidos.footer?.misionVision?.valores?.length 
                ? datosRecibidos.footer.misionVision.valores.map(v => ({
                    titulo: v.titulo || "",
                    contenido: v.contenido || ""
                  }))
                : [{ titulo: "", contenido: "" }]
            }
          }
        };

        setDatos(datosFormateados);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar configuración:", err);
        setError("No se pudo cargar la configuración");
        setLoading(false);
      }
    };

    cargarConfiguracion();
  }, []);

  // Manejar cambios en políticas, misión y visión
  const handleChange = (seccion, subseccion, campo, valor) => {
    setDatos(prevDatos => ({
      ...prevDatos,
      footer: {
        ...prevDatos.footer,
        [seccion]: {
          ...prevDatos.footer[seccion],
          [subseccion]: {
            ...prevDatos.footer[seccion][subseccion],
            [campo]: valor
          }
        }
      }
    }));
  };

  // Manejar cambios en redes sociales
  const handleRedesSocialesChange = (red, campo, valor) => {
    setDatos(prevDatos => ({
      ...prevDatos,
      footer: {
        ...prevDatos.footer,
        redesSociales: {
          ...prevDatos.footer.redesSociales,
          [red]: {
            ...prevDatos.footer.redesSociales[red],
            [campo]: valor
          }
        }
      }
    }));
  };

  // Manejar cambios en valores
  const handleValoresChange = (index, campo, valor) => {
    const nuevosValores = [...datos.footer.misionVision.valores];
    nuevosValores[index] = {
      ...nuevosValores[index],
      [campo]: valor
    };
    
    setDatos(prevDatos => ({
      ...prevDatos,
      footer: {
        ...prevDatos.footer,
        misionVision: {
          ...prevDatos.footer.misionVision,
          valores: nuevosValores
        }
      }
    }));
  };

  // Agregar un nuevo valor
  const agregarValor = () => {
    setDatos(prevDatos => ({
      ...prevDatos,
      footer: {
        ...prevDatos.footer,
        misionVision: {
          ...prevDatos.footer.misionVision,
          valores: [
            ...prevDatos.footer.misionVision.valores,
            { titulo: "", contenido: "" }
          ]
        }
      }
    }));
  };

  // Eliminar un valor
  const eliminarValor = (index) => {
    if (datos.footer.misionVision.valores.length <= 1) {
      return; // Evitar eliminar el último valor
    }
    
    const nuevosValores = [...datos.footer.misionVision.valores];
    nuevosValores.splice(index, 1);
    
    setDatos(prevDatos => ({
      ...prevDatos,
      footer: {
        ...prevDatos.footer,
        misionVision: {
          ...prevDatos.footer.misionVision,
          valores: nuevosValores
        }
      }
    }));
  };

  // Guardar configuración
  const guardarConfiguracion = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Crear objeto con el documento completo actualizado
      const datosActualizados = {
        ...documentoCompleto,
        footer: datos.footer
      };
      
      console.log("Enviando datos actualizados:", datosActualizados);
      
      const respuesta = await fetch("http://localhost:5000/api/nosotros/configuracion", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al guardar la configuración: ${respuesta.status}`);
      }

      const resultado = await respuesta.json();
      console.log("Respuesta del servidor:", resultado);
      
      // Actualizar el documento completo con la respuesta del servidor
      setDocumentoCompleto(resultado);
      
      alert("Configuración guardada exitosamente");
    } catch (err) {
      console.error("Error detallado al guardar configuración:", err);
      setError(`No se pudo guardar la configuración: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.contenedor}>
      <h1>Configuración de Footer</h1>

      {/* Sección de Políticas */}
      <div style={styles.seccion}>
        <h2>Políticas</h2>
        <div>
          <label>Título Política de Privacidad</label>
          <input
            type="text"
            value={datos.footer.politicas.privacidad.titulo}
            onChange={(e) => handleChange('politicas', 'privacidad', 'titulo', e.target.value)}
            style={styles.input}
          />
          <label>Contenido Política de Privacidad</label>
          <textarea
            value={datos.footer.politicas.privacidad.contenido}
            onChange={(e) => handleChange('politicas', 'privacidad', 'contenido', e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div>
          <label>Título Términos y Condiciones</label>
          <input
            type="text"
            value={datos.footer.politicas.terminosCondiciones.titulo}
            onChange={(e) => handleChange('politicas', 'terminosCondiciones', 'titulo', e.target.value)}
            style={styles.input}
          />
          <label>Contenido Términos y Condiciones</label>
          <textarea
            value={datos.footer.politicas.terminosCondiciones.contenido}
            onChange={(e) => handleChange('politicas', 'terminosCondiciones', 'contenido', e.target.value)}
            style={styles.textarea}
          />
        </div>
      </div>

      {/* Sección de Redes Sociales */}
      <div style={styles.seccion}>
        <h2>Redes Sociales</h2>
        {['facebook', 'instagram', 'twitter'].map((red) => (
          <div key={red}>
            <h3>{red.charAt(0).toUpperCase() + red.slice(1)}</h3>
            <label>URL</label>
            <input
              type="text"
              value={datos.footer.redesSociales[red].url}
              onChange={(e) => handleRedesSocialesChange(red, 'url', e.target.value)}
              style={styles.input}
            />
            <label>Nombre de Página</label>
            <input
              type="text"
              value={datos.footer.redesSociales[red].nombrePagina}
              onChange={(e) => handleRedesSocialesChange(red, 'nombrePagina', e.target.value)}
              style={styles.input}
            />
          </div>
        ))}
      </div>

      {/* Sección de Soporte */}
      <div style={styles.seccion}>
        <h2>Soporte</h2>
        <label>Teléfono</label>
        <input
          type="text"
          value={datos.footer.soporte.contacto.telefono}
          onChange={(e) => handleChange('soporte', 'contacto', 'telefono', e.target.value)}
          style={styles.input}
        />
        <label>Email</label>
        <input
          type="text"
          value={datos.footer.soporte.contacto.email}
          onChange={(e) => handleChange('soporte', 'contacto', 'email', e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Sección de Misión y Visión */}
      <div style={styles.seccion}>
        <h2>Misión y Visión</h2>
        <div>
          <label>Título Misión</label>
          <input
            type="text"
            value={datos.footer.misionVision.mision.titulo}
            onChange={(e) => handleChange('misionVision', 'mision', 'titulo', e.target.value)}
            style={styles.input}
          />
          <label>Contenido Misión</label>
          <textarea
            value={datos.footer.misionVision.mision.contenido}
            onChange={(e) => handleChange('misionVision', 'mision', 'contenido', e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div>
          <label>Título Visión</label>
          <input
            type="text"
            value={datos.footer.misionVision.vision.titulo}
            onChange={(e) => handleChange('misionVision', 'vision', 'titulo', e.target.value)}
            style={styles.input}
          />
          <label>Contenido Visión</label>
          <textarea
            value={datos.footer.misionVision.vision.contenido}
            onChange={(e) => handleChange('misionVision', 'vision', 'contenido', e.target.value)}
            style={styles.textarea}
          />
        </div>

        <h3>Valores</h3>
        {datos.footer.misionVision.valores.map((valor, index) => (
          <div key={index} style={styles.valorContainer}>
            <label>Título Valor</label>
            <input
              type="text"
              value={valor.titulo}
              onChange={(e) => handleValoresChange(index, 'titulo', e.target.value)}
              style={styles.input}
            />
            <label>Contenido Valor</label>
            <textarea
              value={valor.contenido}
              onChange={(e) => handleValoresChange(index, 'contenido', e.target.value)}
              style={styles.textarea}
            />
            {datos.footer.misionVision.valores.length > 1 && (
              <button 
                onClick={() => eliminarValor(index)} 
                style={styles.botonEliminar}
              >
                Eliminar Valor
              </button>
            )}
          </div>
        ))}
        <button onClick={agregarValor} style={styles.botonAgregar}>
          Agregar Valor
        </button>
      </div>

      <button onClick={guardarConfiguracion} style={styles.botonGuardar}>
        Guardar Configuración
      </button>
    </div>
  );
};

// Estilos
const styles = {
  contenedor: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  seccion: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '100px',
  },
  valorContainer: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  botonAgregar: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  botonEliminar: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  botonGuardar: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
  }
};

export default ConfiguracionDatos;