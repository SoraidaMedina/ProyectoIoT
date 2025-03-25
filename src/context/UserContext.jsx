import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Inicializar el estado del usuario con los datos almacenados en localStorage (si existen)
  const [user, setUser] = useState(() => {
    // Intentar obtener el usuario del localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        // Parsear el usuario guardado y devolverlo como estado inicial
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  // Inicializar el token desde localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Función de login - guarda el usuario y token en el estado y en localStorage
  const login = (userData) => {
    console.log("Login con datos:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Guardar el token si está presente en la respuesta
    if (userData.token) {
      setToken(userData.token);
      localStorage.setItem("token", userData.token);
    }
  };

  // Función de logout - elimina el usuario y token del estado y de localStorage
  const logout = () => {
    console.log("Logout ejecutado");
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Efecto para verificar cambios en localStorage por otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error al parsear usuario desde storage event:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };

    // Suscribirse al evento storage para sincronizar entre pestañas
    window.addEventListener("storage", handleStorageChange);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext debe ser usado dentro de un UserProvider");
  }
  return context;
};