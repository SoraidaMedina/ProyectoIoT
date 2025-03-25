// src/components/RegistroDispositivo.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';

const RegistroDispositivo = ({ onRegistroExitoso }) => {
  const { user, token } = useUserContext();
  
  const [macAddress, setMacAddress] = useState('');
  const [nombre, setNombre] = useState('');
  const [mascota, setMascota] = useState({
    nombre: '',
    tipo: 'perro',
    raza: '',
    peso: '',
    edad: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [dispositivoInfo, setDispositivoInfo] = useState(null);
  const [verificando, setVerificando] = useState(false);
  
  // Función para formatear MAC
  const formatearMAC = (value) => {
    // Eliminar cualquier caracter que no sea hexadecimal
    let mac = value.replace(/[^0-9A-Fa-f]/g, '');
    
    // Formatear con : cada 2 caracteres
    let macFormateada = '';
    for (let i = 0; i < mac.length && i < 12; i++) {
      if (i > 0 && i % 2 === 0) {
        macFormateada += ':';
      }
      macFormateada += mac[i];
    }
    
    return macFormateada;
  };
  
  // Handler para cambio en MAC
  const handleMacChange = (e) => {
    const value = e.target.value;
    setMacAddress(formatearMAC(value));
  };
  
  // Verificar disponibilidad de MAC
  const verificarMAC = async () => {
    // Validar formato
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(macAddress)) {
      setError('Formato de dirección MAC inválido. Use formato XX:XX:XX:XX:XX:XX');
      return;
    }
    
    setVerificando(true);
    setError('');
    setDispositivoInfo(null);
    
    try {
      // Usar ruta relativa para conectar con el backend
      const response = await fetch(`http://localhost:5000/api/dispositivos-usuario/verificar/${macAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDispositivoInfo(data.data);
        
        if (!data.data.disponible) {
          setError(`Este dispositivo ya está registrado por ${data.data.propietario?.nombre || 'otro usuario'}`);
        } else {
          setMensaje('Dispositivo disponible para registro');
        }
      } else {
        setError(data.message || 'Error al verificar el dispositivo');
      }
    } catch (err) {
      setError('Error de conexión al verificar el dispositivo');
      console.error(err);
    } finally {
      setVerificando(false);
    }
  };
  
  // Registrar dispositivo
  const registrarDispositivo = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!macAddress) {
      setError('La dirección MAC es obligatoria');
      return;
    }
    
    if (!nombre) {
      setError('El nombre del dispositivo es obligatorio');
      return;
    }
    
    setLoading(true);
    setError('');
    setMensaje('');
    
    try {
      // Usar ruta relativa para conectar con el backend
      const response = await fetch('http://localhost:5000/api/dispositivos-usuario', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          macAddress,
          nombre,
          mascota: {
            nombre: mascota.nombre || '',
            tipo: mascota.tipo || 'perro',
            raza: mascota.raza || '',
            peso: mascota.peso ? parseFloat(mascota.peso) : null,
            edad: mascota.edad ? parseInt(mascota.edad) : null
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMensaje('Dispositivo registrado correctamente');
        
        // Limpiar formulario
        setMacAddress('');
        setNombre('');
        setMascota({
          nombre: '',
          tipo: 'perro',
          raza: '',
          peso: '',
          edad: ''
        });
        
        // Notificar éxito al componente padre
        if (onRegistroExitoso) {
          onRegistroExitoso(data.data);
        }
      } else {
        setError(data.message || 'Error al registrar el dispositivo');
      }
    } catch (err) {
      setError('Error de conexión al registrar el dispositivo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Registro de Dispensador</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        
        <Form onSubmit={registrarDispositivo}>
          <Form.Group className="mb-3">
            <Form.Label>Dirección MAC del Dispensador</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="XX:XX:XX:XX:XX:XX"
                value={macAddress}
                onChange={handleMacChange}
                required
                maxLength={17}
                disabled={loading}
              />
              <Button 
                variant="outline-secondary" 
                onClick={verificarMAC}
                disabled={verificando || macAddress.length < 17}
              >
                {verificando ? <Spinner size="sm" animation="border" /> : 'Verificar'}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              La dirección MAC se encuentra en la etiqueta del dispositivo o en la configuración WiFi.
            </Form.Text>
          </Form.Group>
          
          {dispositivoInfo && dispositivoInfo.disponible && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Dispensador</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. Dispensador de Rocky"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>
              
              <h6 className="mb-3">Información de la Mascota (Opcional)</h6>
              
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Mascota</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de tu mascota"
                  value={mascota.nombre}
                  onChange={(e) => setMascota({...mascota, nombre: e.target.value})}
                  disabled={loading}
                />
              </Form.Group>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Mascota</Form.Label>
                    <Form.Select
                      value={mascota.tipo}
                      onChange={(e) => setMascota({...mascota, tipo: e.target.value})}
                      disabled={loading}
                    >
                      <option value="perro">Perro</option>
                      <option value="gato">Gato</option>
                      <option value="otro">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Raza</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Raza de tu mascota"
                      value={mascota.raza}
                      onChange={(e) => setMascota({...mascota, raza: e.target.value})}
                      disabled={loading}
                    />
                  </Form.Group>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Peso (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Peso en kg"
                      value={mascota.peso}
                      onChange={(e) => setMascota({...mascota, peso: e.target.value})}
                      disabled={loading}
                      min="0"
                      step="0.1"
                    />
                  </Form.Group>
                </div>
                
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Edad (meses)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Edad en meses"
                      value={mascota.edad}
                      onChange={(e) => setMascota({...mascota, edad: e.target.value})}
                      disabled={loading}
                      min="0"
                    />
                  </Form.Group>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Registrando...
                  </>
                ) : 'Registrar Dispensador'}
              </Button>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistroDispositivo;