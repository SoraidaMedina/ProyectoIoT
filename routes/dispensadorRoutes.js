const express = require("express");
const router = express.Router();
const Dispensador = require("../models/Dispensador");

// Obtener todos los dispositivos
router.get("/", async (req, res) => {
  try {
    const dispositivos = await Dispensador.find();
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los dispositivos" });
  }
});

// Buscar por correo
router.get("/buscar", async (req, res) => {
  const { correo } = req.query;
  try {
    const dispositivos = await Dispensador.find({ correo });
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar dispositivos" });
  }
});

// Reiniciar dispositivo (actualizar último reinicio)
router.post("/reiniciar/:mac", async (req, res) => {
  try {
    await Dispensador.findOneAndUpdate(
      { mac: req.params.mac },
      { ultimo_reinicio: new Date() }
    );
    res.json({ mensaje: "Dispensador reiniciado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al reiniciar dispositivo" });
  }
});

module.exports = router;
