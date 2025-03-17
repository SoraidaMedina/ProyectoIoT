import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const Footer = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Sección de Políticas */}
          <div style={styles.sectionLeft}>
            <h5 style={styles.sectionTitle}>
              <i className="fa fa-file-text" style={styles.icon}></i> Políticas
            </h5>
            <div style={styles.horizontalList}>
              <a
                href="/politicas"
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  handleOptionClick("Política de privacidad");
                }}
              >
                <i className="fa fa-shield-alt" style={styles.icon}></i>
                Política de privacidad
              </a>
              <a
                href="/terminos"
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  handleOptionClick("Términos y condiciones");
                }}
              >
                <i className="fa fa-check-circle" style={styles.icon}></i>
                Términos y condiciones
              </a>
            </div>
          </div>

          {/* Sección de Redes Sociales */}
          <div style={styles.sectionCenter}>
            <h5 style={styles.sectionTitle}>
              <i className="fa fa-share-alt" style={styles.icon}></i> Redes Sociales
            </h5>
            <div style={styles.horizontalList}>
              <a
                href="https://www.facebook.com/SaboryHuellitas"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                <i className="fa fa-facebook" style={styles.icon}></i>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/SaboryHuellitas100"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                <i className="fa fa-instagram" style={styles.icon}></i>
                Instagram
              </a>
              <a
                href="https://twitter.com/SaborYHuellitas"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                <i className="fa fa-twitter" style={styles.icon}></i>
                Twitter
              </a>
            </div>
          </div>

          {/* Nueva Sección de Soporte */}
          <div style={styles.sectionCenter}>
            <h5 style={styles.sectionTitle}>
              <i className="fa fa-headset" style={styles.icon}></i> Soporte
            </h5>
            <div style={styles.horizontalList}>
              <a
                href="#"
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/contacto");
                }}
              >
                <i className="fa fa-phone-square" style={styles.icon}></i>
                Contacto
              </a>
            </div>
          </div>

          {/* Sección de Misión y Visión */}
          <div
            style={styles.sectionRight}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <h5 style={styles.sectionTitle}>
              <i className="fa fa-lightbulb" style={styles.icon}></i> Misión y Visión
            </h5>
            <div style={styles.menuIconContainer}>
              <i className="fa fa-bullseye" style={styles.menuIcon}></i>
            </div>
            {showMenu && (
              <ul style={styles.menu}>
                <li
                  style={styles.menuItem}
                  onClick={() => handleOptionClick("Misión")}
                >
                  <i className="fa fa-flag" style={styles.menuIcon}></i> Misión
                </li>
                <li
                  style={styles.menuItem}
                  onClick={() => handleOptionClick("Visión")}
                >
                  <i className="fa fa-eye" style={styles.menuIcon}></i> Visión
                </li>
                <li
                  style={styles.menuItem}
                  onClick={() => handleOptionClick("Valores")}
                >
                  <i className="fa fa-trophy" style={styles.menuIcon}></i> Valores
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {selectedOption}
            </h3>
            <div style={styles.modalContent}>
              <p style={styles.modalText}>
                {selectedOption === "Misión" &&
                  "Ofrecer productos y servicios de calidad para la nutrición y bienestar de las mascotas."}
                {selectedOption === "Visión" &&
                  "Convertirnos en la marca líder en innovación y cuidado de mascotas."}
                {selectedOption === "Valores" && (
                  <>
                    <strong>Compromiso:</strong> Compromiso con el bienestar animal.
                    <br />
                    <strong>Innovación:</strong> Aplicación de tecnología en productos de mascotas.
                    <br />
                    <strong>Calidad:</strong> Productos de alta calidad y confianza.
                  </>
                )}
                {selectedOption === "Política de privacidad" && (
                  <>
                    <strong>Política de privacidad</strong>
                    <br />
                    <br />
                    <strong>Aviso de Privacidad</strong>
                    <br />
                    <br />
                    <strong>Dirección:</strong>
                    <br />
                    Calle Chalauiayapa 123, Huejutla, Hidalgo
                    <br />
                    <br />
                    Con fundamento en los artículos 15 y 16 de la Ley Federal de Protección de Datos Personales en Posesión de Particulares, hacemos de su conocimiento que <strong>SaboryHuellitas</strong> es responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su protección.
                    <br />
                    <br />
                    Su información personal será utilizada para las siguientes finalidades:
                    <br />
                    - Proveer los servicios y productos que ha solicitado.
                    <br />
                    - Notificarle sobre nuevos servicios o productos que tengan relación con los ya contratados o adquiridos.
                    <br />
                    - Comunicarle sobre cambios en los mismos.
                    <br />
                    - Elaborar estudios y programas que son necesarios para determinar hábitos de consumo.
                    <br />
                    - Realizar evaluaciones periódicas de nuestros productos y servicios a efecto de mejorar la calidad de los mismos.
                    <br />
                    - Evaluar la calidad del servicio que brindamos.
                    <br />
                    - En general, para dar cumplimiento a las obligaciones que hemos contraído con usted.
                    <br />
                    <br />
                    Para las finalidades antes mencionadas, requerimos obtener los siguientes datos personales:
                    <br />
                    - Nombre completo
                    <br />
                    - Edad
                    <br />
                    - Sexo
                    <br />
                    - Teléfono fijo y/o celular
                    <br />
                    - Correo electrónico
                    <br />
                    - ID de Facebook, Twitter y/o Linkedin
                    <br />
                    - Dirección
                    <br />
                    - RFC y/o CURP
                    <br />
                    <br />
                    Es importante informarle que usted tiene derecho al Acceso, Rectificación y Cancelación de sus datos personales, a Oponerse al tratamiento de los mismos o a revocar el consentimiento que para dicho fin nos haya otorgado.
                    <br />
                    <br />
                    Para ello, es necesario que envíe la solicitud en los términos que marca la Ley en su Art. 29 a nuestro responsable de Protección de Datos Personales, vía correo electrónico a <strong>saboryhuellitasproyectointegra@gmail.com</strong> o al teléfono <strong>7717492349</strong>.
                    <br />
                    <br />
                    En caso de que no desee recibir mensajes promocionales de nuestra parte, puede enviarnos su solicitud por medio de la dirección electrónica: <strong>saboryhuellitasproyectointegra@gmail.com</strong>.
                    <br />
                    <br />
                    <strong>Redes Sociales:</strong>
                    <br />
                    - Facebook: <a href="https://www.facebook.com/SaboryHuellitas" target="_blank" rel="noopener noreferrer" style={{ color: "#f1c40f" }}>SaboryHuellitas</a>
                    <br />
                    - Instagram: <a href="https://www.instagram.com/SaboryHuellitas100" target="_blank" rel="noopener noreferrer" style={{ color: "#f1c40f" }}>SaboryHuellitas100</a>
                    <br />
                    - Twitter: <a href="https://twitter.com/SaborYHuellitas" target="_blank" rel="noopener noreferrer" style={{ color: "#f1c40f" }}>@SaborYHuellitas</a>
                    <br />
                    <br />
                    <strong>Importante:</strong> Cualquier modificación a este Aviso de Privacidad podrá consultarlo en <a href="http://www.SaboryHuellitas.com/pages/privacidad" target="_blank" rel="noopener noreferrer" style={{ color: "#f1c40f" }}>http://www.SaboryHuellitas.com/pages/privacidad</a>.
                  </>
                )}
                {selectedOption === "Términos y condiciones" &&
                  "Aquí van los términos y condiciones."}
              </p>
            </div>
            <button style={styles.closeButton} onClick={closeModal}>
              Cerrar
            </button>
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