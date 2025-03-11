const mongoose = require("mongoose");

const TiendaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  envioGratis: Boolean,
  masVendido: Boolean,
});

module.exports = mongoose.model("Tienda", TiendaSchema, "Tienda");
