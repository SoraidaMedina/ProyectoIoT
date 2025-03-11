const express = require("express");
const router = express.Router();
const ConfiguracionDispensador = require("../models/ConfiguracionDispensador");

router.get("/configuracion", async (req, res) => {
  try {
    const configuracion = await ConfiguracionDispensador.findOne().sort({ _id: -1 });
    if (!configuracion) {
      return res.status(404).json({ error: "No hay configuración guardada" });
    }
    res.json(configuracion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la configuración" });
  }
});

router.put("/configuracion", async (req, res) => {
  try {
    const { cantidadDispensar, horaDispensacion, nivelAlimento, modoVacaciones } = req.body;

    let configuracion = await ConfiguracionDispensador.findOne();
    if (configuracion) {
      configuracion.cantidadDispensar = cantidadDispensar;
      configuracion.horaDispensacion = horaDispensacion;
      configuracion.nivelAlimento = nivelAlimento;
      configuracion.modoVacaciones = modoVacaciones;
      await configuracion.save();
    } else {
      configuracion = await ConfiguracionDispensador.create({
        cantidadDispensar,
        horaDispensacion,
        nivelAlimento,
        modoVacaciones,
      });
    }

    res.json({ mensaje: "✅ Configuración actualizada correctamente", configuracion });
  } catch (error) {
    console.error("❌ Error al actualizar configuración:", error);
    res.status(500).json({ error: "❌ Error al actualizar la configuración" });
  }
});

module.exports = router;