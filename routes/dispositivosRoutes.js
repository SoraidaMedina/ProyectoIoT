// routes/dispositivosRoutes.js
const express = require("express");
const router = express.Router();
const Dispositivo = require("../models/Dispositivo");
const Usuario = require("../models/Usuario");
const HistorialActividad = require("../models/HistorialActividad");

// Obtener todos los dispositivos con información del usuario
router.get("/", async (req, res) => {
  try {
    // Obtenemos todos los dispositivos
    const dispositivos = await Dispositivo.find().sort({ fechaRegistro: -1 });
    
    // Para cada dispositivo, obtenemos el correo del usuario
    const dispositivosConCorreo = await Promise.all(
      dispositivos.map(async (dispositivo) => {
        const usuario = await Usuario.findById(dispositivo.usuarioId);
        
        return {
          id: dispositivo._id,
          correo: usuario ? usuario.email : "Usuario no encontrado",
          mac: dispositivo.mac,
          nombre: dispositivo.nombre,
          estado: dispositivo.estado,
          ultimoReinicio: dispositivo.ultimoReinicio,
          fechaRegistro: dispositivo.fechaRegistro
        };
      })
    );
    
    res.json(dispositivosConCorreo);
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    res.status(500).json({ mensaje: "Error al obtener dispositivos" });
  }
});

// Obtener un dispositivo específico
router.get("/:id", async (req, res) => {
  try {
    const dispositivo = await Dispositivo.findById(req.params.id);
    
    if (!dispositivo) {
      return res.status(404).json({ mensaje: "Dispositivo no encontrado" });
    }
    
    // Obtener información del usuario
    const usuario = await Usuario.findById(dispositivo.usuarioId);
    
    const dispositivoConUsuario = {
      ...dispositivo.toObject(),
      usuario: usuario ? {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre
      } : null
    };
    
    res.json(dispositivoConUsuario);
  } catch (error) {
    console.error("Error al obtener dispositivo:", error);
    res.status(500).json({ mensaje: "Error al obtener dispositivo" });
  }
});

// Crear un nuevo dispositivo
router.post("/", async (req, res) => {
  try {
    const { usuarioId, nombre, mac, estado } = req.body;
    
    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    // Verificar si el MAC ya existe
    const dispositivoExistente = await Dispositivo.findOne({ mac });
    if (dispositivoExistente) {
      return res.status(400).json({ mensaje: "El MAC ya está registrado" });
    }
    
    const nuevoDispositivo = new Dispositivo({
      usuarioId,
      nombre: nombre || "Dispensador",
      mac,
      estado: estado || "Apagado"
    });
    
    await nuevoDispositivo.save();
    
    // Registrar actividad
    const nuevaActividad = new HistorialActividad({
      tipo: 'dispositivo',
      accion: 'registro',
      usuarioId,
      email: usuario.email,
      descripcion: `Nuevo dispositivo registrado: ${nombre || "Dispensador"} (${mac})`,
      detalles: {
        dispositivoId: nuevoDispositivo._id,
        mac: nuevoDispositivo.mac
      }
    });
    
    await nuevaActividad.save();
    
    res.status(201).json({
      mensaje: "Dispositivo registrado correctamente",
      dispositivo: nuevoDispositivo
    });
  } catch (error) {
    console.error("Error al registrar dispositivo:", error);
    res.status(500).json({ mensaje: "Error al registrar dispositivo" });
  }
});

// Actualizar un dispositivo
router.put("/:id", async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    
    const dispositivo = await Dispositivo.findByIdAndUpdate(
      req.params.id,
      { nombre, estado },
      { new: true }
    );
    
    if (!dispositivo) {
      return res.status(404).json({ mensaje: "Dispositivo no encontrado" });
    }
    
    // Registrar actividad
    const usuario = await Usuario.findById(dispositivo.usuarioId);
    
    const nuevaActividad = new HistorialActividad({
      tipo: 'dispositivo',
      accion: 'actualización',
      usuarioId: dispositivo.usuarioId,
      email: usuario ? usuario.email : null,
      descripcion: `Dispositivo actualizado: ${dispositivo.nombre} (${dispositivo.mac})`,
      detalles: {
        dispositivoId: dispositivo._id,
        mac: dispositivo.mac,
        cambios: req.body
      }
    });
    
    await nuevaActividad.save();
    
    res.json({
      mensaje: "Dispositivo actualizado correctamente",
      dispositivo
    });
  } catch (error) {
    console.error("Error al actualizar dispositivo:", error);
    res.status(500).json({ mensaje: "Error al actualizar dispositivo" });
  }
});

// Eliminar un dispositivo
router.delete("/:id", async (req, res) => {
  try {
    const dispositivo = await Dispositivo.findById(req.params.id);
    
    if (!dispositivo) {
      return res.status(404).json({ mensaje: "Dispositivo no encontrado" });
    }
    
    // Guardar información antes de eliminar
    const dispositivoInfo = {
      id: dispositivo._id,
      usuarioId: dispositivo.usuarioId,
      nombre: dispositivo.nombre,
      mac: dispositivo.mac
    };
    
    await Dispositivo.findByIdAndDelete(req.params.id);
    
    // Registrar actividad
    const usuario = await Usuario.findById(dispositivoInfo.usuarioId);
    
    const nuevaActividad = new HistorialActividad({
      tipo: 'dispositivo',
      accion: 'eliminación',
      usuarioId: dispositivoInfo.usuarioId,
      email: usuario ? usuario.email : null,
      descripcion: `Dispositivo eliminado: ${dispositivoInfo.nombre} (${dispositivoInfo.mac})`,
      detalles: {
        mac: dispositivoInfo.mac
      }
    });
    
    await nuevaActividad.save();
    
    res.json({ mensaje: "Dispositivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    res.status(500).json({ mensaje: "Error al eliminar dispositivo" });
  }
});

// Reiniciar un dispositivo
router.post("/:id/reiniciar", async (req, res) => {
  try {
    const dispositivo = await Dispositivo.findById(req.params.id);
    
    if (!dispositivo) {
      return res.status(404).json({ mensaje: "Dispositivo no encontrado" });
    }
    
    // Actualizar fecha de último reinicio
    dispositivo.ultimoReinicio = new Date();
    await dispositivo.save();
    
    // Registrar actividad
    const usuario = await Usuario.findById(dispositivo.usuarioId);
    
    const nuevaActividad = new HistorialActividad({
      tipo: 'dispositivo',
      accion: 'reinicio',
      usuarioId: dispositivo.usuarioId,
      email: usuario ? usuario.email : null,
      descripcion: `Dispositivo reiniciado: ${dispositivo.nombre} (${dispositivo.mac})`,
      detalles: {
        dispositivoId: dispositivo._id,
        mac: dispositivo.mac
      }
    });
    
    await nuevaActividad.save();
    
    res.json({
      mensaje: "Dispositivo reiniciado correctamente",
      dispositivo
    });
  } catch (error) {
    console.error("Error al reiniciar dispositivo:", error);
    res.status(500).json({ mensaje: "Error al reiniciar dispositivo" });
  }
});

// Obtener el total de dispositivos
router.get("/total", async (req, res) => {
  try {
    const total = await Dispositivo.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error("Error al obtener total de dispositivos:", error);
    res.status(500).json({ mensaje: "Error al obtener total de dispositivos" });
  }
});

module.exports = router;