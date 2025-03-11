const express = require("express");
const router = express.Router();
const Slider = require("../models/Slider");

// Ruta para obtener los slides
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo datos" });
  }
});

module.exports = router;
