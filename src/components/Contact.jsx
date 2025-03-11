import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faPhone, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs
      .send("service_967veuo", "template_8cypdhs", templateParams, "YwZs_8g526yGM6m9y")
      .then(() => {
        alert("✅ Mensaje enviado correctamente");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        alert("❌ Error al enviar el mensaje");
        console.error("Error:", error);
      });
  };

  return (
    <>
      {/* 🔹 CSS dentro del componente con cambios */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

          .contact-page {
              background-color: #FFF2DB; /* Gris oscuro */
              min-height: auto;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 50px 0;
              font-family: 'Poppins', sans-serif;
          }

          .contact-box {
              max-width: 600px;
              width: 90%;
              padding: 20px;
              text-align: center;
              background: #1f2427;
              border-radius: 10px;
              margin: 50px auto 40px auto;
          }

          .contact-heading {
              font-size: 28px;
              font-weight: bold;
              color: rgb(245, 245, 245);
              margin-bottom: 15px;
          }

          .contact-description {
              color: #ffffff; /* Cambiado a blanco */
              margin-bottom: 20px;
              font-size: 16px;
          }

          .contact-form-container {
              display: flex;
              flex-direction: column;
              gap: 10px;
          }

          .contact-label {
              text-align: left;
              font-weight: bold;
              font-size: 14px;
              color: #ffc914;
          }

          .contact-input,
          .contact-textarea {
              width: 100%;
              padding: 12px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              transition: all 0.3s ease-in-out;
              font-family: 'Poppins', sans-serif;
          }

          .contact-input:focus,
          .contact-textarea:focus {
              border-color: #00515f;
              outline: none;
          }

          .contact-submit-btn {
              background-color: #00df38;
              color: #000;
              font-size: 16px;
              padding: 12px;
              border: none;
              cursor: pointer;
              border-radius: 5px;
              font-weight: bold;
              transition: background 0.3s ease;
              margin-top: 10px;
              font-family: 'Poppins', sans-serif;
          }

          .contact-submit-btn:hover {
              background-color: #00df38;
          }

          .contact-details {
              margin-top: 30px;
              text-align: center;
          }

          .contact-details-title {
              margin-bottom: 5px;
              color: rgb(255, 239, 239);
              font-weight: bold;
          }

          .contact-details-text {
              color: rgb(255, 255, 255) !important;
              font-size: 1.1rem;
          }

          .con-icon {
              color: #fffff;
              font-size: 1.3rem;
              margin-right: 5px;
          }

          .contact-icon {
              color: #f32626;
              font-size: 1.3rem;
              margin-right: 5px;
          }
        `}
      </style>

      <div className="contact-page">
        <div className="contact-box">
          <h2 className="contact-heading">
            <FontAwesomeIcon icon={faPaperPlane} className="contact-icon" />
            Contáctanos
          </h2>
          <p className="contact-description">
            Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>

          <form className="contact-form-container" onSubmit={sendEmail}>
            <label htmlFor="name" className="contact-label">Nombre</label>
            <input type="text" id="name" name="name" className="contact-input" placeholder="Tu nombre" required onChange={handleChange} value={formData.name} />

            <label htmlFor="email" className="contact-label">Correo Electrónico</label>
            <input type="email" id="email" name="email" className="contact-input" placeholder="tuemail@ejemplo.com" required onChange={handleChange} value={formData.email} />

            <label htmlFor="message" className="contact-label">Mensaje</label>
            <textarea id="message" name="message" className="contact-textarea" rows="4" placeholder="Escribe tu mensaje aquí..." required onChange={handleChange} value={formData.message}></textarea>

            <button type="submit" className="contact-submit-btn">
              <FontAwesomeIcon icon={faPaperPlane} className="contact-icon" />
              Enviar Mensaje
            </button>
          </form>

          <div className="contact-details">
            <h3 className="contact-details-title">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
              Ubicación de la Empresa
            </h3>

            <iframe
              title="mapa"
              className="contact-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.8998306575867!2d-98.3853702!3d21.1613648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d9b9b3b3b3b3b3%3A0x3fcb2a68b68b68b6!2sUniversidad%20Tecnol%C3%B3gica%20de%20la%20Huasteca%20Hidalguense!5e0!3m2!1ses!2smx!4v1615401325980!5m2!1ses!2smx"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>

            <h3 className="contact-details-title">
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              Correo Electrónico
            </h3>
            <p className="contact-details-text">info@saboryhuellitas.com</p>

            <h3 className="contact-details-title">
              <FontAwesomeIcon icon={faPhone} className="contact-icon" />
              Teléfono
            </h3>
            <p className="contact-details-text">+52 771-123-4567</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;