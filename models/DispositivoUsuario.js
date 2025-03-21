const mongoose = require("mongoose");

const dispositivoUsuarioSchema = new mongoose.Schema({
  // Usuario es opcional (el dispositivo puede registrarse antes de asignarlo a un usuario)
  usuario_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: false,
    default: null
  },
  
  // Información del dispositivo
  mac: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  ip: { 
    type: String, 
    required: false,
    default: "Pendiente" 
  },
  
  // Sensores
  peso: { 
    type: Number, 
    default: 0 
  },
  distancia: { 
    type: Number, 
    default: 0 
  },
  potenciometro: {
    type: Number,
    default: 0
  },
  
  // Estados
  estado_led: { 
    type: String, 
    enum: ["encendido", "apagado", "verde", "amarillo", "rojo", "desconocido"],
    default: "desconocido" 
  },
  estado_servo: { 
    type: String, 
    enum: ["abierto", "cerrado", "desconocido"],
    default: "cerrado" 
  },
  
  // Timestamping
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  // Configuración del dispositivo
  configuracion: {
    cantidadDispensar: {
      type: Number,
      default: 100
    },
    horaDispensacion: {
      type: String,
      default: "08:00"
    },
    modoVacaciones: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

// Índice para búsquedas rápidas por MAC
dispositivoUsuarioSchema.index({ mac: 1 });

// Índice por fecha de última actividad
dispositivoUsuarioSchema.index({ lastSeen: -1 });

module.exports = mongoose.model("DispositivoUsuario", dispositivoUsuarioSchema);