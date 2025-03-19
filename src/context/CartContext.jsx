import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Estados del carrito
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  
  // Recuperar carrito del localStorage al cargar la página
  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    if (savedCart) {
      try {
        setCarrito(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al recuperar el carrito:", error);
        localStorage.removeItem('carrito');
      }
    }
  }, []);
  
  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);
  
  // Abrir/cerrar el carrito
  const toggleCarrito = () => {
    setCarritoAbierto(!carritoAbierto);
  };
  
  // Función para añadir un producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const productoEnCarrito = carrito.find(item => item._id === producto._id);
    
    if (productoEnCarrito) {
      // Si ya existe, aumenta la cantidad
      setCarrito(
        carrito.map(item => 
          item._id === producto._id 
            ? { ...item, cantidad: item.cantidad + cantidad } 
            : item
        )
      );
    } else {
      // Si no existe, añádelo con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad }]);
    }
  };
  
  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };
  
  // Función para modificar la cantidad de un producto
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      setCarrito(
        carrito.map(item => 
          item._id === id 
            ? { ...item, cantidad: nuevaCantidad } 
            : item
        )
      );
    }
  };
  
  // Función para calcular el total del carrito
  const calcularTotal = (costoEnvio = 0) => {
    let total = carrito.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
    
    return (total + costoEnvio).toFixed(2);
  };
  
  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  
  // Obtener la cantidad total de productos en el carrito
  const getCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };
  
  // Función para abrir el checkout desde cualquier componente
  const abrirCheckout = () => {
    if (carrito.length === 0) {
      // Aquí podrías mostrar una notificación, pero necesitarías tenerla en el contexto
      return;
    }
    setCheckoutAbierto(true);
    setCarritoAbierto(false);
  };

  // Valor del contexto que será proporcionado
  const value = {
    carrito,
    carritoAbierto,
    setCarritoAbierto,
    checkoutAbierto,
    setCheckoutAbierto,
    toggleCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    cambiarCantidad,
    calcularTotal,
    vaciarCarrito,
    getCantidadTotal,
    abrirCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;