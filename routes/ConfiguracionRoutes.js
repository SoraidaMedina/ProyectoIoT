// routes/configuracionRoutes.js
const express = require("express");
const router = express.Router();
const Configuracion = require("../models/Configuracion");

// Obtener la configuración actual
router.get("/", async (req, res) => {
  try {
    // Buscar la configuración existente (debería ser solo un documento)
    let configuracion = await Configuracion.findOne();
    
    // Si no existe, crear una configuración inicial
    if (!configuracion) {
      configuracion = new Configuracion({
        vision: "",
        mision: "",
        compromiso: ""
      });
      await configuracion.save();
    }
    
    res.json(configuracion);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ mensaje: "Error al obtener la configuración" });
  }
});

// Actualizar la configuración
router.put("/", async (req, res) => {
  try {
    const { vision, mision, compromiso } = req.body;
    
    // Buscar la configuración existente
    let configuracion = await Configuracion.findOne();
    
    if (configuracion) {
      // Actualizar si existe
      configuracion.vision = vision;
      configuracion.mision = mision;
      configuracion.compromiso = compromiso;
      configuracion.fechaActualizacion = new Date();
      
      await configuracion.save();
    } else {
      // Crear nueva configuración si no existe
      configuracion = new Configuracion({
        vision,
        mision,
        compromiso
      });
      
      await configuracion.save();
    }
    
    res.json({ 
      mensaje: "Configuración actualizada correctamente",
      configuracion 
    });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ mensaje: "Error al actualizar la configuración" });
  }
});

module.exports = router;