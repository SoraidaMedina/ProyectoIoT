const express = require("express");
const router = express.Router();
const Inicio = require("../models/Inicio");

// Ruta para obtener los datos de Inicio
router.get("/", async (req, res) => {
  try {
    const inicio = await Inicio.find(); // Buscar todos los documentos
    if (!inicio || inicio.length === 0) {
      return res.status(404).json({ mensaje: "Información de inicio no encontrada" });
    }
    res.json(inicio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la información", error });
  }
});

module.exports = router;
