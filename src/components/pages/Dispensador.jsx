import React, { useState, useEffect } from "react";

const Dispensador = ({ setNivelAlimento }) => {
    const [status, setStatus] = useState("Esperando...");
    const [loading, setLoading] = useState(false);
    const [estadoAlimento, setEstadoAlimento] = useState("🟢 Lleno"); // 🔹 Estado inicial
    const esp32IP = "192.168.116.118"; // 🔹 Cambia por la IP real de tu ESP32

    const dispensarAlimento = async (gramos) => {
        if (loading) return;
        setLoading(true);
        setStatus(`Dispensando ${gramos} gramos...`);

        try {
            const response = await fetch(`http://${esp32IP}/dispensar?gramos=${gramos}`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.text();
            setStatus(data); // Muestra la respuesta del servidor
        } catch (error) {
            console.error("❌ Error al comunicarse con el ESP32:", error);
            setStatus("⚠️ Error al dispensar el alimento.");
        }

        setTimeout(() => setLoading(false), 2000); // Desactiva el estado de carga después de 2 segundos
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://${esp32IP}/leer`);
                if (!response.ok) throw new Error("Error al obtener datos del ESP32");

                const data = await response.json();
                // Mostrar el estado del alimento con su ícono correspondiente
                if (data.color === "rojo") {
                    setEstadoAlimento("🔴 Vacio");
                } else if (data.color === "amarillo") {
                    setEstadoAlimento("🟡 Medio");
                } else if (data.color === "verde") {
                    setEstadoAlimento("🟢 Lleno");
                } else {
                    setEstadoAlimento("❓ Desconocido");
                }
            } catch (error) {
                console.error("❌ Error al obtener nivel de alimento:", error);
                setEstadoAlimento("⚠️ Error al obtener datos");
            }
        }, 5000); // Actualiza cada 5 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <div>
            <button 
                className="btn btn-primary mt-3" 
                onClick={() => dispensarAlimento(50)} 
                disabled={loading}
            >
                {loading ? "Dispensando..." : "Dispensar 50 gramos"}
            </button>
            <button 
                className="btn btn-primary mt-3 ms-2" 
                onClick={() => dispensarAlimento(100)} 
                disabled={loading}
            >
                {loading ? "Dispensando..." : "Dispensar 100 gramos"}
            </button>
            <p className="mt-2">{status}</p>
            <p className="mt-2">Estado del alimento: {estadoAlimento}</p>
        </div>
    );
};

export default Dispensador;