// models/Nosotros.js
const mongoose = require("mongoose");

const NosotrosSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  antecedentes: {
    titulo: String,
    descripcion1: String,
    descripcion2: String,
    imagen: String
  },
  quienesSomos: {
    titulo: String,
    descripcion: String,
    imagen: String
  },
  mision: {
    titulo: String,
    descripcion: String
  },
  vision: {
    titulo: String,
    descripcion: String
  },
  valores: [
    {
      titulo: String,
      descripcion: String
    }
  ]
});

module.exports = mongoose.model("Nosotros", NosotrosSchema, "Nosotros");