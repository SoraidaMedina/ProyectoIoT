const express = require("express");
const router = express.Router();
const Nosotros = require("../models/Nosotros");

// Ruta para obtener los datos de "Nosotros"
router.get("/", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne();
    if (!nosotros) {
      return res.status(404).json({ mensaje: "Información no encontrada" });
    }
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la información", error });
  }
});

module.exports = router;
