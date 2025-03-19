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
  FaCamera,
  FaFileExport,
  FaFileImport,
  FaUserShield,
  FaUserCog,
  FaPhoneAlt,
  FaBan,
  FaLock,
  FaLockOpen,
  FaPrint,
  FaSave,
  FaUndo,
  FaClipboardCheck,
  FaShoppingCart,
  FaTags,
  FaBox,
  FaBoxes,
  FaStore,
  FaDollarSign,
  FaImage,
  FaImages,
  FaListAlt,
  FaClipboardList,
  FaTable,
  FaChartBar,
  FaChartLine
} from "react-icons/fa";

/**
 * Panel de Administración Completo
 * 
 * Este componente implementa un panel de administración completo para gestionar usuarios
 * y productos en la aplicación. Incluye funcionalidades avanzadas como:
 * 
 * - Gestión de usuarios (CRUD completo)
 * - Gestión de productos (CRUD completo)
 * - Búsqueda y filtrado avanzados
 * - Paginación de resultados
 * - Validación de formularios
 * - Gestión de imágenes con vista previa
 * - Vista responsiva adaptable a distintos dispositivos
 * - Soporte para exportación/importación de datos
 * - Gestión de roles y permisos
 */

// URL base para todas las llamadas a la API
const API_BASE_URL = 'http://localhost:5000';

// Estilos globales para todo el panel de administración
const globalStyles = {
  fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#333333",
  backgroundColor: "#f8f9fa"
};

// Constantes para paginación
const ITEMS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5;

/**
 * Componente principal del Panel de Administración
 */
const AdminPanel = () => {
  // =========================================================================
  // ESTADOS GLOBALES
  // =========================================================================
  const [activeTab, setActiveTab] = useState("usuarios"); // usuarios | productos
  const [theme, setTheme] = useState("light"); // light | dark
  const [expandedView, setExpandedView] = useState(true); // Vista expandida o compacta
  const [loading, setLoading] = useState(false); // Estado de carga global
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null
  });
  
  // Gestión de notificaciones
  const [notification, setNotification] = useState({
    visible: false,
    type: "", // success | error | warning | info
    message: "",
    timeout: 3000
  });

  // Referencia para las notificaciones
  const notificationTimeoutRef = useRef(null);

  // =========================================================================
  // EFECTOS GLOBALES
  // =========================================================================
  
  // Limpiar timeout de notificación al desmontar componente
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Aplicar tema oscuro/claro
  useEffect(() => {
    document.body.dataset.theme = theme;
    // Aquí podríamos aplicar clases CSS al body o almacenar la preferencia en localStorage
  }, [theme]);

  // =========================================================================
  // FUNCIONES UTILITARIAS GLOBALES
  // =========================================================================
  
  /**
   * Muestra una notificación al usuario
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, warning, info)
   * @param {number} timeout - Tiempo en ms que se mostrará la notificación
   */
  const showNotification = useCallback((message, type = "success", timeout = 3000) => {
    // Limpiar timeout anterior si existe
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    // Mostrar nueva notificación
    setNotification({
      visible: true,
      type,
      message,
      timeout
    });
    
    // Configurar timeout para ocultar la notificación
    if (timeout > 0) {
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, timeout);
    }
  }, []);

  /**
   * Oculta la notificación actual
   */
  const hideNotification = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  /**
   * Muestra un diálogo de confirmación
   * @param {string} title - Título del diálogo
   * @param {string} message - Mensaje a mostrar
   * @param {Function} onConfirm - Función a ejecutar al confirmar
   * @param {Function} onCancel - Función a ejecutar al cancelar
   */
  const confirm = useCallback((title, message, onConfirm, onCancel = () => {}) => {
    setConfirmModal({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel
    });
  }, []);

  /**
   * Formatea una fecha para mostrarla en la interfaz
   * @param {string|Date} dateString - Fecha a formatear
   * @param {string} locale - Locale a utilizar (por defecto es-ES)
   * @returns {string} Fecha formateada
   */
  const formatDate = useCallback((dateString, locale = 'es-ES') => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, {
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
  }, []);

  /**
   * Copia texto al portapapeles
   * @param {string} text - Texto a copiar
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Texto copiado al portapapeles", "success");
      return true;
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      showNotification("No se pudo copiar al portapapeles", "error");
      return false;
    }
  }, [showNotification]);

  /**
   * Descarga un archivo a partir de datos
   * @param {string} filename - Nombre del archivo
   * @param {string} text - Contenido del archivo
   * @param {string} type - Tipo MIME
   */
  const downloadFile = useCallback((filename, text, type = "text/plain") => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  /**
   * Exporta datos en formato JSON
   * @param {Object[]} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  const exportToJson = useCallback((data, filename = "export.json") => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      downloadFile(filename, jsonStr, "application/json");
      showNotification(`Datos exportados correctamente a ${filename}`, "success");
    } catch (error) {
      console.error("Error al exportar datos:", error);
      showNotification("Error al exportar datos", "error");
    }
  }, [downloadFile, showNotification]);

  // =========================================================================
  // COMPONENTE DE NOTIFICACIÓN
  // =========================================================================
  
  /**
   * Componente para mostrar notificaciones
   */
  const NotificationComponent = ({ notification, onClose }) => {
    const getIcon = () => {
      switch (notification.type) {
        case "success": return <FaCheckCircle style={{ marginRight: "10px", fontSize: "20px" }} />;
        case "error": return <FaExclamationTriangle style={{ marginRight: "10px", fontSize: "20px" }} />;
        case "warning": return <FaExclamationTriangle style={{ marginRight: "10px", fontSize: "20px" }} />;
        case "info": 
        default: return <FaInfoCircle style={{ marginRight: "10px", fontSize: "20px" }} />;
      }
    };

    const getBackgroundColor = () => {
      switch (notification.type) {
        case "success": return "#d4edda";
        case "error": return "#f8d7da";
        case "warning": return "#fff3cd";
        case "info": 
        default: return "#d1ecf1";
      }
    };

    const getTextColor = () => {
      switch (notification.type) {
        case "success": return "#155724";
        case "error": return "#721c24";
        case "warning": return "#856404";
        case "info": 
        default: return "#0c5460";
      }
    };

    const style = {
      notification: {
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        padding: "15px 20px",
        borderRadius: "5px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "300px",
        maxWidth: "500px",
        animation: "slideInRight 0.3s ease-out"
      },
      content: {
        display: "flex",
        alignItems: "center",
        flex: 1
      },
      closeButton: {
        background: "none",
        border: "none",
        color: getTextColor(),
        fontSize: "20px",
        cursor: "pointer",
        marginLeft: "15px"
      },
      message: {
        margin: 0,
        fontSize: "16px"
      }
    };

    return (
      <div style={style.notification}>
        <div style={style.content}>
          {getIcon()}
          <p style={style.message}>{notification.message}</p>
        </div>
        <button onClick={onClose} style={style.closeButton}>
          <FaTimes />
        </button>
      </div>
    );
  };

  // =========================================================================
  // COMPONENTE DE CONFIRMACIÓN
  // =========================================================================
  
  /**
   * Componente para mostrar diálogos de confirmación
   */
  const ConfirmDialog = ({ modal, onClose }) => {
    const style = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-out"
      },
      dialog: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        width: "100%",
        maxWidth: "500px",
        padding: "20px",
        animation: "scaleIn 0.2s ease-out"
      },
      header: {
        borderBottom: "1px solid #eee",
        paddingBottom: "10px",
        marginBottom: "20px"
      },
      title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "bold",
        color: "#00515F"
      },
      content: {
        marginBottom: "20px",
        fontSize: "16px",
        lineHeight: "1.5"
      },
      actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px"
      },
      cancelButton: {
        padding: "8px 16px",
        backgroundColor: "#f8f9fa",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer"
      },
      confirmButton: {
        padding: "8px 16px",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer"
      }
    };

    const handleConfirm = () => {
      if (modal.onConfirm) {
        modal.onConfirm();
      }
      onClose();
    };

    const handleCancel = () => {
      if (modal.onCancel) {
        modal.onCancel();
      }
      onClose();
    };

    return (
      <div style={style.overlay}>
        <div style={style.dialog}>
          <div style={style.header}>
            <h3 style={style.title}>{modal.title}</h3>
          </div>
          <div style={style.content}>
            <p>{modal.message}</p>
          </div>
          <div style={style.actions}>
            <button onClick={handleCancel} style={style.cancelButton}>Cancelar</button>
            <button onClick={handleConfirm} style={style.confirmButton}>Confirmar</button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // COMPONENTE DE PESTAÑAS
  // =========================================================================
  
  /**
   * Componente para mostrar las pestañas principales
   */
  const TabMenu = () => {
    const tabStyle = {
      container: {
        display: "flex",
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      },
      tab: {
        padding: "15px 25px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderBottom: "3px solid transparent",
        color: "#666",
        transition: "all 0.2s ease"
      },
      activeTab: {
        color: "#00515F",
        borderBottom: "3px solid #00515F",
        backgroundColor: "#f2f8fa"
      }
    };

    return (
      <div style={tabStyle.container}>
        <div 
          style={{
            ...tabStyle.tab,
            ...(activeTab === "usuarios" ? tabStyle.activeTab : {})
          }}
          onClick={() => setActiveTab("usuarios")}
        >
          <FaUser /> Usuarios
        </div>
        <div 
          style={{
            ...tabStyle.tab,
            ...(activeTab === "productos" ? tabStyle.activeTab : {})
          }}
          onClick={() => setActiveTab("productos")}
        >
          <FaShoppingCart /> Productos
        </div>
      </div>
    );
  };

  // =========================================================================
  // COMPONENTES PARA EL PANEL DE USUARIOS
  // =========================================================================
  
  /**
   * Componente para gestionar usuarios
   */
  const UsuariosPanel = () => {
    // =========================================================================
    // ESTADOS PARA GESTIÓN DE USUARIOS
    // =========================================================================
    
    // Datos principales
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
    
    // Referencias
    const formRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // =========================================================================
    // EFECTOS PARA USUARIOS
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
        resultado = resultado.filter(usuario => 
          `${usuario.nombre} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.toLowerCase()
          .includes(filtros.nombre.toLowerCase())
        );
      }
      
      // Filtrar por email
      if (filtros.email) {
        resultado = resultado.filter(usuario => 
          usuario.email.toLowerCase().includes(filtros.email.toLowerCase())
        );
      }
      
      // Filtrar por rol
      if (filtros.role) {
        resultado = resultado.filter(usuario => 
          usuario.role === filtros.role
        );
      }
      
      // Filtrar por fecha desde
      if (filtros.fechaDesde) {
        const fechaDesde = new Date(filtros.fechaDesde);
        resultado = resultado.filter(usuario => 
          new Date(usuario.fechaRegistro) >= fechaDesde
        );
      }
      
      // Filtrar por fecha hasta
      if (filtros.fechaHasta) {
        const fechaHasta = new Date(filtros.fechaHasta);
        fechaHasta.setHours(23, 59, 59, 999); // Final del día
        resultado = resultado.filter(usuario => 
          new Date(usuario.fechaRegistro) <= fechaHasta
        );
      }
      
      // Luego aplicamos el ordenamiento
      if (sortConfig.key) {
        resultado.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];
          
          // Manejar campos específicos
          if (sortConfig.key === 'nombre') {
            aValue = `${a.nombre} ${a.apellidoPaterno || ''} ${a.apellidoMaterno || ''}`;
            bValue = `${b.nombre} ${b.apellidoPaterno || ''} ${b.apellidoMaterno || ''}`;
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Limpiar error específico al modificar el campo
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };
    
    /**
     * Maneja la subida de imágenes
     * @param {Event} e - Evento de cambio
     */
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showNotification("El archivo debe ser una imagen (JPEG, PNG, GIF, WEBP)", "error");
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("La imagen no debe superar los 5MB", "error");
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
        
        // Actualizar formulario con la URL y el ID
        setFormData(prev => ({
          ...prev,
          imagenUrl: data.url,
          imagenPublicId: data.publicId
        }));
        
        showNotification("Imagen subida correctamente", "success");
      } catch (error) {
        console.error("Error al subir imagen:", error);
        showNotification(`Error al subir la imagen: ${error.message}`, "error");
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
        errores.nombre = "El nombre es obligatorio";
      } else if (formData.nombre.trim().length < 2) {
        errores.nombre = "El nombre debe tener al menos 2 caracteres";
      }
      
      // Validar email
      if (!formData.email.trim()) {
        errores.email = "El email es obligatorio";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errores.email = "El email no es válido";
        }
      }
      
      // Validar contraseña en modo creación
      if (!modoEdicion) {
        if (!formData.password) {
          errores.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
          errores.password = "La contraseña debe tener al menos 6 caracteres";
        }
        
        if (formData.password !== formData.confirmPassword) {
          errores.confirmPassword = "Las contraseñas no coinciden";
        }
      } else if (formData.password) {
        // En modo edición, validar solo si se proporciona una contraseña
        if (formData.password.length < 6) {
          errores.password = "La contraseña debe tener al menos 6 caracteres";
        }
        
        if (formData.password !== formData.confirmPassword) {
          errores.confirmPassword = "Las contraseñas no coinciden";
        }
      }
      
      // Validar teléfono (opcional)
      if (formData.telefono && !/^\+?\d{7,15}$/.test(formData.telefono)) {
        errores.telefono = "El teléfono no es válido";
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
      
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosUsuario),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error del servidor: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Actualizar lista de usuarios
        await cargarUsuarios();
        
        // Mostrar notificación y resetear formulario
        showNotification("Usuario creado correctamente", "success");
        cancelarEdicion();
      } catch (error) {
        console.error("Error al crear usuario:", error);
        showNotification(`Error al crear el usuario: ${error.message}`, "error");
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
      
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${usuarioEditando}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosUsuario),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error del servidor: ${response.status}`);
        }
        
        // Actualizar lista de usuarios
        await cargarUsuarios();
        
        // Mostrar notificación y resetear formulario
        showNotification("Usuario actualizado correctamente", "success");
        cancelarEdicion();
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        showNotification(`Error al actualizar el usuario: ${error.message}`, "error");
      } finally {
        setLoading(false);
      }
    };
    
    /**
     * Elimina un usuario
     * @param {string} id - ID del usuario a eliminar
     */
    const eliminarUsuario = (id) => {
      confirm(
        "Eliminar usuario",
        "¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.",
        async () => {
          setLoading(true);
          
          try {
            const response = await fetch(`${API_BASE_URL}/api/admin/crud/usuarios/${id}`, {
              method: "DELETE",
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Error del servidor: ${response.status}`);
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
      );
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
     * Exporta la lista de usuarios a JSON
     */
    const exportarUsuarios = () => {
      // Simplificar datos para exportación
      const datosExportacion = usuariosFiltrados.map(usuario => ({
        id: usuario._id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        role: usuario.role,
        fechaRegistro: usuario.fechaRegistro
      }));
      
      exportToJson(datosExportacion, "usuarios_export.json");
    };
    
    // Calcular usuarios para la página actual
    const usuariosPaginados = usuariosFiltrados.slice(
      (paginaActual - 1) * ITEMS_PER_PAGE,
      paginaActual * ITEMS_PER_PAGE
    );
    
    // Genera botones de paginación
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
    // RENDERIZADO DEL PANEL DE USUARIOS
    // =========================================================================
    
    return (
      <div style={panelStyles.container}>
        <div style={panelStyles.header}>
          <h2 style={panelStyles.title}>Gestión de Usuarios</h2>
          <div style={panelStyles.actionButtons}>
            <button 
              onClick={exportarUsuarios} 
              style={panelStyles.buttonSecondary}
              disabled={loading || usuariosFiltrados.length === 0}
            >
              <FaFileExport /> Exportar
            </button>
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
              />
            </div>
          </div>
          
          <div style={panelStyles.filtersActions}>
            <button 
              onClick={limpiarFiltros} 
              style={panelStyles.buttonSecondary}
              disabled={loading}
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
                  />
                  {formErrors.nombre && <div style={panelStyles.formError}>{formErrors.nombre}</div>}
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
                    style={panelStyles.input}
                  />
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
                    style={panelStyles.input}
                  />
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
                  />
                  {formErrors.email && <div style={panelStyles.formError}>{formErrors.email}</div>}
                </div>
                
                <div style={panelStyles.formGroup}>
                  <label style={panelStyles.label} htmlFor="password">
                    {modoEdicion ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña *"}
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                    style={{
                      ...panelStyles.input,
                      borderColor: formErrors.password ? "#dc3545" : "#ddd"
                    }}
                    required={!modoEdicion}
                  />
                  {formErrors.password && <div style={panelStyles.formError}>{formErrors.password}</div>}
                </div>
                
                <div style={panelStyles.formGroup}>
                  <label style={panelStyles.label} htmlFor="confirmPassword">
                    {modoEdicion ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña *"}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmar contraseña"
                    style={{
                      ...panelStyles.input,
                      borderColor: formErrors.confirmPassword ? "#dc3545" : "#ddd"
                    }}
                    required={!modoEdicion || formData.password.length > 0}
                  />
                  {formErrors.confirmPassword && <div style={panelStyles.formError}>{formErrors.confirmPassword}</div>}
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
                  />
                  {formErrors.telefono && <div style={panelStyles.formError}>{formErrors.telefono}</div>}
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
                    style={panelStyles.input}
                  />
                </div>
                
                <div style={{...panelStyles.formGroup, ...panelStyles.formGridWide}}>
                  <label style={panelStyles.label} htmlFor="imagen">Imagen de perfil</label>
                  <input
                    id="imagen"
                    type="file"
                    name="imagen"
                    onChange={handleImageUpload}
                    style={panelStyles.input}
                    accept="image/*"
                    disabled={uploadingImage}
                    ref={fileInputRef}
                  />
                  
                  {uploadingImage && (
                    <div style={panelStyles.uploadingMessage}>
                      <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} /> Subiendo imagen...
                    </div>
                  )}
                  
                  <input
                    type="text"
                    name="imagenUrl"
                    value={formData.imagenUrl}
                    onChange={handleInputChange}
                    placeholder="O ingrese la URL de la imagen directamente"
                    style={{...panelStyles.input, marginTop: "10px"}}
                  />
                  
                  {previewImage && (
                    <div style={panelStyles.imagePreviewContainer}>
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        style={panelStyles.imagePreview}
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
                              alt={usuario.nombre}
                              style={panelStyles.avatar}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.textContent = usuario.nombre.charAt(0).toUpperCase();
                              }}
                            />
                          ) : (
                            usuario.nombre.charAt(0).toUpperCase()
                          )}
                        </div>
                      </td>
                      <td style={panelStyles.tableCell}>
                        {formatearNombreCompleto(usuario)}
                      </td>
                      <td style={panelStyles.tableCell}>{usuario.email}</td>
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
                                    alt={usuario.nombre}
                                    style={panelStyles.avatar}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.parentNode.textContent = usuario.nombre.charAt(0).toUpperCase();
                                    }}
                                  />
                                ) : (
                                  usuario.nombre.charAt(0).toUpperCase()
                                )}
                              </div>
                              
                              <div style={panelStyles.expandedInfo}>
                                <h3 style={panelStyles.expandedName}>
                                  {formatearNombreCompleto(usuario)}
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
                                      {usuario.email}
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
                                      <span>{usuario._id}</span>
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
                                      >
                                        <FaCopy />
                                      </button>
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
                              >
                                <FaEdit /> Editar
                              </button>
                              <button
                                onClick={() => eliminarUsuario(usuario._id)}
                                style={panelStyles.buttonDanger}
                                disabled={loading}
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
              >
                <FaArrowLeft style={{ marginRight: "5px" }} /> Primera
              </button>
              
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                style={paginationStyles.navButton}
                title="Página anterior"
              >
                <FaArrowLeft />
              </button>
              
              {generarBotonesPaginacion()}
              
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPages}
                style={paginationStyles.navButton}
                title="Página siguiente"
              >
                <FaArrowRight />
              </button>
              
              <button 
                onClick={() => cambiarPagina(totalPages)}
                disabled={paginaActual === totalPages}
                style={paginationStyles.navButton}
                title="Última página"
              >
                Última <FaArrowRight style={{ marginLeft: "5px" }} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // COMPONENTES PARA EL PANEL DE PRODUCTOS
  // =========================================================================
  
  /**
   * Componente para gestionar productos
   */
  const ProductosPanel = () => {
    // =========================================================================
    // ESTADOS PARA GESTIÓN DE PRODUCTOS
    // =========================================================================
    
    // Datos principales
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productoExpandido, setProductoExpandido] = useState(null);
    
    // Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Estados para formulario
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Estado del formulario
    const [formData, setFormData] = useState({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      imagenUrl: "",
      imagenPublicId: "",
      stock: 0,
      oferta: false,
      descuento: 0,
      destacado: false,
      envioGratis: false
    });
    
    // Estados para búsqueda y filtrado
    const [filtros, setFiltros] = useState({
      nombre: "",
      categoria: "",
      precioMin: "",
      precioMax: "",
      enOferta: "",
      conStock: ""
    });
    
    // Estados para ordenamiento
    const [sortConfig, setSortConfig] = useState({
      key: 'nombre',
      direction: 'asc'
    });
    
    // =========================================================================
    // EFECTOS PARA PRODUCTOS
    // =========================================================================
    
    // Cargar productos al iniciar el componente
    useEffect(() => {
      cargarProductos();
    }, []);
    
    // Actualizar productos filtrados cuando cambian los filtros o el ordenamiento
    useEffect(() => {
      aplicarFiltrosYOrdenamiento();
    }, [productos, filtros, sortConfig]);
    
    // Calcular páginas totales cuando cambian los productos filtrados
    useEffect(() => {
      setTotalPages(Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE)));
      if (paginaActual > Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE)) {
        setPaginaActual(1);
      }
    }, [productosFiltrados, paginaActual]);
    
    // =========================================================================
    // FUNCIONES PARA GESTIÓN DE PRODUCTOS
    // =========================================================================
    
    /**
     * Carga todos los productos desde la API
     */
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/crud/tienda`);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProductos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        showNotification(`Error al cargar los productos: ${error.message}`, "error");
        setLoading(false);
      }
    };
    
    /**
     * Aplica filtros y ordenamiento a los productos
     */
    const aplicarFiltrosYOrdenamiento = () => {
      // Implementaría la lógica de filtrado y ordenamiento similar a la de usuarios
      // pero adaptada a los campos de productos
      
      // Para simplificar, ponemos todos los productos en la lista filtrada
      setProductosFiltrados(productos);
    };
    
    // =========================================================================
    // RENDERIZADO DEL PANEL DE PRODUCTOS
    // =========================================================================
    
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "#00515F", fontSize: "24px", marginBottom: "20px" }}>
          <FaBoxes style={{ marginRight: "10px" }} /> 
          Gestión de Productos
        </h2>
        
        <div style={{ 
          backgroundColor: "#fff", 
          padding: "30px", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center" 
        }}>
          <FaClipboardList style={{ fontSize: "48px", color: "#00515F", marginBottom: "20px" }} />
          <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>
            Panel de Productos en Desarrollo
          </h3>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto 20px auto" }}>
            Esta sección se encuentra actualmente en desarrollo. Próximamente tendrás acceso a la gestión completa de productos.
          </p>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto 20px auto" }}>
            Mientras tanto, por favor utiliza la pestaña de Usuarios para administrar a los usuarios de la plataforma.
          </p>
          <button 
            onClick={() => setActiveTab("usuarios")}
            style={{
              backgroundColor: "#00515F",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <FaUser /> Ir a Usuarios
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // ESTILOS GLOBALES Y KEYFRAMES
  // =========================================================================
  
  // Definición de animaciones CSS (keyframes)
  const globalStylesTag = (
    <style>
      {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        body {
          margin: 0;
          padding: 0;
          background-color: ${globalStyles.backgroundColor};
          font-family: ${globalStyles.fontFamily};
          font-size: ${globalStyles.fontSize};
          line-height: ${globalStyles.lineHeight};
          color: ${globalStyles.color};
        }
        
        * {
          box-sizing: border-box;
        }
        
        button {
          cursor: pointer;
        }
        
        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}
    </style>
  );

  // =========================================================================
  // RENDERIZADO DEL COMPONENTE PRINCIPAL
  // =========================================================================
  
  return (
    <div style={globalStyles}>
      {globalStylesTag}
      
      <TabMenu />
      
      {activeTab === "usuarios" ? <UsuariosPanel /> : <ProductosPanel />}
      
      {notification.visible && (
        <NotificationComponent 
          notification={notification} 
          onClose={hideNotification} 
        />
      )}
      
      {confirmModal.visible && (
        <ConfirmDialog 
          modal={confirmModal} 
          onClose={() => setConfirmModal({...confirmModal, visible: false})} 
        />
      )}
    </div>
  );
};

export default AdminPanel;