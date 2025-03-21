const mongoose = require("mongoose");

const dispensadorSchema = new mongoose.Schema({
  cantidadDispensar: {
    type: Number,
    default: 100,
    min: 10,
    max: 500
  },
  horaDispensacion: {
    type: String,
    default: "08:00",
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} no es un formato de hora válido!`
    }
  },
  nivelAlimento: {
    type: String,
    enum: ["🟢 Lleno", "🟡 Medio", "🔴 Vacío", "❓ Desconocido"],
    default: "❓ Desconocido"
  },
  modoVacaciones: {
    type: Boolean,
    default: false
  },
  ultimaDispensacion: {
    type: Date,
    default: null
  },
  historialDispensaciones: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    cantidad: {
      type: Number,
      required: true
    },
    exitoso: {
      type: Boolean,
      default: true
    }
  }],
  dispositivo: {
    ip: String,
    ultimaConexion: Date,
    firmware: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Dispensador", dispensadorSchema);