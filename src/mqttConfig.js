import mqtt from 'mqtt';

// Dirección del broker MQTT (asegúrate que Mosquitto soporte WebSockets)
const BROKER_URL = 'ws://localhost:9001'; // Puerto WebSockets (9001)

const options = {
  clientId: `react_app_${Math.random().toString(16).substr(2, 8)}`,
  keepalive: 60,
  reconnectPeriod: 1000,
  clean: true,
};

// Crear el cliente MQTT
const client = mqtt.connect(BROKER_URL, options);

// Tópicos que usa el ESP32
const TOPICS = {
  // Tópicos para recibir datos del ESP32
  PESO: 'sensores/peso',
  DISTANCIA: 'sensores/distancia',
  LED: 'sensores/led',
  SERVO: 'sensores/servo',
  MAC: 'sensores/mac',
  IP: 'sensores/ip',
  
  // Tópicos para enviar comandos al ESP32
  DISPENSADOR: 'dispensador/accion',
  LED_CONTROL: 'led/control'
};

// Manejar eventos de conexión
client.on('connect', () => {
  console.log('✅ Conectado a MQTT desde el navegador');

  // Suscribirse a los tópicos del ESP32
  Object.values(TOPICS).forEach(topic => {
    client.subscribe(topic, (err) => {
      if (err) console.error(`❌ Error al suscribirse a ${topic}:`, err);
      else console.log(`✅ Suscrito a ${topic}`);
    });
  });
});

// Manejar errores de conexión
client.on('error', (err) => {
  console.error('❌ Error de conexión MQTT:', err);
});

// Manejar la desconexión
client.on('offline', () => {
  console.warn('⚠️ Cliente MQTT desconectado');
});

// Manejar la reconexión
client.on('reconnect', () => {
  console.log('🔄 Intentando reconectar a MQTT...');
});

// Exportar cliente y tópicos
export { client, TOPICS };
export default client;