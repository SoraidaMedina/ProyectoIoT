const express = require("express");
const router = express.Router();
const Pregunta = require("../models/Pregunta");

// 📌 Obtener todas las preguntas
router.get("/", async (req, res) => {
  try {
    const preguntas = await Pregunta.find();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las preguntas" });
  }
});

// 📌 Agregar una nueva pregunta
router.post("/", async (req, res) => {
  try {
    const nuevaPregunta = new Pregunta(req.body);
    const preguntaGuardada = await nuevaPregunta.save();
    res.status(201).json(preguntaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar la pregunta" });
  }
});

// 📌 Eliminar una pregunta
router.delete("/:id", async (req, res) => {
  try {
    await Pregunta.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Pregunta eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la pregunta" });
  }
});

module.exports = router;
