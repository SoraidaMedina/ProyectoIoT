import React, { useState, useEffect, useRef } from "react";
import { Button, Alert, Row, Col, Form } from "react-bootstrap";
import { client, TOPICS } from "../../mqttConfig";

const Dispensador = ({ setNivelAlimento }) => {
    const [status, setStatus] = useState("Esperando acciones...");
    const [loading, setLoading] = useState(false);
    const [estadoAlimento, setEstadoAlimento] = useState("verde"); // verde, amarillo, rojo
    const [estadoServo, setEstadoServo] = useState("🔒 Cerrado");
    const [ultimaDispensacion, setUltimaDispensacion] = useState(null);
    const cantidadPersonalizadaRef = useRef(null);
    
    // Estilos para elementos del dispensador
    const styles = {
        dispensadorVisual: {
            position: "relative",
            width: "100%",
            height: "240px",
            margin: "20px auto",
            backgroundColor: "#2a3438",
            borderRadius: "10px",
            border: "1px solid #334",
            overflow: "hidden",
            padding: "10px"
        },
        tolva: {
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "100px",
            backgroundColor: "#333",
            borderRadius: "10px 10px 0 0",
            overflow: "hidden"
        },
        alimentoTolva: {
            position: "absolute",
            bottom: "0",
            width: "100%",
            transition: "height 0.5s ease"
        },
        tubo: {
            position: "absolute",
            top: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "20px",
            height: "80px",
            backgroundColor: "#444"
        },
        plato: {
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "140px",
            height: "15px",
            backgroundColor: "#555",
            borderRadius: "50%"
        },
        boton: {
            backgroundColor: "#00515f",
            borderColor: "#00515f",
            margin: "5px"
        }
    };

    const dispensarAlimento = (gramos) => {
        if (loading) return;
        setLoading(true);
        setStatus(`Dispensando ${gramos} gramos...`);

        // Publicar mensaje a MQTT
        client.publish(TOPICS.DISPENSADOR, gramos.toString(), { qos: 0, retain: false });
        
        setUltimaDispensacion(new Date().toLocaleString());
        
        // Desactivamos loading después de un tiempo
        setTimeout(() => {
            setLoading(false);
            setStatus("Dispensación completada");
        }, 3000);
    };

    const dispensarCantidadPersonalizada = () => {
        const cantidad = parseInt(cantidadPersonalizadaRef.current.value);
        if (cantidad >= 10 && cantidad <= 500) {
            dispensarAlimento(cantidad);
        } else {
            setStatus("⚠️ La cantidad debe estar entre 10 y 500 gramos");
        }
    };

    useEffect(() => {
        // Manejar mensajes recibidos de MQTT
        const handleMessage = (topic, message) => {
            const msg = message.toString().trim();
            
            if (topic === TOPICS.LED) {
                // Actualizar estado de LED según mensaje
                if (msg === "rojo") {
                    setEstadoAlimento("rojo");
                    setNivelAlimento("🔴 Vacío");
                } else if (msg === "amarillo") {
                    setEstadoAlimento("amarillo");
                    setNivelAlimento("🟡 Medio");
                } else if (msg === "verde") {
                    setEstadoAlimento("verde");
                    setNivelAlimento("🟢 Lleno");
                }
            }
            
            if (topic === TOPICS.SERVO) {
                // Actualizar estado del servo
                if (msg === "abierto") {
                    setEstadoServo("🔓 Abierto");
                } else if (msg === "cerrado") {
                    setEstadoServo("🔒 Cerrado");
                }
            }
        };
        
        // Suscribirse a los mensajes
        client.on("message", handleMessage);
        
        return () => {
            // Limpiar suscripción al desmontar el componente
            client.off("message", handleMessage);
        };
    }, [setNivelAlimento]);

    // Obtener porcentaje según el nivel de alimento
    const getPorcentajeNivel = () => {
        switch (estadoAlimento) {
            case "verde": return 85;
            case "amarillo": return 45;
            case "rojo": return 15;
            default: return 0;
        }
    };

    // Obtener color según el nivel de alimento
    const getColorNivel = () => {
        switch (estadoAlimento) {
            case "verde": return "#4CAF50";
            case "amarillo": return "#FFC107";
            case "rojo": return "#F44336";
            default: return "#9E9E9E";
        }
    };

    return (
        <div className="my-4">
            <h3 className="mb-3 text-center" style={{color: "#FFC914"}}>Dispensador de Alimento</h3>
            
            {/* Visualización del dispensador */}
            <div style={styles.dispensadorVisual}>
                {/* Tolva */}
                <div style={styles.tolva}>
                    <div 
                        style={{
                            ...styles.alimentoTolva,
                            height: `${getPorcentajeNivel()}%`,
                            backgroundColor: getColorNivel()
                        }}
                    ></div>
                </div>
                
                {/* Tubo */}
                <div style={styles.tubo}>
                    {loading && (
                        <div style={{
                            position: "absolute",
                            top: "0",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#FFC914",
                            borderRadius: "50%",
                            animation: "caer 1s infinite"
                        }}></div>
                    )}
                </div>
                
                {/* Plato */}
                <div style={styles.plato}></div>
                
                {/* Sensores de nivel */}
                <div style={{
                    position: "absolute",
                    top: "30px",
                    right: "40px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: estadoAlimento === "verde" ? "#4CAF50" : "#333",
                    border: "1px solid #ccc"
                }}></div>
                <div style={{
                    position: "absolute",
                    top: "60px",
                    right: "40px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: estadoAlimento === "verde" || estadoAlimento === "amarillo" ? "#FFC107" : "#333",
                    border: "1px solid #ccc"
                }}></div>
                <div style={{
                    position: "absolute",
                    top: "90px",
                    right: "40px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: estadoAlimento === "rojo" ? "#F44336" : "#333",
                    border: "1px solid #ccc"
                }}></div>
            </div>
            
            <Row className="mt-4">
                <Col>
                    <Alert variant={loading ? "info" : status.includes("Error") ? "danger" : "success"}>
                        {status}
                    </Alert>
                </Col>
            </Row>
            
            <Row className="mt-3">
                <Col xs={12}>
                    <h5 style={{color: "#FFC914"}}>Dispensar cantidad:</h5>
                </Col>
                <Col xs={6} md={3}>
                    <Button 
                        style={styles.boton}
                        onClick={() => dispensarAlimento(50)} 
                        disabled={loading}
                        className="w-100"
                    >
                        50 gramos
                    </Button>
                </Col>
                <Col xs={6} md={3}>
                    <Button 
                        style={styles.boton}
                        onClick={() => dispensarAlimento(100)} 
                        disabled={loading}
                        className="w-100"
                    >
                        100 gramos
                    </Button>
                </Col>
            </Row>
            
            <Row className="mt-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label style={{color: "#FFC914"}}>Cantidad personalizada (g):</Form.Label>
                        <Form.Control 
                            type="number" 
                            ref={cantidadPersonalizadaRef}
                            placeholder="Introducir cantidad" 
                            min="10" 
                            max="500"
                            defaultValue="100"
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                    <Button 
                        style={styles.boton}
                        onClick={dispensarCantidadPersonalizada} 
                        disabled={loading}
                        className="w-100 mt-2"
                    >
                        Dispensar
                    </Button>
                </Col>
            </Row>
            
            <div className="mt-3 d-flex justify-content-between">
                <span>Estado del servo: {estadoServo}</span>
                {ultimaDispensacion && (
                    <span>Última dispensación: {ultimaDispensacion}</span>
                )}
            </div>
            
            {/* Estilos para animación */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes caer {
                        0% { transform: translateY(0) translateX(-50%); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(80px) translateX(-50%); opacity: 0; }
                    }
                `
            }} />
        </div>
    );
};

export default Dispensador;