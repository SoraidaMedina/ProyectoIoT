import React, { useState, useEffect } from 'react';
import { client, TOPICS } from '../../mqttConfig';

const SensorPeso = () => {
  const [peso, setPeso] = useState("Esperando datos...");

  useEffect(() => {
    // Manejar mensajes recibidos desde MQTT
    const handleMessage = (topic, message) => {
      if (topic === TOPICS.PESO) {
        const valorPeso = message.toString();
        setPeso(`${valorPeso} g`);
      }
    };

    // Suscribirse a los mensajes
    client.on('message', handleMessage);

    return () => {
      // Limpiar suscripción al desmontar el componente
      client.off('message', handleMessage);
    };
  }, []);

  return (
    <div className="mt-4">
      <h3 style={{color: "#FFC914"}}>Peso del Alimento:</h3>
      <p className="fs-4">{peso}</p>
    </div>
  );
};

export default SensorPeso;