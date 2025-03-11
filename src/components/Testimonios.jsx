import React from "react";
import "./Testimonios.css";
import { Container, Carousel, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

// 📌 Datos de testimonios (puedes agregar más)
const testimonios = [
  {
    nombre: "Ana Gómez",
    comentario: "Este dispensador ha cambiado la vida de mi mascota. ¡Lo recomiendo totalmente!",
    imagen: "https://randomuser.me/api/portraits/women/44.jpg",
    calificacion: 5,
  },
  {
    nombre: "Carlos Pérez",
    comentario: "Muy práctico y fácil de usar. Mi gato ahora siempre tiene comida a tiempo.",
    imagen: "https://randomuser.me/api/portraits/men/45.jpg",
    calificacion: 4,
  },
  {
    nombre: "María López",
    comentario: "Increíble producto, me da tranquilidad cuando no estoy en casa.",
    imagen: "https://randomuser.me/api/portraits/women/47.jpg",
    calificacion: 5,
  },
];

const Testimonios = () => {
  return (
    <div className="testimonios-page">
      <Container className="testimonios-container">
        <h1 className="text-center">Lo que dicen nuestros clientes</h1>
        <p className="text-center descripcion">
          Descubre lo que opinan las personas que ya han probado nuestro producto.
        </p>

        {/* 📌 Carrusel de testimonios */}
        <Carousel>
          {testimonios.map((testimonio, index) => (
            <Carousel.Item key={index}>
              <div className="testimonio-card">
                <div className="testimonio-img-container">
                  <img src={testimonio.imagen} alt={testimonio.nombre} className="testimonio-img" />
                </div>
                <Card.Body>
                  <Card.Title>{testimonio.nombre}</Card.Title>
                  <div className="estrellas">
                    {Array(testimonio.calificacion)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} className="estrella-icon" />
                      ))}
                  </div>
                  <Card.Text>"{testimonio.comentario}"</Card.Text>
                </Card.Body>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default Testimonios;
