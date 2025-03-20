import React, { useState, useEffect } from "react";
import { Button, Alert, Row, Col, Form, ProgressBar } from "react-bootstrap";

const Dispensador = ({ setNivelAlimento }) => {
    const [status, setStatus] = useState("Esperando acciones...");
    const [loading, setLoading] = useState(false);
    const [estadoAlimento, setEstadoAlimento] = useState("verde"); // verde, amarillo, rojo
    const [ultimaDispensacion, setUltimaDispensacion] = useState(null);
    const esp32IP = "192.168.116.118";
    
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

    const dispensarAlimento = async (gramos) => {
        if (loading) return;
        setLoading(true);
        setStatus(`Dispensando ${gramos} gramos...`);

        try {
            const response = await fetch(`http://${esp32IP}/dispensar?gramos=${gramos}`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.text();
            setStatus(`✅ ${data}`);
            setUltimaDispensacion(new Date().toLocaleString());
            
            // Simular animación de dispensación
            setTimeout(() => {
                setLoading(false);
                setStatus("Dispensación completada con éxito");
            }, 2000);
            
        } catch (error) {
            console.error("❌ Error al comunicarse con el ESP32:", error);
            setStatus("⚠️ Error al dispensar el alimento.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://${esp32IP}/leer`);
                if (!response.ok) throw new Error("Error al obtener datos del ESP32");

                const data = await response.json();
                
                // Actualizar el estado del alimento
                setEstadoAlimento(data.color);
                
                // Actualizar el nivel de alimento para el componente padre
                if (data.color === "rojo") {
                    setNivelAlimento("🔴 Vacío");
                } else if (data.color === "amarillo") {
                    setNivelAlimento("🟡 Medio");
                } else if (data.color === "verde") {
                    setNivelAlimento("🟢 Alimento Suficiente");
                }
            } catch (error) {
                console.error("❌ Error al obtener nivel de alimento:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
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
                        block 
                        onClick={() => dispensarAlimento(50)} 
                        disabled={loading}
                        className="w-100"
                    >
                        50 gramos
                    </Button>
                </Col>
            </Row>
            
            <Row className="mt-3">
                <Col md={8}>
                    <Form.Group>
                        <Form.Label style={{color: "#FFC914"}}>Cantidad personalizada (g):</Form.Label>
                        <Form.Control 
                            type="number" 
                            id="cantidadPersonalizada" 
                            placeholder="Introducir cantidad" 
                            min="10" 
                            max="500"
                            defaultValue="100"
                        />
                    </Form.Group>
                </Col>
            </Row>
            
            {/* Estilos para animación */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes caer {
                        0% { transform: translateY(0); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(80px); opacity: 0; }
                    }
                `
            }} />
        </div>
    );
};

export default Dispensador;