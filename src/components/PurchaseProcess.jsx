import React from "react";

const PurchaseProcess = () => {
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
        <h2 className="purchase-title">Proceso de compra fácil</h2>
        <p className="purchase-subtitle">
          Adquiere tu dispensador de forma rápida y sencilla.
        </p>

        <div className="purchase-container">
          {/* Tarjeta 1 */}
          <div className="purchase-card">
            <h3 className="purchase-card-title">Registro rápido</h3>
            <p className="purchase-card-text">
              Si eres un nuevo usuario, puedes registrarte en cuestión de minutos.
              Solo necesitas proporcionar algunos datos básicos para comenzar a
              disfrutar de nuestros servicios.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="purchase-card">
            <h3 className="purchase-card-title">Compra directa</h3>
            <p className="purchase-card-text">
              Si ya tienes una cuenta, simplemente inicia sesión y serás dirigido
              directamente a la página de pago, donde podrás completar tu compra
              en pocos clics.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="purchase-card full-width">
            <h3 className="purchase-card-title">Soporte al cliente</h3>
            <p className="purchase-card-text">
              Nuestro equipo de soporte está disponible para ayudarte en cada paso
              del proceso de compra, asegurando que tu experiencia sea fluida y
              sin problemas.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseProcess;
