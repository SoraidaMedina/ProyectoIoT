import React, { useEffect, useState } from "react";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚀 Obtener usuarios desde la API
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/usuarios");
        if (!res.ok) {
          throw new Error("Error al obtener la lista de usuarios");
        }

        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError("❌ Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, []);

  return (
    <div style={styles.listaUsuariosContainer}>
      <div style={styles.listaUsuariosCard}>
        <h2 style={styles.mb4}>📋 Lista de Usuarios</h2>

        {loading ? (
          <p style={styles.listaUsuariosLoading}>Cargando usuarios...</p>
        ) : (
          <table style={styles.listaUsuariosTable}>
            <thead style={styles.listaUsuariosTableHead}>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.direccion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={styles.textCenter}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {error && <p style={styles.listaUsuariosError}>{error}</p>}
      </div>
    </div>
  );
};

// Estilos en línea con los colores proporcionados
const styles = {
  listaUsuariosContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#1F2427", // Gris oscuro
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  listaUsuariosCard: {
    padding: "20px",
    backgroundColor: "#2C3E50", // Footer
    borderRadius: "10px",
  },
  listaUsuariosTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "5px",
    overflow: "hidden",
  },
  listaUsuariosTableHead: {
    backgroundColor: "#FFC914", // Amarillo
    color: "black",
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
    padding: "10px",
    color: "#555",
  },
  listaUsuariosError: {
    color: "#FF2DB", // Rosa error
    fontWeight: "bold",
  },
};

export default ListaUsuarios;
