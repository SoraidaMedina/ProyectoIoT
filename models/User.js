const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now },
  resetCode: { type: String, default: "" },
  resetCodeExpires: { type: Date, default: null },
}, { collection: "usuarios" }); // Especifica el nombre de la colección

module.exports = mongoose.model("User", userSchema);