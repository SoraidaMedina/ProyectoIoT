import React, { useState, useEffect } from 'react';
import { client, TOPICS } from '../../mqttConfig';

const SensorPeso = () => {
  const [peso, setPeso] = useState("Esperando datos...");

  useEffect(() => {
    // Usar funciones anónimas directamente para evitar problemas de referencia
    client.on('message', (topic, message) => {
      if (topic === TOPICS.PESO) {
        const valorPeso = message.toString();
        setPeso(`${valorPeso} g`);
      }
    });

    return () => {
      // Limpiar suscripción sin referencia específica
      client.off('message');
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