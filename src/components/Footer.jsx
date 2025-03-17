import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  // Estado inicial para los datos del footer
  const [footerData, setFooterData] = useState({
    politicas: {
      privacidad: { 
        titulo: "Política de Privacidad", 
        contenido: "Contenido de política de privacidad" 
      },
      terminosCondiciones: { 
        titulo: "Términos y Condiciones", 
        contenido: "Contenido de términos y condiciones" 
      }
    },
    redesSociales: {
      facebook: { 
        url: "#", 
        nombrePagina: "Facebook" 
      },
      instagram: { 
        url: "#", 
        nombrePagina: "Instagram" 
      },
      twitter: { 
        url: "#", 
        nombrePagina: "Twitter" 
      }
    },
    misionVision: {
      mision: { 
        titulo: "Misión", 
        contenido: "Nuestra misión" 
      },
      vision: { 
        titulo: "Visión", 
        contenido: "Nuestra visión" 
      },
      valores: [
        { 
          titulo: "Valor", 
          contenido: "Descripción del valor" 
        }
      ]
    }
  });

  // Verificar si estamos en una ruta de administración - añadimos location a las dependencias
  const isAdminRoute = location.pathname.includes('/admin');

  useEffect(() => {
    const cargarDatosFooter = async () => {
      try {
        console.log("Cargando datos del footer...");
        // Corregir la URL para apuntar a la ruta correcta
        const respuesta = await fetch("http://localhost:5000/api/nosotros/configuracion");
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar configuración');
        }
        
        const datos = await respuesta.json();
        console.log("Datos recibidos:", datos);
        
        // Verificar que la respuesta tenga la estructura esperada
        if (datos && datos.footer) {
          console.log("Footer encontrado:", datos.footer);
          // Actualizar el estado con los datos del footer
          setFooterData(datos.footer);
        } else {
          console.warn("No se encontró la sección footer en los datos recibidos:", datos);
        }
      } catch (error) {
        console.error("Error al cargar datos del footer:", error);
      }
    };

    // Solo cargar datos si no estamos en una ruta admin
    if (!isAdminRoute) {
      cargarDatosFooter();
    }
  }, [isAdminRoute, location.pathname]); // Añadimos isAdminRoute y location.pathname como dependencias

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleNavigation = (path) => navigate(path);

  // Si estamos en una ruta admin, no renderizar el footer
  if (isAdminRoute) {
    return null;
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Sección de Políticas */}
          <div style={styles.sectionLeft}>
            <h5 style={styles.sectionTitle}><i className="fa fa-file-text" style={styles.icon}></i> Políticas</h5>
            <div style={styles.horizontalList}>
              {footerData.politicas?.privacidad && (
                <a href="#" style={styles.link} onClick={(e) => { e.preventDefault(); handleOptionClick("Política de privacidad"); }}>
                  <i className="fa fa-shield-alt" style={styles.icon}></i>
                  {footerData.politicas.privacidad.titulo}
                </a>
              )}
              {footerData.politicas?.terminosCondiciones && (
                <a href="#" style={styles.link} onClick={(e) => { e.preventDefault(); handleOptionClick("Términos y condiciones"); }}>
                  <i className="fa fa-check-circle" style={styles.icon}></i>
                  {footerData.politicas.terminosCondiciones.titulo}
                </a>
              )}
            </div>
          </div>

          {/* Sección de Redes Sociales */}
          <div style={styles.sectionCenter}>
            <h5 style={styles.sectionTitle}><i className="fa fa-share-alt" style={styles.icon}></i> Redes Sociales</h5>
            <div style={styles.horizontalList}>
              {footerData.redesSociales && Object.values(footerData.redesSociales).map((red, index) => (
                <a key={index} href={red.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  <i className={`fa fa-${red.nombrePagina.toLowerCase()}`} style={styles.icon}></i>
                  {red.nombrePagina}
                </a>
              ))}
            </div>
          </div>

          {/* Sección de Soporte */}
          <div style={styles.sectionCenter}>
            <h5 style={styles.sectionTitle}><i className="fa fa-headset" style={styles.icon}></i> Soporte</h5>
            <div style={styles.horizontalList}>
              <a href="#" style={styles.link} onClick={(e) => { e.preventDefault(); handleNavigation("/contacto"); }}>
                <i className="fa fa-phone-square" style={styles.icon}></i> Contacto
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{selectedOption}</h3>
            <div style={styles.modalContent}>
              <p style={styles.modalText}>
                {selectedOption === "Misión" && footerData.misionVision?.mision?.contenido}
                {selectedOption === "Visión" && footerData.misionVision?.vision?.contenido}
                {selectedOption === "Valores" && footerData.misionVision?.valores?.map((valor, index) => (
                  <React.Fragment key={index}>
                    <strong>{valor.titulo}:</strong> {valor.contenido}<br />
                  </React.Fragment>
                ))}
                {selectedOption === "Política de privacidad" && footerData.politicas?.privacidad?.contenido}
                {selectedOption === "Términos y condiciones" && footerData.politicas?.terminosCondiciones?.contenido}
              </p>
            </div>
            <button style={styles.closeButton} onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </footer>
  );
};
export default Footer;

// Estilos
const styles = {
  footer: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    textAlign: "center",
    padding: "10px 20px",
    marginTop: "auto",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },
  sectionLeft: {
    flex: "1",
    minWidth: "200px",
    margin: "10px",
    textAlign: "center",
  },
  sectionCenter: {
    flex: "1",
    minWidth: "200px",
    margin: "10px",
    textAlign: "center",
  },
  sectionRight: {
    flex: "1",
    minWidth: "200px",
    margin: "10px",
    textAlign: "center",
    position: "relative",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    marginBottom: "10px",
    color: "#f1c40f",
    display: "flex",
    justifyContent: "center",
    gap: "5px",
  },
  horizontalList: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    transition: "color 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  icon: {
    fontSize: "24px",
    color: "#f1c40f",
    transition: "transform 0.3s ease",
  },
  menu: {
    listStyleType: "none",
    padding: "10px",
    margin: 0,
    backgroundColor: "#34495e",
    borderRadius: "10px",
    position: "absolute",
    bottom: "100%",
    left: 0,
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  menuItem: {
    padding: "10px",
    cursor: "pointer",
    color: "#ecf0f1",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "5px",
  },
  menuItemHover: {
    backgroundColor: "#f1c40f",
    color: "#2c3e50",
  },
  menuIcon: {
    fontSize: "18px",
    color: "#f1c40f",
  },
  menuIconContainer: {
    marginTop: "10px",
    textAlign: "center",
  },
  arrowIcon: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    fontSize: "16px",
    color: "#f1c40f",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2c3e50",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  modalContent: {
    padding: "10px",
  },
  modalTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#f1c40f",
  },
  modalText: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#ecf0f1",
    textAlign: "left",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#f1c40f",
    border: "none",
    borderRadius: "5px",
    color: "#2c3e50",
    cursor: "pointer",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background-color 0.3s ease",
  },
};