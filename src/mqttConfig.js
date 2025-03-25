// src/mqttConfig.js
import mqtt from 'mqtt';

// Usar WebSockets para conexión desde el navegador
const MQTT_BROKER = 'ws://localhost:9001'; // Usando WebSockets para navegador

// Configurar topics de MQTT
export const TOPICS = {
  RAIZ: 'esp32',
  PESO: 'dispensador',
  DISTANCIA: 'distancia',
  LED: 'led',
  SERVO: 'servo',
  IP: 'ip',
  MAC: 'mac',
  COMANDO: 'comando'
};

// Crear cliente MQTT
const options = {
  clientId: `mqtt-huellitas-web-${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000
};

// Crear cliente MQTT - Exportándolo como default y como named export
const client = mqtt.connect(MQTT_BROKER, options);

// Configurar manejadores de eventos básicos
client.on('connect', () => {
  console.log('Conectado al broker MQTT');
});

client.on('error', (err) => {
  console.error('Error MQTT:', err);
});

client.on('offline', () => {
  console.log('MQTT desconectado');
});

// Exportación por defecto y con nombre para compatibilidad
export { client };
export default client;