// src/components/pages/Dispensador.jsx
import React, { useState, useEffect } from 'react';
import client, { TOPICS } from '../../mqttConfig';
import './Dispensador.css'; // Asegúrate de crear este archivo CSS

const Dispensador = () => {
  // Estado unificado para todos los datos
  const [deviceData, setDeviceData] = useState({
    // Información del dispositivo
    ip: 'Desconocida',
    mac: 'Desconocida',
    
    // Sensores
    peso: 0,
    distancia: 0,
    estadoLed: 'desconocido',
    estadoServo: 'cerrado',
    
    // Estado del dispensador
    dispensando: false,
    ultimaDispensacion: null
  });

  // Estado para controlar el bloqueo del botón
  const [botonBloqueado, setBotonBloqueado] = useState(false);
  
  // Estado para animaciones y notificaciones
  const [notificacion, setNotificacion] = useState({
    visible: false,
    mensaje: '',
    tipo: 'info' // 'info', 'success', 'warning', 'error'
  });
  
  // Estado para mostrar historial
  const [historial, setHistorial] = useState([]);
  
  // Estado para capacidad del contenedor
  const [capacidadContenedor, setCapacidadContenedor] = useState({
    total: 1000, // gramos
    disponible: 800 // gramos
  });

  useEffect(() => {
    // Generar datos de historial de ejemplo
    const historialEjemplo = [
      { fecha: new Date(Date.now() - 86400000), cantidad: 50, exitoso: true },
      { fecha: new Date(Date.now() - 172800000), cantidad: 50, exitoso: true },
      { fecha: new Date(Date.now() - 259200000), cantidad: 30, exitoso: false },
      { fecha: new Date(Date.now() - 345600000), cantidad: 50, exitoso: true },
    ];
    setHistorial(historialEjemplo);
    
    // Calcular capacidad disponible basada en el peso
    const disponible = Math.max(0, capacidadContenedor.total - deviceData.peso);
    setCapacidadContenedor(prev => ({...prev, disponible}));
    
    // Manejar mensajes recibidos desde MQTT
    const handleMessage = (topic, message) => {
      const msg = message.toString().trim();
      console.log(`Mensaje recibido en [${topic}]: ${msg}`);
      
      // Extraer el subtopic del topic completo (ej: "esp32/led" -> "led")
      const subtopic = topic.substring(topic.lastIndexOf('/') + 1);
      
      // Actualizar el estado según el subtopic
      setDeviceData(prevData => {
        const newData = { ...prevData };
        
        switch (subtopic) {
          case 'ip':
            newData.ip = msg;
            break;
            
          case 'mac':
            newData.mac = msg;
            break;
            
          case 'dispensador':
            newData.peso = parseInt(msg, 10);
            // Actualizar también la capacidad disponible
            const disponible = Math.max(0, capacidadContenedor.total - parseInt(msg, 10));
            setCapacidadContenedor(prev => ({...prev, disponible}));
            break;
            
          case 'distancia':
            newData.distancia = parseFloat(msg);
            break;
            
          case 'led':
            newData.estadoLed = msg;
            break;
            
          case 'servo':
            // Si el servo cambia de estado, actualizar el estado de dispensación
            if (msg === 'abierto') {
              newData.dispensando = true;
              newData.estadoServo = 'abierto';
              
              // Mostrar notificación
              mostrarNotificacion('Dispensación en progreso...', 'info');
            } else if (msg === 'cerrado') {
              if (newData.dispensando) {
                // Si estaba dispensando y ahora se cerró, registrar en historial
                const nuevaDispensacion = {
                  fecha: new Date(),
                  cantidad: 50,
                  exitoso: true
                };
                setHistorial(prev => [nuevaDispensacion, ...prev]);
                
                // Mostrar notificación de éxito
                mostrarNotificacion('Dispensación completada con éxito', 'success');
                
                // Actualizar última dispensación
                newData.ultimaDispensacion = new Date();
              }
              
              newData.dispensando = false;
              newData.estadoServo = 'cerrado';
              // Desbloquear el botón cuando el servo se cierra
              setBotonBloqueado(false);
            }
            break;
        }
        
        return newData;
      });
    };

    // Suscribirse al topic raíz con wildcard para recibir todos los subtopics
    const topic = `${TOPICS.RAIZ}/#`;
    
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error al suscribirse a ${topic}:`, err);
        mostrarNotificacion(`Error al conectar con el dispositivo: ${err.message}`, 'error');
      } else {
        console.log(`Suscrito a ${topic}`);
        mostrarNotificacion('Conectado al dispositivo', 'success');
      }
    });

    // Establecer el manejador de mensajes
    client.on('message', handleMessage);

    // Limpieza al desmontar el componente
    return () => {
      client.off('message', handleMessage);
      client.unsubscribe(topic);
    };
  }, []);

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo = 'info') => {
    setNotificacion({
      visible: true,
      mensaje,
      tipo
    });
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
      setNotificacion(prev => ({...prev, visible: false}));
    }, 5000);
  };

  // Función para dispensar 50 gramos de alimento
  const dispensar50Gramos = () => {
    // Verificar si el botón está bloqueado o el dispensador ya está activo
    if (botonBloqueado || deviceData.dispensando) {
      return;
    }
    
    console.log("Dispensando 50 gramos de alimento");
    
    // Bloquear el botón temporalmente para evitar múltiples clics
    setBotonBloqueado(true);
    
    // Mostrar notificación
    mostrarNotificacion('Enviando comando de dispensación...', 'info');
    
    // Publicar mensaje a MQTT
    client.publish(TOPICS.COMANDO, "dispensar");
    
    // Timeout de seguridad: si después de 10 segundos no recibimos confirmación, desbloqueamos el botón
    setTimeout(() => {
      if (botonBloqueado) {
        setBotonBloqueado(false);
        mostrarNotificacion('No se recibió confirmación del dispositivo', 'warning');
        console.log("Timeout de seguridad - desbloqueando botón");
      }
    }, 10000);
  };

  // Función para reiniciar el ESP32
  const reiniciarESP32 = () => {
    // Solo permitir reiniciar si no está dispensando
    if (!deviceData.dispensando) {
      mostrarNotificacion('Reiniciando dispositivo...', 'warning');
      client.publish(TOPICS.COMANDO, "restart");
    } else {
      mostrarNotificacion('No se puede reiniciar mientras está dispensando', 'error');
      console.log("No se puede reiniciar mientras está dispensando");
    }
  };

  // Obtener clase para el estado del LED
  const getLedClass = () => {
    switch (deviceData.estadoLed) {
      case 'verde': return 'estado-led estado-verde';
      case 'amarillo': return 'estado-led estado-amarillo';
      case 'rojo': return 'estado-led estado-rojo';
      default: return 'estado-led estado-desconocido';
    }
  };

  // Obtener texto para el estado del alimento
  const getEstadoAlimentoTexto = () => {
    switch (deviceData.estadoLed) {
      case 'verde': return 'Lleno';
      case 'amarillo': return 'Medio';
      case 'rojo': return 'Vacío';
      default: return 'Desconocido';
    }
  };

  // Formato para la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Nunca';
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  // Calcular el porcentaje de capacidad
  const porcentajeCapacidad = Math.round((capacidadContenedor.disponible / capacidadContenedor.total) * 100);
  
  // Determinar clase para el porcentaje
  const getClaseCapacidad = () => {
    if (porcentajeCapacidad > 70) return 'capacidad-alta';
    if (porcentajeCapacidad > 30) return 'capacidad-media';
    return 'capacidad-baja';
  };

  // Determinar si el botón debería estar deshabilitado
  const botonDeshabilitado = deviceData.dispensando || botonBloqueado;

  // Obtener el texto del botón de dispensación
  const getTextoBoton = () => {
    if (deviceData.dispensando) {
      return 'Dispensando...';
    } else if (botonBloqueado) {
      return 'Enviando comando...';
    } else {
      return 'Dispensar 50 gramos';
    }
  };

  return (
    <div className="dispensador-container">
      {/* Notificación */}
      {notificacion.visible && (
        <div className={`notificacion notificacion-${notificacion.tipo}`}>
          {notificacion.mensaje}
        </div>
      )}
      
      {/* Encabezado */}
      <div className="dispensador-header">
        <h1 className="dispensador-titulo">
          <img src="/img/logo-huellitas.png" alt="Logo Huellitas" className="dispensador-logo" />
          Control del Dispensador IoT
        </h1>
        <div className="dispensador-status">
          <span className={`dispositivo-status ${client.connected ? 'conectado' : 'desconectado'}`}>
            {client.connected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="dispensador-contenido">
        {/* Columna izquierda */}
        <div className="dispensador-columna">
          {/* Tarjeta de información del dispositivo */}
          <div className="dispensador-card">
            <div className="dispensador-card-header">
              <h2>Información del Dispositivo</h2>
              <span className="dispensador-card-icon">
                <i className="fas fa-microchip"></i>
              </span>
            </div>
            <div className="dispensador-card-body">
              <div className="dispositivo-info">
                <div className="info-item">
                  <span className="info-label">Dirección IP:</span>
                  <span className="info-valor">{deviceData.ip || 'Desconocida'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección MAC:</span>
                  <span className="info-valor">{deviceData.mac || 'Desconocida'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Última Actualización:</span>
                  <span className="info-valor">{formatearFecha(new Date())}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Última Dispensación:</span>
                  <span className="info-valor">{formatearFecha(deviceData.ultimaDispensacion)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de peso del alimento */}
          <div className="dispensador-card">
            <div className="dispensador-card-header">
              <h2>Peso del Alimento</h2>
              <span className="dispensador-card-icon">
                <i className="fas fa-weight"></i>
              </span>
            </div>
            <div className="dispensador-card-body">
              <div className="peso-display">
                <div className="peso-valor">{deviceData.peso}<span className="peso-unidad">g</span></div>
                <div className="peso-grafico">
                  <div className="peso-barra-contenedor">
                    <div className={`peso-barra ${getClaseCapacidad()}`} style={{width: `${porcentajeCapacidad}%`}}></div>
                  </div>
                  <div className="peso-porcentaje">{porcentajeCapacidad}% disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Columna derecha */}
        <div className="dispensador-columna">
          {/* Tarjeta de estado de sensores */}
          <div className="dispensador-card">
            <div className="dispensador-card-header">
              <h2>Estado de Sensores</h2>
              <span className="dispensador-card-icon">
                <i className="fas fa-tachometer-alt"></i>
              </span>
            </div>
            <div className="dispensador-card-body">
              <div className="sensores-grid">
                <div className="sensor-item">
                  <div className="sensor-etiqueta">Estado del Alimento</div>
                  <div className="sensor-valor">
                    <span className={getLedClass()}></span>
                    <span className="sensor-texto">{getEstadoAlimentoTexto()}</span>
                  </div>
                </div>
                
                <div className="sensor-item">
                  <div className="sensor-etiqueta">Distancia al Alimento</div>
                  <div className="sensor-valor">
                    <div className="distancia-medidor">
                      <div className="distancia-barra" style={{height: `${Math.min(100, deviceData.distancia * 5)}%`}}></div>
                    </div>
                    <span className="sensor-texto">{deviceData.distancia} cm</span>
                  </div>
                </div>
                
                <div className="sensor-item">
                  <div className="sensor-etiqueta">Estado del Servo</div>
                  <div className="sensor-valor">
                    <div className={`servo-estado ${deviceData.estadoServo === 'abierto' ? 'servo-abierto' : 'servo-cerrado'}`}>
                      <div className="servo-compuerta"></div>
                    </div>
                    <span className="sensor-texto">
                      {deviceData.estadoServo === 'abierto' ? '🔓 Abierto' : '🔒 Cerrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de control del dispensador */}
          <div className="dispensador-card">
            <div className="dispensador-card-header">
              <h2>Control del Dispensador</h2>
              <span className="dispensador-card-icon">
                <i className="fas fa-sliders-h"></i>
              </span>
            </div>
            <div className="dispensador-card-body">
              <div className="dispensador-controles">
                <button 
                  className={`boton-dispensar ${botonDeshabilitado ? 'boton-deshabilitado' : ''} ${deviceData.dispensando ? 'dispensando' : ''}`}
                  onClick={dispensar50Gramos}
                  disabled={botonDeshabilitado}
                >
                  <span className="boton-icono">
                    {deviceData.dispensando ? 
                      <i className="fas fa-spinner fa-spin"></i> : 
                      <i className="fas fa-utensils"></i>
                    }
                  </span>
                  <span className="boton-texto">{getTextoBoton()}</span>
                </button>
                
                <button 
                  className={`boton-reiniciar ${deviceData.dispensando ? 'boton-deshabilitado' : ''}`}
                  onClick={reiniciarESP32}
                  disabled={deviceData.dispensando}
                >
                  <span className="boton-icono">
                    <i className="fas fa-power-off"></i>
                  </span>
                  <span className="boton-texto">Reiniciar Dispositivo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de historial de dispensaciones */}
      <div className="dispensador-card dispensador-historial">
        <div className="dispensador-card-header">
          <h2>Historial de Dispensaciones</h2>
          <span className="dispensador-card-icon">
            <i className="fas fa-history"></i>
          </span>
        </div>
        <div className="dispensador-card-body">
          {historial.length > 0 ? (
            <div className="historial-tabla">
              <div className="historial-encabezado">
                <div className="historial-columna">Fecha</div>
                <div className="historial-columna">Cantidad</div>
                <div className="historial-columna">Estado</div>
              </div>
              {historial.map((item, index) => (
                <div key={index} className="historial-fila">
                  <div className="historial-columna">{formatearFecha(item.fecha)}</div>
                  <div className="historial-columna">{item.cantidad} g</div>
                  <div className="historial-columna">
                    <span className={`historial-estado ${item.exitoso ? 'exitoso' : 'fallido'}`}>
                      {item.exitoso ? 'Completado' : 'Fallido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="historial-vacio">
              <p>No hay dispensaciones registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispensador;