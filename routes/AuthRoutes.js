const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// Ruta para iniciar sesión
router.put("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    res.json({ mensaje: "✅ Inicio de sesión exitoso" });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

// Ruta para registrar un nuevo usuario
router.put("/register", async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, email, password, direccion } = req.body;

    // Verifica si el correo ya está registrado
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ error: "❌ El correo ya está registrado" });
    }

    // Crea un nuevo usuario
    usuario = new Usuario({ nombre, apellidoPaterno, apellidoMaterno, email, password, direccion });
    await usuario.save();

    res.status(201).json({ mensaje: "✅ Usuario registrado con éxito", usuario });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ error: "❌ Error al registrar el usuario" });
  }
});

module.exports = router;