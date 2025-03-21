import React from "react";

const NivelAlimento = ({ nivelAlimento }) => {
  return (
    <div className="mt-4">
      <h3 style={{color: "#FFC914"}}>Nivel de Alimento:</h3>
      <p className="fs-4">{nivelAlimento}</p>
    </div>
  );
};

export default NivelAlimento;