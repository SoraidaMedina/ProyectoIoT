//RegitrarDispositivos.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import RegistroDispositivo from '../RegistroDispositivo';
import { useNavigate } from 'react-router-dom';

const RegistrarDispositivo = () => {
  const navigate = useNavigate();
  
  // Función para manejar el registro exitoso
  const handleRegistroExitoso = (nuevoDispositivo) => {
    // Mostrar alerta de éxito
    alert('Dispositivo registrado correctamente');
    // Redirigir a la página de control del dispositivo
    navigate(`/Estado-Dispensador?id=${nuevoDispositivo.dispositivo._id}`);
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="text-center mb-4">Registro de Dispositivo IoT</h2>
      <p className="text-center mb-4">
        Registra tu dispensador Huellitas para comenzar a monitorear y controlar tu dispositivo.
      </p>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <RegistroDispositivo onRegistroExitoso={handleRegistroExitoso} />
        </div>
      </div>
    </Container>
  );
};  

export default RegistrarDispositivo;