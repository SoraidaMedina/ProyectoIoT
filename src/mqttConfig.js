// src/mqttConfig.js
import mqtt from 'mqtt';

// Dirección del broker MQTT (usando WebSockets)
const BROKER_URL = 'ws://192.168.68.102:9001'; // Cambia a la IP correcta de tu broker

// Definición de topics MQTT
export const TOPICS = {
  RAIZ: 'esp32',
  PESO: 'esp32/dispensador',
  DISTANCIA: 'esp32/distancia',
  LED: 'esp32/led',
  SERVO: 'esp32/servo',
  IP: 'esp32/ip',
  MAC: 'esp32/mac',
  COMANDO: 'esp32/comando'
};

const options = {
  clientId: `huellitas_web_${Math.random().toString(16).substring(2, 8)}`,
  keepalive: 60,
  reconnectPeriod: 1000,
  clean: true,
};

// Crear el cliente MQTT
const client = mqtt.connect(BROKER_URL, options);

// Manejar eventos de conexión
client.on('connect', () => {
  console.log('✅ Conectado a MQTT');
});

// Manejar errores de conexión
client.on('error', (err) => {
  console.error('❌ Error de conexión MQTT:', err);
});

// Manejar reconexión
client.on('reconnect', () => {
  console.log('🔄 Intentando reconectar a MQTT...');
});

// Exportar el cliente como default y también como cliente nombrado
export { client };
export default client;