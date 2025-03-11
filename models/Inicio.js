const mongoose = require("mongoose");

const InicioSchema = new mongoose.Schema(
  {
    informacion_producto: String,
    mensaje_bienvenida: String,
    banner: {
      titulo: String,
      descripcion: String,
      boton_texto: String,
      boton_url: String
    },
    carrusel_productos: [
      {
        nombre: String,
        imagen: String,
        descripcion: String
      }
    ],
    proceso_compra: String
  },
  { collection: "inicio" } // 👈 Forzamos el nombre de la colección a "inicio"
);

module.exports = mongoose.model("Inicio", InicioSchema);
