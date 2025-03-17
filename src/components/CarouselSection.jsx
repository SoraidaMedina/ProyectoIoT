import React, { useState, useEffect } from "react";

const CarouselSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Obtener los slides desde la API
  useEffect(() => {
    fetch("http://localhost:5000/api/slider") // Llamar a la API
      .then((response) => response.json())
      .then((data) => setSlides(data))
      .catch((error) => console.error("Error al obtener los slides:", error));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (slides.length === 0) {
    return <p>Cargando slides...</p>;
  }

  return (
    <>
      <div style={styles.outerContainer}>
        <div style={styles.sliderContainer}>
          <button style={styles.prevArrow} onClick={prevSlide}>❮</button>
          <div style={styles.slide}>
            <img 
              src={`http://localhost:5000${slides[currentIndex].image}`} 
              alt={slides[currentIndex].title} 
              style={styles.slideImage} 
              onError={(e) => { e.target.src = "http://localhost:5000/uploads/default.jpg"; }}
            />
            <div style={styles.slideContent}>
              <h2>{slides[currentIndex].title}</h2>
              <p>{slides[currentIndex].description}</p>
            </div>
          </div>
          <button style={styles.nextArrow} onClick={nextSlide}>❯</button>
        </div>
      </div>
    </>
  );
};


const styles = {
  outerContainer: {
    width: '100%',
    backgroundColor: '#ff2db', // Color #ff2db aplicado aquí
    padding: '20px 0', // Padding arriba y abajo
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ff2db', // También aplicado aquí si lo deseas
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  slideImage: {
    width: '400px', // Ancho fijo
    height: '300px', // Altura fija
    objectFit: 'cover', // Asegura que la imagen cubra el espacio sin distorsionarse
    borderRadius: '10px',
  },
  slideContent: {
    flex: 1,
    padding: '20px',
    textAlign: 'left',
  },
  slideButton: {
    backgroundColor: '#ffc914',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    transition: '0.3s ease',
  },
  prevArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '50px',
    background: 'none',
    border: 'none',
    color: 'black',
    cursor: 'pointer',
    transition: '0.3s ease',
    left: '-50px', // Aumenta el valor negativo para mover más a la izquierda
  },
  nextArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '50px',
    background: 'none',
    border: 'none',
    color: 'black',
    cursor: 'pointer',
    transition: '0.3s ease',
    right: '-50px', // Aumenta el valor positivo para mover más a la derecha
  },
};

export default CarouselSection;