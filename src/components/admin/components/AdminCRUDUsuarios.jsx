import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  FaUser, 
  FaUserPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaTimes, 
  FaCheck, 
  FaEye, 
  FaEyeSlash, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaFilter, 
  FaCloudUploadAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaArrowLeft, 
  FaArrowRight,
  FaShieldAlt,
  FaKey,
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaSyncAlt,
  FaCopy,
  FaUserShield,
  FaSave,
  FaUndo,
  FaPhoneAlt
} from "react-icons/fa";

// URL base para todas las llamadas a la API
const API_BASE_URL = 'http://localhost:5000';

// Constantes para paginación
const ITEMS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5;

// Constantes para validación
const VALIDATION = {
  nombre: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
    message: {
      required: "El nombre es obligatorio",
      min: "El nombre debe tener al menos 2 caracteres",
      max: "El nombre no puede exceder los 50 caracteres",
      pattern: "El nombre solo puede contener letras y espacios"
    }
  },
  apellido: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/,
    message: {
      min: "El apellido debe tener al menos 2 caracteres",
      max: "El apellido no puede exceder los 50 caracteres",
      pattern: "El apellido solo puede contener letras y espacios"
    }
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: {
      required: "El email es obligatorio",
      pattern: "Por favor, introduce un email válido"
    }
  },
  password: {
    min: 8,
    max: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: {
      required: "La contraseña es obligatoria",
      min: "La contraseña debe tener al menos 8 caracteres",
      max: "La contraseña no puede exceder los 100 caracteres",
      pattern: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial"
    }
  },
  telefono: {
    pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
    message: {
      pattern: "Por favor, introduce un número de teléfono válido"
    }
  },
  direccion: {
    max: 200,
    message: {
      max: "La dirección no puede exceder los 200 caracteres"
    }
  },
  imagenSize: 5 * 1024 * 1024, // 5MB en bytes
  imagenTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  imagenMessage: {
    size: "La imagen no debe exceder los 5MB",
    type: "El archivo debe ser una imagen (JPEG, PNG, GIF, WEBP)"
  }
};

/**
 * Validador de seguridad para contraseñas
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Resultado de validación y puntuación
 */
const validatePasswordStrength = (password) => {
  if (!password) return { valid: false, score: 0, feedback: "Introduce una contraseña" };
  
  let score = 0;
  const feedback = [];
  
  // Longitud mínima
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("La contraseña es demasiado corta");
  }
  
  // Contiene minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Añade letras minúsculas");
  }
  
  // Contiene mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Añade letras mayúsculas");
  }
  
  // Contiene números
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Añade números");
  }
  
  // Contiene caracteres especiales
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Añade caracteres especiales");
  }

  // Evaluación final
  return {
    valid: score >= 4,
    score: score,
    feedback: feedback.length > 0 ? feedback.join(", ") : "Contraseña segura"
  };
};

/**
 * Sanitiza un texto para prevenir inyecciones y problemas de seguridad
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
const sanitizeText = (text) => {
  if (!text) return '';
  
  // Convertir a string si no lo es
  text = String(text);
  
  // Eliminar espacios al inicio y final
  text = text.trim();
  
  // Escapar caracteres HTML especiales
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
    
  return text;
};

const AdminCRUDUsuarios = () => {
  // Estados para gestión de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [usuarioExpandido, setUsuarioExpandido] = useState(null);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados para formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    valid: false,
    score: 0,
    feedback: ""
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    imagenUrl: "",
    imagenPublicId: "",
    role: "usuario"
  });
  
  // Estados para búsqueda y filtrado
  const [filtros, setFiltros] = useState({
    nombre: "",
    email: "",
    role: "",
    fechaDesde: "",
    fechaHasta: ""
  });
  
  // Estados para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: 'fechaRegistro',
    direction: 'desc'
  });
  
  // Estados de validación
  const [fileError, setFileError] = useState("");
  
  // Referencias
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // =========================================================================
  // EFECTOS
  // =========================================================================
  
  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);
  
  // Actualizar usuarios filtrados cuando cambian los filtros o el ordenamiento
  useEffect(() => {
    aplicarFiltrosYOrdenamiento();
  }, [usuarios, filtros, sortConfig]);
  
  // Calcular páginas totales cuando cambian los usuarios filtrados
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE)));
    if (paginaActual > Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE)) {
      setPaginaActual(1);
    }
  }, [usuariosFiltrados, paginaActual]);
  
  // Evaluar fortaleza de contraseña cuando cambia
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(validatePasswordStrength(formData.password));
    } else {
      setPasswordStrength({
        valid: false,
        score: 0,
        feedback: ""
      });
    }
  }, [formData.password]);
  
  // =========================================================================
  // FUNCIONES PARA NOTIFICACIONES
  // =========================================================================
  
  /**
   * Muestra una notificación al usuario (versión simplificada)
   */
  const showNotification = (message, type = "success") => {
    // Aquí puedes implementar tu sistema de notificaciones
    // Por ahora solo usamos un console.log para simularlo
    console.log(`[${type.toUpperCase()}]: ${message}`);
    
    // Si tienes un componente de notificación, podrías usarlo así:
    // setNotification({ visible: true, message, type });
  };
  
  // =========================================================================
  // FUNCIONES PARA GESTIÓN DE USUARIOS
  // =========================================================================
  
  /**
   * Carga todos los usuarios desde la API
   */
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios`);
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsuarios(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      showNotification(`Error al cargar los usuarios: ${error.message}`, "error");
      setLoading(false);
    }
  };
  
  /**
   * Aplica filtros y ordenamiento a los usuarios
   */
  const aplicarFiltrosYOrdenamiento = () => {
    // Primero aplicamos los filtros
    let resultado = [...usuarios];
    
    // Filtrar por nombre
    if (filtros.nombre) {
      const nombreLimpio = sanitizeText(filtros.nombre.toLowerCase());
      if (nombreLimpio) {
        resultado = resultado.filter(usuario => 
          `${usuario.nombre || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.toLowerCase()
          .includes(nombreLimpio)
        );
      }
    }
    
    // Filtrar por email
    if (filtros.email) {
      const emailLimpio = sanitizeText(filtros.email.toLowerCase());
      if (emailLimpio) {
        resultado = resultado.filter(usuario => 
          (usuario.email || '').toLowerCase().includes(emailLimpio)
        );
      }
    }
    
    // Filtrar por rol
    if (filtros.role) {
      resultado = resultado.filter(usuario => 
        usuario.role === filtros.role
      );
    }
    
    // Filtrar por fecha desde
    if (filtros.fechaDesde) {
      try {
        const fechaDesde = new Date(filtros.fechaDesde);
        if (!isNaN(fechaDesde.getTime())) {
          resultado = resultado.filter(usuario => 
            new Date(usuario.fechaRegistro || 0) >= fechaDesde
          );
        }
      } catch (error) {
        console.error("Error al filtrar por fecha desde:", error);
      }
    }
    
    // Filtrar por fecha hasta
    if (filtros.fechaHasta) {
      try {
        const fechaHasta = new Date(filtros.fechaHasta);
        if (!isNaN(fechaHasta.getTime())) {
          fechaHasta.setHours(23, 59, 59, 999); // Final del día
          resultado = resultado.filter(usuario => 
            new Date(usuario.fechaRegistro || 0) <= fechaHasta
          );
        }
      } catch (error) {
        console.error("Error al filtrar por fecha hasta:", error);
      }
    }
    
    // Luego aplicamos el ordenamiento
    if (sortConfig.key) {
      resultado.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Manejar campos específicos
        if (sortConfig.key === 'nombre') {
          aValue = `${a.nombre || ''} ${a.apellidoPaterno || ''} ${a.apellidoMaterno || ''}`;
          bValue = `${b.nombre || ''} ${b.apellidoPaterno || ''} ${b.apellidoMaterno || ''}`;
        }
        
        // Ordenar fechas
        if (sortConfig.key === 'fechaRegistro') {
          aValue = new Date(a.fechaRegistro || 0).getTime();
          bValue = new Date(b.fechaRegistro || 0).getTime();
        }
        
        // Manejar valores nulos
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';
        
        // Comparar
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setUsuariosFiltrados(resultado);
  };
  
  /**
   * Cambia el criterio de ordenamiento
   * @param {string} key - Campo por el que ordenar
   */
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  /**
   * Obtiene el icono de ordenamiento para una columna
   * @param {string} key - Campo a evaluar
   * @returns {JSX.Element} - Icono correspondiente
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort style={{ color: "#ccc", fontSize: "14px" }} />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <FaSortUp style={{ color: "#00515F", fontSize: "14px" }} />
      : <FaSortDown style={{ color: "#00515F", fontSize: "14px" }} />;
  };
  
  /**
   * Formatea el nombre completo de un usuario
   * @param {Object} usuario - Usuario a formatear
   * @returns {string} - Nombre completo
   */
  const formatearNombreCompleto = (usuario) => {
    return `${usuario.nombre || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim();
  };

  /**
   * Actualiza el estado de los filtros
   * @param {Event} e - Evento de cambio
   */
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Limpia todos los filtros
   */
  const limpiarFiltros = () => {
    setFiltros({
      nombre: "",
      email: "",
      role: "",
      fechaDesde: "",
      fechaHasta: ""
    });
  };
  
  /**
   * Maneja cambios en el formulario de usuario
   * @param {Event} e - Evento de cambio
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitizar y validar según el tipo de campo
    switch (name) {
      case 'nombre':
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        // Permitir solo letras y espacios
        sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
        break;
        
      case 'telefono':
        // Permitir solo números, +, -, (), espacios
        sanitizedValue = value.replace(/[^\d+\-() ]/g, '');
        break;
        
      case 'email':
        // No aplicamos regex para permitir la validación estándar de email
        break;
        
      default:
        // Para otros campos, solo eliminamos caracteres peligrosos
        sanitizedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Limpiar error específico al modificar el campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Validación específica para confirmación de contraseña
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && formData.password && value !== formData.password) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: "Las contraseñas no coinciden"
        }));
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: "Las contraseñas no coinciden"
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };
  
  /**
   * Maneja la subida de imágenes
   * @param {Event} e - Evento de cambio
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Limpiar error previo
    setFileError("");
    
    // Validar tipo de archivo
    if (!VALIDATION.imagenTypes.includes(file.type)) {
      setFileError(VALIDATION.imagenMessage.type);
      e.target.value = '';
      return;
    }
    
    // Validar tamaño
    if (file.size > VALIDATION.imagenSize) {
      setFileError(VALIDATION.imagenMessage.size);
      e.target.value = '';
      return;
    }
    
    // Mostrar vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Subir la imagen
    setUploadingImage(true);
    
    try {
      const formDataImg = new FormData();
      formDataImg.append('imagen', file);
      
      const response = await fetch(`${API_BASE_URL}/api/upload/usuario`, {
        method: "POST",
        body: formDataImg,
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir la imagen: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validar respuesta del servidor
      if (!data.url) {
        throw new Error("El servidor no devolvió una URL de imagen válida");
      }
      
      // Actualizar formulario con la URL y el ID
      setFormData(prev => ({
        ...prev,
        imagenUrl: data.url,
        imagenPublicId: data.publicId || ""
      }));
      
      showNotification("Imagen subida correctamente", "success");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setFileError(`Error al subir la imagen: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };
  
  /**
   * Valida el formulario de usuario
   * @returns {boolean} - Indica si el formulario es válido
   */
  const validarFormulario = () => {
    const errores = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      errores.nombre = VALIDATION.nombre.message.required;
    } else if (formData.nombre.trim().length < VALIDATION.nombre.min) {
      errores.nombre = VALIDATION.nombre.message.min;
    } else if (formData.nombre.trim().length > VALIDATION.nombre.max) {
      errores.nombre = VALIDATION.nombre.message.max;
    } else if (!VALIDATION.nombre.pattern.test(formData.nombre)) {
      errores.nombre = VALIDATION.nombre.message.pattern;
    }
    
    // Validar apellidos (opcional)
    if (formData.apellidoPaterno) {
      if (formData.apellidoPaterno.length < VALIDATION.apellido.min) {
        errores.apellidoPaterno = VALIDATION.apellido.message.min;
      } else if (formData.apellidoPaterno.length > VALIDATION.apellido.max) {
        errores.apellidoPaterno = VALIDATION.apellido.message.max;
      } else if (!VALIDATION.apellido.pattern.test(formData.apellidoPaterno)) {
        errores.apellidoPaterno = VALIDATION.apellido.message.pattern;
      }
    }
    
    if (formData.apellidoMaterno) {
      if (formData.apellidoMaterno.length < VALIDATION.apellido.min) {
        errores.apellidoMaterno = VALIDATION.apellido.message.min;
      } else if (formData.apellidoMaterno.length > VALIDATION.apellido.max) {
        errores.apellidoMaterno = VALIDATION.apellido.message.max;
      } else if (!VALIDATION.apellido.pattern.test(formData.apellidoMaterno)) {
        errores.apellidoMaterno = VALIDATION.apellido.message.pattern;
      }
    }
    
    // Validar email
    if (!formData.email.trim()) {
      errores.email = VALIDATION.email.message.required;
    } else if (!VALIDATION.email.pattern.test(formData.email)) {
      errores.email = VALIDATION.email.message.pattern;
    }
    
    // Validar contraseña en modo creación
    if (!modoEdicion) {
      if (!formData.password) {
        errores.password = VALIDATION.password.message.required;
      } else if (formData.password.length < VALIDATION.password.min) {
        errores.password = VALIDATION.password.message.min;
      } else if (formData.password.length > VALIDATION.password.max) {
        errores.password = VALIDATION.password.message.max;
      } else if (!passwordStrength.valid) {
        errores.password = passwordStrength.feedback;
      }
      
      if (formData.password !== formData.confirmPassword) {
        errores.confirmPassword = "Las contraseñas no coinciden";
      }
    } else if (formData.password) {
      // En modo edición, validar solo si se proporciona una contraseña
      if (formData.password.length < VALIDATION.password.min) {
        errores.password = VALIDATION.password.message.min;
      } else if (formData.password.length > VALIDATION.password.max) {
        errores.password = VALIDATION.password.message.max;
      } else if (!passwordStrength.valid) {
        errores.password = passwordStrength.feedback;
      }
      
      if (formData.password !== formData.confirmPassword) {
        errores.confirmPassword = "Las contraseñas no coinciden";
      }
    }
    
    // Validar teléfono (opcional)
    if (formData.telefono && !VALIDATION.telefono.pattern.test(formData.telefono)) {
      errores.telefono = VALIDATION.telefono.message.pattern;
    }
    
    // Validar dirección (opcional)
    if (formData.direccion && formData.direccion.length > VALIDATION.direccion.max) {
      errores.direccion = VALIDATION.direccion.message.max;
    }
    
    // Validar error de imagen
    if (fileError) {
      errores.imagen = fileError;
    }
    
    setFormErrors(errores);
    return Object.keys(errores).length === 0;
  };
  
  /**
   * Cambia la página actual
   * @param {number} page - Número de página
   */
  const cambiarPagina = (page) => {
    if (page < 1 || page > totalPages) return;
    setPaginaActual(page);
  };
  
  /**
   * Prepara el formulario para añadir un nuevo usuario
   */
  const prepararNuevoUsuario = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      direccion: "",
      imagenUrl: "",
      imagenPublicId: "",
      role: "usuario"
    });
    setPreviewImage(null);
    setFormErrors({});
    setFileError("");
    setPasswordStrength({
      valid: false,
      score: 0,
      feedback: ""
    });
    setPasswordVisible(false);
    setMostrarFormulario(true);
    
    // Enfocar primer campo
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };
  
  /**
   * Prepara el formulario para editar un usuario existente
   * @param {Object} usuario - Usuario a editar
   */
  const prepararEdicion = (usuario) => {
    setUsuarioEditando(usuario._id);
    setModoEdicion(true);
    setFormData({
      nombre: usuario.nombre || "",
      apellidoPaterno: usuario.apellidoPaterno || "",
      apellidoMaterno: usuario.apellidoMaterno || "",
      email: usuario.email || "",
      password: "",
      confirmPassword: "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      imagenUrl: usuario.imagenUrl || "",
      imagenPublicId: usuario.imagenPublicId || "",
      role: usuario.role || "usuario"
    });
    setPreviewImage(usuario.imagenUrl || null);
    setFormErrors({});
    setFileError("");
    setPasswordStrength({
      valid: false,
      score: 0,
      feedback: ""
    });
    setPasswordVisible(false);
    setMostrarFormulario(true);
    
    // Enfocar primer campo
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };
  
  /**
   * Cancela la edición y vuelve al listado
   */
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      direccion: "",
      imagenUrl: "",
      imagenPublicId: "",
      role: "usuario"
    });
    setPreviewImage(null);
    setFormErrors({});
    setFileError("");
    setPasswordStrength({
      valid: false,
      score: 0,
      feedback: ""
    });
    setPasswordVisible(false);
    setMostrarFormulario(false);
  };
  
  /**
   * Crea un nuevo usuario
   * @param {Event} e - Evento del formulario
   */
  const crearUsuario = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validarFormulario()) {
      showNotification("Por favor corrija los errores en el formulario", "error");
      return;
    }
    
    // Preparar datos para enviar
    const datosUsuario = { ...formData };
    delete datosUsuario.confirmPassword;
    
    // Sanitizar datos
    datosUsuario.nombre = sanitizeText(datosUsuario.nombre);
    datosUsuario.apellidoPaterno = sanitizeText(datosUsuario.apellidoPaterno);
    datosUsuario.apellidoMaterno = sanitizeText(datosUsuario.apellidoMaterno);
    datosUsuario.email = sanitizeText(datosUsuario.email);
    datosUsuario.telefono = sanitizeText(datosUsuario.telefono);
    datosUsuario.direccion = sanitizeText(datosUsuario.direccion);
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `Error del servidor: ${response.status}`);
      }
      
      // Actualizar lista de usuarios
      await cargarUsuarios();
      
      // Mostrar notificación y resetear formulario
      showNotification("Usuario creado correctamente", "success");
      cancelarEdicion();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      
      // Manejar errores específicos
      if (error.message.includes("email ya existe")) {
        setFormErrors(prev => ({
          ...prev,
          email: "Este email ya está registrado en el sistema"
        }));
        showNotification("El email ya está en uso", "error");
      } else {
        showNotification(`Error al crear el usuario: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualiza un usuario existente
   * @param {Event} e - Evento del formulario
   */
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validarFormulario()) {
      showNotification("Por favor corrija los errores en el formulario", "error");
      return;
    }
    
    // Preparar datos para enviar
    const datosUsuario = { ...formData };
    delete datosUsuario.confirmPassword;
    
    // Si no se proporciona contraseña, la eliminamos
    if (!datosUsuario.password) {
      delete datosUsuario.password;
    }
    
    // Sanitizar datos
    datosUsuario.nombre = sanitizeText(datosUsuario.nombre);
    datosUsuario.apellidoPaterno = sanitizeText(datosUsuario.apellidoPaterno);
    datosUsuario.apellidoMaterno = sanitizeText(datosUsuario.apellidoMaterno);
    datosUsuario.email = sanitizeText(datosUsuario.email);
    datosUsuario.telefono = sanitizeText(datosUsuario.telefono);
    datosUsuario.direccion = sanitizeText(datosUsuario.direccion);
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${usuarioEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `Error del servidor: ${response.status}`);
      }
      
      // Actualizar lista de usuarios
      await cargarUsuarios();
      
      // Mostrar notificación y resetear formulario
      showNotification("Usuario actualizado correctamente", "success");
      cancelarEdicion();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      
      // Manejar errores específicos
      if (error.message.includes("email ya existe")) {
        setFormErrors(prev => ({
          ...prev,
          email: "Este email ya está registrado por otro usuario"
        }));
        showNotification("El email ya está en uso por otro usuario", "error");
      } else {
        showNotification(`Error al actualizar el usuario: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario a eliminar
   * @param {string} nombre - Nombre del usuario para la confirmación
   */
  const eliminarUsuario = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) {
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${id}`, {
          method: "DELETE",
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || `Error del servidor: ${response.status}`);
        }
        
        // Actualizar lista de usuarios
        await cargarUsuarios();
        
        // Cerrar panel expandido si es el usuario eliminado
        if (usuarioExpandido === id) {
          setUsuarioExpandido(null);
        }
        
        // Mostrar notificación
        showNotification("Usuario eliminado correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        showNotification(`Error al eliminar el usuario: ${error.message}`, "error");
      } finally {
        setLoading(false);
      }
    }
  };
  
  /**
   * Expande o contrae la vista detallada de un usuario
   * @param {string} id - ID del usuario
   */
  const toggleExpandirUsuario = (id) => {
    if (usuarioExpandido === id) {
      setUsuarioExpandido(null);
    } else {
      setUsuarioExpandido(id);
    }
  };
  
  /**
   * Copia texto al portapapeles
   * @param {string} text - Texto a copiar
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("ID copiado al portapapeles", "success");
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      showNotification("No se pudo copiar al portapapeles", "error");
    }
  };
  
  /**
   * Formatea una fecha para mostrarla en la interfaz
   * @param {string|Date} dateString - Fecha a formatear
   * @returns {string} - Fecha formateada
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Validar que sea una fecha válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'Fecha inválida';
    }
  };
  
  /**
   * Genera botones de paginación
   * @returns {JSX.Element[]} - Botones de paginación
   */
  const generarBotonesPaginacion = () => {
    const botones = [];
    
    // Determinar rango de páginas a mostrar
    let startPage = Math.max(1, paginaActual - Math.floor(MAX_PAGE_BUTTONS / 2));
    let endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < MAX_PAGE_BUTTONS) {
      startPage = Math.max(1, endPage - MAX_PAGE_BUTTONS + 1);
    }
    
    // Botón para primera página
    if (startPage > 1) {
      botones.push(
        <button
          key="first"
          onClick={() => cambiarPagina(1)}
          style={paginationStyles.pageButton}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        botones.push(
          <span key="ellipsis1" style={paginationStyles.ellipsis}>...</span>
        );
      }
    }
    
    // Botones de páginas
    for (let i = startPage; i <= endPage; i++) {
      botones.push(
        <button
          key={i}
          onClick={() => cambiarPagina(i)}
          style={{
            ...paginationStyles.pageButton,
            ...(i === paginaActual ? paginationStyles.activePageButton : {})
          }}
        >
          {i}
        </button>
      );
    }
    
    // Botón para última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        botones.push(
          <span key="ellipsis2" style={paginationStyles.ellipsis}>...</span>
        );
      }
      
      botones.push(
        <button
          key="last"
          onClick={() => cambiarPagina(totalPages)}
          style={paginationStyles.pageButton}
        >
          {totalPages}
        </button>
      );
    }
    
    return botones;
  };

  // Calcular usuarios para la página actual
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * ITEMS_PER_PAGE,
    paginaActual * ITEMS_PER_PAGE
  );

  // =========================================================================
  // ESTILOS PARA PANEL DE USUARIOS
  // =========================================================================
  
  const panelStyles = {
    container: {
      marginBottom: "30px"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#00515F",
      margin: 0
    },
    actionButtons: {
      display: "flex",
      gap: "10px"
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      marginBottom: "20px",
    },
    filtersCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      marginBottom: "20px",
    },
    filtersTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginTop: 0,
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    filtersForm: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "15px"
    },
    formGroup: {
      marginBottom: "15px"
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
      fontSize: "14px",
      color: "#555"
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "14px",
      transition: "border-color 0.2s",
      outline: "none"
    },
    passwordInputContainer: {
      position: "relative",
      width: "100%"
    },
    passwordToggleButton: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#666",
      fontSize: "16px"
    },
    filtersActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "15px"
    },
    tableContainer: {
      overflowX: "auto",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#333",
      fontWeight: "bold",
      textAlign: "left",
      padding: "12px 15px",
      borderBottom: "2px solid #dee2e6",
      position: "sticky",
      top: 0,
      cursor: "pointer",
      userSelect: "none"
    },
    tableHeaderCell: {
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    tableRow: {
      borderBottom: "1px solid #dee2e6",
      transition: "background-color 0.2s"
    },
    tableRowHover: {
      backgroundColor: "#f8f9fa"
    },
    tableCell: {
      padding: "12px 15px",
      verticalAlign: "middle"
    },
    tableCellActions: {
      padding: "8px 15px",
      textAlign: "right"
    },
    avatarContainer: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#00515F",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px"
    },
    avatar: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    expandedRow: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6"
    },
    expandedCell: {
      padding: "20px"
    },
    expandedContent: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    expandedHeader: {
      display: "flex",
      gap: "20px"
    },
    expandedAvatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#00515F",
      color: "white",
      fontWeight: "bold",
      fontSize: "36px"
    },
    expandedInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
    expandedName: {
      fontSize: "22px",
      fontWeight: "bold",
      margin: "0 0 10px 0"
    },
    expandedRole: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#00515F",
      marginBottom: "10px",
      textTransform: "uppercase"
    },
    expandedDetailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "15px",
      marginTop: "10px"
    },
    expandedDetailItem: {
      marginBottom: "10px"
    },
    expandedDetailLabel: {
      fontSize: "12px",
      color: "#777",
      marginBottom: "5px"
    },
    expandedDetailValue: {
      fontSize: "14px"
    },
    expandedActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "15px",
      borderTop: "1px solid #dee2e6",
      paddingTop: "15px"
    },
    buttonPrimary: {
      backgroundColor: "#00515F",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 15px",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "500"
    },
    buttonSecondary: {
      backgroundColor: "white",
      color: "#00515F",
      border: "1px solid #00515F",
      borderRadius: "4px",
      padding: "10px 15px",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "500"
    },
    buttonDanger: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 15px",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "500"
    },
    buttonWarning: {
      backgroundColor: "#ffc107",
      color: "#212529",
      border: "none",
      borderRadius: "4px",
      padding: "10px 15px",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "500"
    },
    badge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white",
      textTransform: "uppercase"
    },
    badgeAdmin: {
      backgroundColor: "#dc3545"
    },
    badgeUser: {
      backgroundColor: "#007bff"
    },
    formTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "0 0 20px 0",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px"
    },
    formGridWide: {
      gridColumn: "span 2"
    },
    imagePreviewContainer: {
      marginTop: "10px"
    },
    imagePreview: {
      maxWidth: "150px",
      maxHeight: "150px",
      borderRadius: "4px",
      border: "1px solid #ddd"
    },
    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "20px",
      borderTop: "1px solid #dee2e6",
      paddingTop: "20px"
    },
    formError: {
      color: "#dc3545",
      fontSize: "12px",
      marginTop: "5px"
    },
    uploadingMessage: {
      color: "#007bff",
      fontSize: "13px",
      marginTop: "5px",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    passwordStrengthContainer: {
      marginTop: "5px"
    },
    passwordStrengthBar: {
      height: "5px",
      borderRadius: "3px",
      backgroundColor: "#e9ecef",
      marginBottom: "5px"
    },
    passwordStrengthFill: (score) => {
      const colors = ["#dc3545", "#ffc107", "#28a745", "#007bff", "#6610f2"];
      const width = `${Math.min(100, (score / 5) * 100)}%`;
      const color = colors[Math.min(score, 4)];
      
      return {
        width,
        height: "100%",
        backgroundColor: color,
        borderRadius: "3px",
        transition: "width 0.3s"
      };
    },
    passwordStrengthText: (score) => {
      const colors = ["#dc3545", "#ffc107", "#28a745", "#007bff", "#6610f2"];
      return {
        fontSize: "12px",
        color: colors[Math.min(score, 4)]
      };
    }
  };
  
  const paginationStyles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      padding: "10px 15px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    info: {
      fontSize: "14px",
      color: "#666"
    },
    buttonsContainer: {
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    navButton: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "4px",
      padding: "6px 12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s"
    },
    pageButton: {
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "4px",
      padding: "6px 12px",
      minWidth: "35px",
      textAlign: "center",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    activePageButton: {
      backgroundColor: "#00515F",
      borderColor: "#00515F",
      color: "white"
    },
    ellipsis: {
      padding: "6px 6px",
      color: "#666"
    }
  };
  
  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  
  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.header}>
        <h2 style={panelStyles.title}>Gestión de Usuarios</h2>
        <div style={panelStyles.actionButtons}>
          <button 
            onClick={prepararNuevoUsuario}
            style={panelStyles.buttonPrimary}
            disabled={loading}
          >
            <FaUserPlus /> Añadir Usuario
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div style={panelStyles.filtersCard}>
        <h3 style={panelStyles.filtersTitle}><FaFilter /> Filtros</h3>
        <div style={panelStyles.filtersForm}>
          <div style={panelStyles.formGroup}>
            <label style={panelStyles.label} htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre"
              style={panelStyles.input}
              maxLength={100}
            />
          </div>
          
          <div style={panelStyles.formGroup}>
            <label style={panelStyles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              value={filtros.email}
              onChange={handleFiltroChange}
              placeholder="Buscar por email"
              style={panelStyles.input}
              maxLength={100}
            />
          </div>
          
          <div style={panelStyles.formGroup}>
            <label style={panelStyles.label} htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={filtros.role}
              onChange={handleFiltroChange}
              style={panelStyles.input}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          
          <div style={panelStyles.formGroup}>
            <label style={panelStyles.label} htmlFor="fechaDesde">Fecha desde</label>
            <input
              id="fechaDesde"
              type="date"
              name="fechaDesde"
              value={filtros.fechaDesde}
              onChange={handleFiltroChange}
              style={panelStyles.input}
              max={filtros.fechaHasta || undefined}
            />
          </div>
          
          <div style={panelStyles.formGroup}>
            <label style={panelStyles.label} htmlFor="fechaHasta">Fecha hasta</label>
            <input
              id="fechaHasta"
              type="date"
              name="fechaHasta"
              value={filtros.fechaHasta}
              onChange={handleFiltroChange}
              style={panelStyles.input}
              min={filtros.fechaDesde || undefined}
            />
          </div>
        </div>
        
        <div style={panelStyles.filtersActions}>
          <button 
            onClick={limpiarFiltros} 
            style={panelStyles.buttonSecondary}
            disabled={loading || 
              (!filtros.nombre && !filtros.email && !filtros.role && 
              !filtros.fechaDesde && !filtros.fechaHasta)}
          >
            <FaUndo /> Limpiar
          </button>
        </div>
      </div>
      
      {/* Formulario para agregar/editar usuario */}
      {mostrarFormulario && (
        <div style={panelStyles.card}>
          <form 
            ref={formRef}
            onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
          >
            <h3 style={panelStyles.formTitle}>
              {modoEdicion ? <><FaEdit /> Editar Usuario</> : <><FaUserPlus /> Añadir Nuevo Usuario</>}
            </h3>
            
            <div style={panelStyles.formGrid}>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.nombre ? "#dc3545" : "#ddd"
                  }}
                  required
                  maxLength={VALIDATION.nombre.max}
                  aria-invalid={!!formErrors.nombre}
                  aria-describedby={formErrors.nombre ? "nombre-error" : undefined}
                />
                {formErrors.nombre && (
                  <div id="nombre-error" style={panelStyles.formError}>
                    {formErrors.nombre}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="apellidoPaterno">Apellido Paterno</label>
                <input
                  id="apellidoPaterno"
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Paterno"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.apellidoPaterno ? "#dc3545" : "#ddd"
                  }}
                  maxLength={VALIDATION.apellido.max}
                  aria-invalid={!!formErrors.apellidoPaterno}
                  aria-describedby={formErrors.apellidoPaterno ? "apellidoPaterno-error" : undefined}
                />
                {formErrors.apellidoPaterno && (
                  <div id="apellidoPaterno-error" style={panelStyles.formError}>
                    {formErrors.apellidoPaterno}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="apellidoMaterno">Apellido Materno</label>
                <input
                  id="apellidoMaterno"
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Materno"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.apellidoMaterno ? "#dc3545" : "#ddd"
                  }}
                  maxLength={VALIDATION.apellido.max}
                  aria-invalid={!!formErrors.apellidoMaterno}
                  aria-describedby={formErrors.apellidoMaterno ? "apellidoMaterno-error" : undefined}
                />
                {formErrors.apellidoMaterno && (
                  <div id="apellidoMaterno-error" style={panelStyles.formError}>
                    {formErrors.apellidoMaterno}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Correo electrónico"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.email ? "#dc3545" : "#ddd"
                  }}
                  required
                  maxLength={100}
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email-error" : undefined}
                />
                {formErrors.email && (
                  <div id="email-error" style={panelStyles.formError}>
                    {formErrors.email}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="password">
                  {modoEdicion ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña *"}
                </label>
                <div style={panelStyles.passwordInputContainer}>
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                    style={{
                      ...panelStyles.input,
                      borderColor: formErrors.password ? "#dc3545" : "#ddd"
                    }}
                    required={!modoEdicion}
                    maxLength={VALIDATION.password.max}
                    aria-invalid={!!formErrors.password}
                    aria-describedby={formErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    style={panelStyles.passwordToggleButton}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Indicador de fortaleza de contraseña */}
                {formData.password && (
                  <div style={panelStyles.passwordStrengthContainer}>
                    <div style={panelStyles.passwordStrengthBar}>
                      <div style={panelStyles.passwordStrengthFill(passwordStrength.score)}></div>
                    </div>
                    <div style={panelStyles.passwordStrengthText(passwordStrength.score)}>
                      {passwordStrength.score === 0 && "Muy débil"}
                      {passwordStrength.score === 1 && "Débil"}
                      {passwordStrength.score === 2 && "Regular"}
                      {passwordStrength.score === 3 && "Buena"}
                      {passwordStrength.score === 4 && "Fuerte"}
                      {passwordStrength.score === 5 && "Muy fuerte"}
                    </div>
                  </div>
                )}
                
                {formErrors.password && (
                  <div id="password-error" style={panelStyles.formError}>
                    {formErrors.password}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="confirmPassword">
                  {modoEdicion ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña *"}
                </label>
                <div style={panelStyles.passwordInputContainer}>
                  <input
                    id="confirmPassword"
                    type={passwordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmar contraseña"
                    style={{
                      ...panelStyles.input,
                      borderColor: formErrors.confirmPassword ? "#dc3545" : "#ddd"
                    }}
                    required={!modoEdicion || formData.password.length > 0}
                    maxLength={VALIDATION.password.max}
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <div id="confirmPassword-error" style={panelStyles.formError}>
                    {formErrors.confirmPassword}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.telefono ? "#dc3545" : "#ddd"
                  }}
                  maxLength={20}
                  aria-invalid={!!formErrors.telefono}
                  aria-describedby={formErrors.telefono ? "telefono-error" : undefined}
                />
                {formErrors.telefono && (
                  <div id="telefono-error" style={panelStyles.formError}>
                    {formErrors.telefono}
                  </div>
                )}
              </div>
              
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label} htmlFor="role">Rol</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={panelStyles.input}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <div style={{...panelStyles.formGroup, ...panelStyles.formGridWide}}>
                <label style={panelStyles.label} htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Dirección"
                  style={{
                    ...panelStyles.input,
                    borderColor: formErrors.direccion ? "#dc3545" : "#ddd"
                  }}
                  maxLength={VALIDATION.direccion.max}
                  aria-invalid={!!formErrors.direccion}
                  aria-describedby={formErrors.direccion ? "direccion-error" : undefined}
                />
                {formErrors.direccion && (
                  <div id="direccion-error" style={panelStyles.formError}>
                    {formErrors.direccion}
                  </div>
                )}
              </div>
              
              <div style={{...panelStyles.formGroup, ...panelStyles.formGridWide}}>
                <label style={panelStyles.label} htmlFor="imagen">Imagen de perfil</label>
                <input
                  id="imagen"
                  type="file"
                  name="imagen"
                  onChange={handleImageUpload}
                  style={{
                    ...panelStyles.input,
                    borderColor: fileError ? "#dc3545" : "#ddd"
                  }}
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  disabled={uploadingImage}
                  ref={fileInputRef}
                  aria-invalid={!!fileError}
                  aria-describedby={fileError ? "imagen-error" : undefined}
                />
                
                {uploadingImage && (
                  <div style={panelStyles.uploadingMessage}>
                    <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} /> Subiendo imagen...
                  </div>
                )}
                
                {fileError && (
                  <div id="imagen-error" style={panelStyles.formError}>
                    {fileError}
                  </div>
                )}
                
                <input
                  type="text"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleInputChange}
                  placeholder="O ingrese la URL de la imagen directamente"
                  style={{
                    ...panelStyles.input,
                    marginTop: "10px",
                    borderColor: formErrors.imagen ? "#dc3545" : "#ddd"
                  }}
                  maxLength={500}
                />
                
                {formErrors.imagen && !fileError && (
                  <div style={panelStyles.formError}>
                    {formErrors.imagen}
                  </div>
                )}
                
                {previewImage && (
                  <div style={panelStyles.imagePreviewContainer}>
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      style={panelStyles.imagePreview}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlOWVjZWYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjODY4ZTk2Ij5JbWFnZW48L3RleHQ+PC9zdmc+";
                        setFormErrors(prev => ({
                          ...prev,
                          imagen: "No se pudo cargar la imagen"
                        }));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div style={panelStyles.formActions}>
              <button
                type="button"
                onClick={cancelarEdicion}
                style={panelStyles.buttonSecondary}
                disabled={loading}
              >
                <FaTimes /> Cancelar
              </button>
              <button
                type="submit"
                style={panelStyles.buttonPrimary}
                disabled={loading}
              >
                {loading ? (
                  <><FaSyncAlt style={{ animation: "spin 1s linear infinite" }} /> Procesando...</>
                ) : (
                  modoEdicion ? <><FaSave /> Actualizar</> : <><FaUserPlus /> Crear Usuario</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de usuarios */}
      <div style={panelStyles.tableContainer}>
        <table style={panelStyles.table}>
          <thead>
            <tr>
              <th style={panelStyles.tableHeader} onClick={() => requestSort('imagenUrl')}>
                <div style={panelStyles.tableHeaderCell}>
                  Foto {getSortIcon('imagenUrl')}
                </div>
              </th>
              <th style={panelStyles.tableHeader} onClick={() => requestSort('nombre')}>
                <div style={panelStyles.tableHeaderCell}>
                  Nombre {getSortIcon('nombre')}
                </div>
              </th>
              <th style={panelStyles.tableHeader} onClick={() => requestSort('email')}>
                <div style={panelStyles.tableHeaderCell}>
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th style={panelStyles.tableHeader} onClick={() => requestSort('role')}>
                <div style={panelStyles.tableHeaderCell}>
                  Rol {getSortIcon('role')}
                </div>
              </th>
              <th style={panelStyles.tableHeader} onClick={() => requestSort('fechaRegistro')}>
                <div style={panelStyles.tableHeaderCell}>
                  Registro {getSortIcon('fechaRegistro')}
                </div>
              </th>
              <th style={panelStyles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && usuarios.length === 0 ? (
              <tr>
                <td colSpan="6" style={{...panelStyles.tableCell, textAlign: "center", padding: "30px"}}>
                  <FaSyncAlt style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "#00515F", marginBottom: "10px" }} />
                  <div>Cargando usuarios...</div>
                </td>
              </tr>
            ) : usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{...panelStyles.tableCell, textAlign: "center", padding: "30px"}}>
                  <div style={{color: "#666", fontStyle: "italic"}}>No se encontraron usuarios que coincidan con los criterios de búsqueda.</div>
                </td>
              </tr>
            ) : (
              usuariosPaginados.map(usuario => (
                <React.Fragment key={usuario._id}>
                  <tr 
                    style={panelStyles.tableRow}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <td style={panelStyles.tableCell}>
                      <div style={panelStyles.avatarContainer}>
                        {usuario.imagenUrl ? (
                          <img
                            src={usuario.imagenUrl}
                            alt={usuario.nombre || 'Usuario'}
                            style={panelStyles.avatar}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentNode.textContent = (usuario.nombre || 'U').charAt(0).toUpperCase();
                            }}
                          />
                        ) : (
                          (usuario.nombre || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td style={panelStyles.tableCell}>
                      {formatearNombreCompleto(usuario) || 'Usuario sin nombre'}
                    </td>
                    <td style={panelStyles.tableCell}>{usuario.email || 'Sin email'}</td>
                    <td style={panelStyles.tableCell}>
                      <span style={{
                        ...panelStyles.badge,
                        ...(usuario.role === 'admin' ? panelStyles.badgeAdmin : panelStyles.badgeUser)
                      }}>
                        {usuario.role || 'usuario'}
                      </span>
                    </td>
                    <td style={panelStyles.tableCell}>
                      {usuario.fechaRegistro ? formatDate(usuario.fechaRegistro) : 'N/A'}
                    </td>
                    <td style={panelStyles.tableCellActions}>
                      <button
                        onClick={() => toggleExpandirUsuario(usuario._id)}
                        style={panelStyles.buttonSecondary}
                        aria-label={usuarioExpandido === usuario._id ? "Cerrar detalles" : "Ver más detalles"}
                      >
                        {usuarioExpandido === usuario._id ? "Cerrar" : "Ver más"}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Fila expandida con detalles y opciones */}
                  {usuarioExpandido === usuario._id && (
                    <tr style={panelStyles.expandedRow}>
                      <td colSpan="6" style={panelStyles.expandedCell}>
                        <div style={panelStyles.expandedContent}>
                          <div style={panelStyles.expandedHeader}>
                            <div style={panelStyles.expandedAvatar}>
                              {usuario.imagenUrl ? (
                                <img
                                  src={usuario.imagenUrl}
                                  alt={usuario.nombre || 'Usuario'}
                                  style={panelStyles.avatar}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.textContent = (usuario.nombre || 'U').charAt(0).toUpperCase();
                                  }}
                                />
                              ) : (
                                (usuario.nombre || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                            
                            <div style={panelStyles.expandedInfo}>
                              <h3 style={panelStyles.expandedName}>
                                {formatearNombreCompleto(usuario) || 'Usuario sin nombre'}
                              </h3>
                              
                              <span style={{
                                ...panelStyles.expandedRole,
                                backgroundColor: usuario.role === 'admin' ? '#dc3545' : '#007bff'
                              }}>
                                {usuario.role === 'admin' ? (
                                  <><FaUserShield /> Administrador</>
                                ) : (
                                  <><FaUser /> Usuario</>
                                )}
                              </span>
                              
                              <div style={panelStyles.expandedDetailsGrid}>
                                <div style={panelStyles.expandedDetailItem}>
                                  <div style={panelStyles.expandedDetailLabel}>
                                    <FaEnvelope /> Email
                                  </div>
                                  <div style={panelStyles.expandedDetailValue}>
                                    {usuario.email || 'No especificado'}
                                  </div>
                                </div>
                                
                                <div style={panelStyles.expandedDetailItem}>
                                  <div style={panelStyles.expandedDetailLabel}>
                                    <FaCalendarAlt /> Fecha de registro
                                  </div>
                                  <div style={panelStyles.expandedDetailValue}>
                                    {usuario.fechaRegistro ? formatDate(usuario.fechaRegistro) : 'N/A'}
                                  </div>
                                </div>
                                
                                <div style={panelStyles.expandedDetailItem}>
                                  <div style={panelStyles.expandedDetailLabel}>
                                    <FaPhoneAlt /> Teléfono
                                  </div>
                                  <div style={panelStyles.expandedDetailValue}>
                                    {usuario.telefono || 'No especificado'}
                                  </div>
                                </div>
                                
                                <div style={panelStyles.expandedDetailItem}>
                                  <div style={panelStyles.expandedDetailLabel}>
                                    <FaIdCard /> ID de usuario
                                  </div>
                                  <div style={{
                                    ...panelStyles.expandedDetailValue,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px"
                                  }}>
                                    <span>{usuario._id || 'ID no disponible'}</span>
                                    {usuario._id && (
                                      <button 
                                        onClick={() => copyToClipboard(usuario._id)}
                                        style={{
                                          background: "none",
                                          border: "none",
                                          color: "#00515F",
                                          cursor: "pointer",
                                          padding: "0"
                                        }}
                                        title="Copiar ID"
                                        aria-label="Copiar ID de usuario"
                                      >
                                        <FaCopy />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {usuario.direccion && (
                                <div style={{marginTop: "10px"}}>
                                  <div style={panelStyles.expandedDetailLabel}>
                                    <FaMapMarkerAlt /> Dirección
                                  </div>
                                  <div style={panelStyles.expandedDetailValue}>
                                    {usuario.direccion}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div style={panelStyles.expandedActions}>
                            <button
                              onClick={() => prepararEdicion(usuario)}
                              style={panelStyles.buttonWarning}
                              disabled={loading}
                              aria-label="Editar usuario"
                            >
                              <FaEdit /> Editar
                            </button>
                            <button
                              onClick={() => eliminarUsuario(usuario._id, formatearNombreCompleto(usuario) || 'Usuario sin nombre')}
                              style={panelStyles.buttonDanger}
                              disabled={loading}
                              aria-label="Eliminar usuario"
                            >
                              <FaTrash /> Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {!loading && usuariosFiltrados.length > 0 && (
        <div style={paginationStyles.container}>
          <div style={paginationStyles.info}>
            Mostrando {Math.min(usuariosFiltrados.length, (paginaActual - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(paginaActual * ITEMS_PER_PAGE, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
          </div>
          <div style={paginationStyles.buttonsContainer}>
            <button 
              onClick={() => cambiarPagina(1)}
              disabled={paginaActual === 1}
              style={paginationStyles.navButton}
              title="Primera página"
              aria-label="Ir a la primera página"
            >
              <FaArrowLeft style={{ marginRight: "5px" }} /> Primera
            </button>
            
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              style={paginationStyles.navButton}
              title="Página anterior"
              aria-label="Ir a la página anterior"
            >
              <FaArrowLeft />
            </button>
            
            {generarBotonesPaginacion()}
            
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPages}
              style={paginationStyles.navButton}
              title="Página siguiente"
              aria-label="Ir a la página siguiente"
            >
              <FaArrowRight />
            </button>
            
            <button 
              onClick={() => cambiarPagina(totalPages)}
              disabled={paginaActual === totalPages}
              style={paginationStyles.navButton}
              title="Última página"
              aria-label="Ir a la última página"
            >
              Última <FaArrowRight style={{ marginLeft: "5px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRUDUsuarios;