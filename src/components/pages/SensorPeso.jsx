// SensorPeso.jsx
import React, { useState, useEffect } from "react";

const SensorPeso = () => {
  const [peso, setPeso] = useState("Cargando...");
  const esp32IP = "192.168.116.118"; 

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://${esp32IP}/peso`);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        setPeso(`${data.peso} g`);
      } catch (error) {
        console.error("❌ Error al obtener peso:", error);
        setPeso("⚠️ Error al obtener peso");
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <h3>Peso del Alimento:</h3>
      <p className="fs-4">{peso}</p>
    </div>
  );
};

export default SensorPeso;