const express = require("express");
const router = express.Router();
const DispositivoUsuario = require("../models/DispositivoUsuario");

// 🔹 Obtener datos de un dispositivo por MAC
router.get("/:mac", async (req, res) => {
  try {
    const dispositivo = await DispositivoUsuario.findOne({ mac: req.params.mac });

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo no encontrado" });
    }

    res.json(dispositivo);
  } catch (error) {
    console.error("❌ Error obteniendo datos del dispositivo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
