const mongoose = require("mongoose");

const DispensadorSchema = new mongoose.Schema({
  correo: { type: String, required: true },
  mac: { type: String, required: true, unique: true },
  estado: { type: String, enum: ["Encendido", "Apagado"], default: "Apagado" },
  alimento: { type: String, required: true },
  recipiente: { type: String, required: true },
  alimento_dispensado: { type: Number, default: 0 },
  ultimo_reinicio: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dispensador", DispensadorSchema);
