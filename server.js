const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Configuración básica de MQTT - Solo lo esencial
const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://localhost:1883");

// Eventos básicos de MQTT
mqttClient.on('connect', () => {
  console.log('✅ Conectado al servidor MQTT');
  
  // Suscribirse a temas básicos
  mqttClient.subscribe("sensores/peso");
  mqttClient.subscribe("sensores/distancia");
  mqttClient.subscribe("sensores/led");
  mqttClient.subscribe("sensores/servo");
});

mqttClient.on('message', (topic, message) => {
  console.log(`📩 Mensaje MQTT: ${topic} => ${message.toString()}`);
});

mqttClient.on('error', (err) => {
  console.error('❌ Error MQTT:', err.message);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Importar rutas existentes
const productosRoutes = require("./routes/productos");
const nosotrosRoutes = require("./routes/nosotros");
const inicioRoutes = require("./routes/inicio");
const sliderRoutes = require("./routes/slider");
const tiendaRoutes = require("./routes/tienda");
const pedidosRoutes = require('./routes/pedidosRoutes');
const preguntasRoutes = require("./routes/preguntas");

// Importar nuevas rutas
const AuthRoutes = require("./routes/AuthRoutes");
const MascotaRoutes = require("./routes/MascotaRoutes");
const ConfiguracionRoutes = require("./routes/ConfiguracionRoutes");

//Importar Admin
const iotRoutes = require("./routes/iotRoutes");
const adminUsuariosRoutes = require("./routes/adminUsuariosRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const historialRoutes = require("./routes/historialRoutes");
const dispositivosRoutes = require("./routes/dispositivosRoutes");
const personalizacionRoutes = require("./routes/personalizacionRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const adminCRUDUsuariosRoutes = require("./routes/adminCRUDUsuariosRoutes");
const tiendaCRUDRoutes = require("./routes/tiendaCRUDRoutes");
const procesoCompraRoutes = require("./routes/procesoCompra");
const adminPedidosRoutes = require('./routes/adminPedidosRoutes');

// Ruta simple para verificar MQTT
app.get('/api/mqtt-status', (req, res) => {
  res.json({
    mqtt: {
      conectado: mqttClient.connected
    }
  });
});

app.use("/api/proceso_compra", procesoCompraRoutes);
//rutas administrador
app.use("/api/iot", iotRoutes);
app.use("/api/admin/usuarios", adminUsuariosRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/dispositivos", dispositivosRoutes);
app.use("/api/personalizacion", personalizacionRoutes);
app.use('/uploads', express.static('public/uploads'));
app.use('/api/upload', uploadRoutes);
app.use("/api/admin/crud/usuarios", adminCRUDUsuariosRoutes);
app.use("/api/admin/crud/tienda", tiendaCRUDRoutes);
app.use("/api/admin/pedidos", adminPedidosRoutes);

// Usar rutas existentes
app.use("/api/tienda", tiendaRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/inicio", inicioRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/nosotros", nosotrosRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Usar nuevas rutas
app.use("/api/auth", AuthRoutes);
app.use("/api/mascotas", MascotaRoutes);
app.use("/api/configuracion", ConfiguracionRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// En server.js, después de conectar a MongoDB
const { testConnection } = require('./utils/cloudinaryUtils');
testConnection()
  .then(connected => {
    if (connected) {
      console.log('✅ Conexión a Cloudinary verificada');
    } else {
      console.error('❌ No se pudo conectar a Cloudinary');
    }
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});