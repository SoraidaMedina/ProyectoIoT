import React, { useState, useEffect } from "react";

function PerfilUsuario({ usuario }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Verificar que tengamos un usuario con email
      if (!usuario || !usuario.email) {
        setError("No se ha proporcionado información de usuario");
        setLoading(false);
        return;
      }

      try {
        // Hacer fetch del perfil usando el email del usuario
        const response = await fetch(`http://localhost:5000/api/auth/perfil/${usuario.email}`);
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el perfil');
        }

        const data = await response.json();
        
        // Actualizar el estado con los datos del perfil
        setFormData({
          nombre: data.nombre || "",
          apellidoPaterno: data.apellidoPaterno || "",
          apellidoMaterno: data.apellidoMaterno || "",
          email: data.email || "",
          direccion: data.direccion || "",
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Llamar a la función para cargar el perfil
    fetchUserProfile();
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/perfil/${usuario.email}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil');
      }

      const data = await response.json();
      alert(data.mensaje || "Perfil actualizado con éxito");
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="apellidoPaterno"
          value={formData.apellidoPaterno}
          onChange={handleChange}
          placeholder="Apellido Paterno"
          required
        />
        <input
          type="text"
          name="apellidoMaterno"
          value={formData.apellidoMaterno}
          onChange={handleChange}
          placeholder="Apellido Materno"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          disabled
        />
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar Perfil"}
        </button>
      </form>
    </div>
  );
}

export default PerfilUsuario;