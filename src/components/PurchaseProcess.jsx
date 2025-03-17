import React, { useState, useEffect } from "react";

const PurchaseProcess = () => {
  const [procesoCompra, setProcesoCompra] = useState(null);
  const [pasos, setPasos] = useState([]);

  // Obtener datos de la API cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:5000/api/proceso_compra")
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Datos recibidos de la API:", data);

        if (data && data.titulo && data.descripcion) {
          setProcesoCompra(data);
        }

        if (data && data.pasos && Array.isArray(data.pasos)) {
          console.log("✅ Pasos cargados correctamente:", data.pasos);
          setPasos(data.pasos);
        } else {
          console.warn("⚠ 'pasos' no es un array o está ausente en los datos.");
        }
      })
      .catch((error) => console.error("🚨 Error al obtener los datos:", error));
  }, []);

  return (
    <>
      {/* 🔹 CSS dentro del componente sin cambios */}
      <style>
        {`
          /* Sección general (Contenedor principal) */
          .purchase-section {
            background-color: #FFF2DB; /* Color crema */
            color: black;
            text-align: center;
            padding: 50px 20px;
          }

          /* Contenedor de las tarjetas */
          .purchase-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }

          /* Tarjetas */
          .purchase-card {
            background: #1F2427; /* Color diferente al del contenedor */
            color: white;
            border: 1px solid #FFD700; /* Amarillo dorado */
            border-radius: 10px;
            padding: 20px;
            text-align: left;
            width: 300px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }

          /* Efecto de elevación al pasar el mouse */
          .purchase-card:hover {
            transform: translateY(-5px);
            box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
          }

          /* Tarjeta que ocupa todo el ancho */
          .full-width {
            width: 100%;
          }

          /* Título de la tarjeta */
          .purchase-card-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          /* Texto de la tarjeta */
          .purchase-card-text {
            font-size: 16px;
            color: #E0E0E0;
          }
        `}
      </style>

      <div className="purchase-section">
        {/* 🔹 Título y descripción dinámicos desde la API */}
        <h2 className="purchase-title">
          {procesoCompra ? procesoCompra.titulo : "Cargando..."}
        </h2>
        <p className="purchase-subtitle">
          {procesoCompra ? procesoCompra.descripcion : ""}
        </p>

        <div className="purchase-container">
          {/* 🔹 Renderización dinámica de los pasos */}
          {pasos.length > 0 ? (
            pasos.map((item, index) => (
              <div 
                key={index} 
                className={`purchase-card ${index === pasos.length - 1 ? "full-width" : ""}`}
              >
                <h3 className="purchase-card-title">{item.titulo}</h3>
                <p className="purchase-card-text">{item.descripcion}</p>
              </div>
            ))
          ) : (
            <p>Cargando pasos...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseProcess;
