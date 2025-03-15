const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Mantenemos User como en tu código original
const nodemailer = require("nodemailer"); // Necesitarás instalar esta dependencia

const router = express.Router();

// Configuración del transporter de nodemailer (ajusta según tu proveedor de correo)
const transporter = nodemailer.createTransport({
  service: "gmail", // O configura con otros datos SMTP
  auth: {
    user: process.env.EMAIL_USER, // Guarda esto en variables de entorno
    pass: process.env.EMAIL_PASS,
  },
});

// Rutas existentes...
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario por su email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos." });
    }

    // Compara la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos." });
    }

    // Si todo está bien, devuelve los datos del usuario (sin la contraseña)
    const userData = {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      direccion: user.direccion,
      fechaRegistro: user.fechaRegistro,
    };

    res.status(200).json({ message: "Login exitoso", usuario: userData });
  } catch (err) {
    console.error("Error durante el login:", err);
    res.status(500).json({ error: "Error al conectar con el servidor." });
  }
});

router.get("/perfil/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Buscar usuario por email, excluyendo la contraseña
    const user = await User.findOne({ email }).select('-password -resetCode -resetCodeExpires');

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error al obtener el perfil:", err);
    res.status(500).json({ error: "Error al obtener el perfil del usuario" });
  }
});

router.put("/perfil/:email", async (req, res) => {
  const { email } = req.params;
  const { nombre, apellidoPaterno, apellidoMaterno, direccion } = req.body;

  try {
    // Buscar y actualizar el usuario
    const usuario = await User.findOneAndUpdate(
      { email },
      { 
        nombre, 
        apellidoPaterno, 
        apellidoMaterno, 
        direccion 
      },
      { 
        new: true, 
        select: '-password -resetCode -resetCodeExpires' 
      }
    );

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ 
      mensaje: "Perfil actualizado exitosamente", 
      usuario 
    });
  } catch (err) {
    console.error("Error al actualizar el perfil:", err);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
});

router.post("/register", async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, email, password, direccion } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !apellidoPaterno || !apellidoMaterno || !email || !password || !direccion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea un nuevo usuario
    const newUser = new User({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      password: hashedPassword,
      direccion,
    });

    // Guarda el usuario en la base de datos
    await newUser.save();

    // Respuesta exitosa
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (err) {
    console.error("Error durante el registro:", err);
    res.status(500).json({ error: `Error al registrar el usuario: ${err.message}` });
  }
});

// -------- NUEVAS RUTAS PARA RECUPERACIÓN DE CONTRASEÑA --------

router.post("/solicitar-recuperacion", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio." });
  }

  try {
    // 1. Verificar si el correo existe en la base de datos
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "El correo no está registrado." });
    }

    // 2. Generar un código de verificación
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const resetCodeExpires = Date.now() + 3600000; // Expira en 1 hora (3600000 ms)

    // 3. Guardar el código en la base de datos
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // 4. Configurar el correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER, // Correo del remitente
      to: email, // Correo del destinatario
      subject: "Código de Verificación para Recuperar Contraseña", // Asunto
      text: `Tu código de verificación es: ${resetCode}. Este código expirará en 1 hora.`, // Cuerpo del correo
    };

    // 5. Enviar el correo
    await transporter.sendMail(mailOptions);

    // 6. Respuesta exitosa
    res.status(200).json({ message: "Si el correo está registrado, recibirás un código de verificación." });
  } catch (err) {
    console.error("Error detallado en solicitar-recuperacion:", err);
    res.status(500).json({ 
      error: "Error al procesar la solicitud.", 
      details: err.message,
    });
  }
});
// 2. Verificar código
router.post("/verificar-codigo", async (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: "El correo y el código son obligatorios." });
  }

  try {
    // Buscar usuario
    const user = await User.findOne({ 
      email,
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() } // Verifica que el código no haya expirado
    });
    
    if (!user) {
      return res.status(400).json({ error: "Código inválido o expirado." });
    }

    // Código válido
    res.status(200).json({ message: "Código verificado correctamente." });
  } catch (err) {
    console.error("Error al verificar código:", err);
    res.status(500).json({ error: "Error al verificar el código." });
  }
});

// 3. Cambiar contraseña
router.post("/cambiar-contrasena", async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Buscar usuario con código válido
    const user = await User.findOne({ 
      email,
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Código inválido o expirado." });
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar contraseña y eliminar código de recuperación
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Contraseña cambiada exitosamente." });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    res.status(500).json({ error: "Error al cambiar la contraseña." });
  }
});

module.exports = router;