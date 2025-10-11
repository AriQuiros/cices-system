import React, { useState, useEffect } from "react";
import "./Registro.css";
import RegistroInvestigador from "./RegistroInvestigador.jsx";


function Registro() {
    // Estado para mostrar error de coincidencia de contraseñas
    const [errorContrasena, setErrorContrasena] = useState("");
    // Estado para mostrar popup de error general
    const [popupError, setPopupError] = useState({ visible: false, mensaje: "" });
    // Estado para error de formato de correo
    const [errorCorreo, setErrorCorreo] = useState("");
    // Estado para error de formato de teléfono
    const [errorTelefono, setErrorTelefono] = useState("");
    // Estado para error de formato de contraseña
    const [errorFormatoContrasena, setErrorFormatoContrasena] = useState("");
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
    // Estado para mostrar popup de éxito
    const [popupExito, setPopupExito] = useState(false);
    const [rolesBD, setRolesBD] = useState([]);
    const [idRolInvestigador, setIdRolInvestigador] = useState(null);
    useEffect(() => {
        fetch("http://localhost:8080/api/catalogos/tipos_identificacion")
            .then(res => res.json())
            .then(data => setTiposIdentificacion(data))
            .catch(() => setTiposIdentificacion([]));
        fetch("http://localhost:8080/api/catalogos/roles")
            .then(res => res.json())
            .then(data => {
                setRolesBD(data);
                // Detecta el nombre del rol investigador
                const investigador = data.find(r => r.nombreRol && r.nombreRol.toLowerCase() === "investigador");
                if (investigador) setIdRolInvestigador(investigador.nombreRol);
            })
            .catch(() => setRolesBD([]));
    }, []);

    // Estados para cada campo del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        nacionalidad: "",
        tipoIdentificacion: "",
        identificacion: "",
        telefono: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        roles: []
    });

    // Estados para mostrar/ocultar contraseñas
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

    // Estado inicial para resetear el formulario
    const initialFormData = {
        nombre: "",
        nacionalidad: "",
        tipoIdentificacion: "",
        identificacion: "",
        telefono: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        roles: []
    };
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [popupIdentificacion, setPopupIdentificacion] = useState(false);

    // Estado para los datos del popup de investigador
    const initialDatosInvestigador = {
        institucionOrigen: "",
        unidadAcademica: "",
        idCodigoGradoAcademico: null,
        acreditaciones: []
    };
    const [datosInvestigador, setDatosInvestigador] = useState(initialDatosInvestigador);

    // Actualiza el estado al cambiar cualquier campo
    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "correo") {
            setFormData(prev => ({ ...prev, correo: value }));
            // Validar formato de correo
            if (value && !value.endsWith("@ucr.ac.cr")) {
                setErrorCorreo("El correo debe terminar en @ucr.ac.cr");
            } else {
                setErrorCorreo("");
            }
            return;
        }
        if (name === "telefono") {
            setFormData(prev => ({ ...prev, telefono: value }));
            // Validar que solo contenga números y símbolos (no letras)
            const contieneLetras = /[a-zA-ZÀ-ÿ]/.test(value);
            if (value && contieneLetras) {
                setErrorTelefono("El teléfono no debe contener letras");
            } else {
                setErrorTelefono("");
            }
            return;
        }
        if (name === "contrasena") {
            setFormData(prev => ({ ...prev, contrasena: value }));
            // Validar longitud mínima de contraseña
            if (value && value.length < 8) {
                setErrorFormatoContrasena("La contraseña debe tener al menos 8 caracteres");
            } else {
                setErrorFormatoContrasena("");
            }
            return;
        }
        if (name === "roles") {
            setFormData(prev => {
                let newRoles = [...prev.roles];
                if (checked) {
                    // Si se marca investigador
                    if (value === idRolInvestigador) {
                        if (newRoles.length === 1 && newRoles[0] !== idRolInvestigador) {
                            newRoles = [newRoles[0], idRolInvestigador];
                        } else {
                            newRoles.push(idRolInvestigador);
                        }
                        setMostrarPopup(true);
                    } else {
                        // Si investigador está marcado, permite investigador + uno
                        if (newRoles.includes(idRolInvestigador)) {
                            if (newRoles.length < 2) {
                                newRoles.push(value);
                            } else {
                                newRoles = [idRolInvestigador, value];
                            }
                        } else {
                            newRoles = [value];
                        }
                    }
                } else {
                    // Desmarcar
                    newRoles = newRoles.filter(r => r !== value);
                    if (value === idRolInvestigador) {
                        setMostrarPopup(false);
                        setDatosInvestigador(null);
                    }
                }
                // Solo permite investigador + uno, o solo uno
                if (newRoles.length > 2) {
                    if (newRoles.includes(idRolInvestigador)) {
                        newRoles = [idRolInvestigador, newRoles.find(r => r !== idRolInvestigador)];
                    } else {
                        newRoles = [newRoles[0]];
                    }
                }
                return { ...prev, roles: newRoles };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Verifica si el número de identificación ya existe
    const verificarIdentificacion = async () => {
        if (!formData.identificacion) return;
        try {
            const res = await fetch(`http://localhost:8080/api/usuarios/verificar-identificacion/${formData.identificacion}`);
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    setPopupIdentificacion(true);
                } else {
                    setPopupIdentificacion(false);
                }
            }
        } catch {
            setPopupIdentificacion(false);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorContrasena("");
        // Validación de campos obligatorios
        const camposObligatorios = [
            formData.nombre,
            formData.nacionalidad,
            formData.tipoIdentificacion,
            formData.identificacion,
            formData.telefono,
            formData.correo,
            formData.contrasena,
            formData.confirmarContrasena
        ];
        if (camposObligatorios.some(campo => !campo || campo.trim() === "")) {
            setPopupError({ visible: true, mensaje: "Debe completar todos los campos antes de registrar." });
            return;
        }
        // Validación de correo institucional
        if (!formData.correo.endsWith("@ucr.ac.cr")) {
            setErrorCorreo("El correo debe terminar en @ucr.ac.cr");
            return;
        }
        // Validación de teléfono sin letras
        const contieneLetras = /[a-zA-ZÀ-ÿ]/.test(formData.telefono);
        if (formData.telefono && contieneLetras) {
            setErrorTelefono("El teléfono no debe contener letras");
            return;
        }
        // Validación de longitud mínima de contraseña
        if (formData.contrasena && formData.contrasena.length < 8) {
            setErrorFormatoContrasena("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        // Validación de coincidencia de contraseñas
        if (formData.contrasena !== formData.confirmarContrasena) {
            setErrorContrasena("Las contraseñas no coinciden");
            return;
        }
        // Si la identificación está repetida, no enviar el formulario
        if (popupIdentificacion) {
            setPopupIdentificacion(true);
            return;
        }
        // Mapear idCodigoTipoId dinámicamente y nacionalidad como ' '
        const tipoIdObj = tiposIdentificacion.find(tipo => tipo.valor === formData.tipoIdentificacion);
        const idCodigoTipoId = tipoIdObj ? tipoIdObj.id : null;
        let dataEnviar = {
            nombreCompleto: formData.nombre,
            nacionalidad: formData.nacionalidad,
            idCodigoTipoId: idCodigoTipoId,
            identificacion: formData.identificacion,
            correo: formData.correo,
            telefono: formData.telefono,
            nombreUsuario: formData.correo,
            contrasena: formData.contrasena,
            roles: formData.roles
        };
        // Si tiene rol investigador, agrega los datos del popup
        if (formData.roles.includes(idRolInvestigador) && datosInvestigador) {
            // Solo agrega si hay datos válidos
            if (datosInvestigador && datosInvestigador.institucionOrigen) {
                dataEnviar = {
                    ...dataEnviar,
                    institucionOrigen: datosInvestigador.institucionOrigen,
                    unidadAcademica: datosInvestigador.unidadAcademica,
                    idCodigoGradoAcademico: datosInvestigador.idCodigoGradoAcademico,
                    acreditaciones: datosInvestigador.acreditaciones || []
                };
            }
        }
        try {
            console.log("Datos enviados al backend:", dataEnviar);
            const response = await fetch("http://localhost:8080/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataEnviar)
            });
            if (response.ok) {
                // Registro exitoso
                setFormData(initialFormData);
                setMostrarContrasena(false);
                setMostrarConfirmarContrasena(false);
                setErrorCorreo("");
                setErrorTelefono("");
                setErrorContrasena("");
                setErrorFormatoContrasena("");
                setMostrarPopup(false);
                setDatosInvestigador(null);
                setPopupExito(true);
                setTimeout(() => setPopupExito(false), 4000);
            } else {
                // Mostrar el mensaje de error exacto del backend en popup visual
                const errorMsg = await response.text();
                setPopupError({ visible: true, mensaje: errorMsg });
            }
        } catch (error) {
            setPopupError({ visible: true, mensaje: "Error de conexión." });
        }
    };

    return (
        <div className="form-container">
            <form className="form-content" onSubmit={handleSubmit}>
                <h2>Registro</h2>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    className="input-field"
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="nacionalidad"
                    placeholder="Nacionalidad"
                    className="input-field"
                    value={formData.nacionalidad}
                    onChange={handleChange}
                />
                <select
                    className="input-field"
                    name="tipoIdentificacion"
                    value={formData.tipoIdentificacion}
                    onChange={handleChange}
                >
                    <option value="">Identificación</option>
                    {tiposIdentificacion.map(tipo => (
                        <option key={tipo.id} value={tipo.valor}>
                            {tipo.despliegue ? tipo.despliegue.charAt(0).toUpperCase() + tipo.despliegue.slice(1).toLowerCase() : ""}
                        </option>
                    ))}
                </select>
                <div className="input-group">
                    <input
                        type="text"
                        name="identificacion"
                        placeholder="Número de identificación"
                        className="input-field"
                        value={formData.identificacion}
                        onChange={handleChange}
                        onBlur={verificarIdentificacion}
                    />
                    <small className="input-message">Sin guiones</small>
                </div>
                {popupIdentificacion && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button
                                onClick={() => setPopupIdentificacion(false)}
                                className="popup-close-btn"
                                aria-label="Cerrar"
                            >&#10005;</button>
                            <div className="popup-title-error">
                                Error al registrar
                            </div>
                            <div className="popup-message">
                                El número de identificación y/o correo no se pueden repetir
                            </div>
                        </div>
                    </div>
                )}
                <div className="input-group">
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        className="input-field"
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                    <small className="input-message">Sin guiones</small>
                </div>
                {errorTelefono && (
                    <div className="validation-error-message">
                        {errorTelefono}
                    </div>
                )}
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico: example@ucr.ac.cr"
                    className="input-field"
                    value={formData.correo}
                    onChange={handleChange}
                />
                {errorCorreo && (
                    <div className="validation-error-message">
                        {errorCorreo}
                    </div>
                )}
                <div className="input-group">
                    <div className="password-container">
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            name="contrasena"
                            placeholder="Contraseña"
                            className="input-field password-input"
                            value={formData.contrasena}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="password-toggle-btn"
                            aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {mostrarContrasena ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    <small className="input-message">Mínimo 8 caracteres</small>
                </div>
                {errorFormatoContrasena && (
                    <div className="validation-error-message">
                        {errorFormatoContrasena}
                    </div>
                )}
                <div className="input-group">
                    <div className="password-container">
                        <input
                            type={mostrarConfirmarContrasena ? "text" : "password"}
                            name="confirmarContrasena"
                            placeholder="Confirmar contraseña"
                            className="input-field password-input"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                            className="password-toggle-btn"
                            aria-label={mostrarConfirmarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {mostrarConfirmarContrasena ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>
                {errorContrasena && (
                    <div className="validation-error-message">
                        {errorContrasena}
                    </div>
                )}
                <div className="roles">
                    {/* Todos los roles como checkboxes, con regla investigador + uno */}
                    {rolesBD.map((rol) => (
                        <label key={rol.id} className="round-checkbox">
                            <input
                                type="checkbox"
                                name="roles"
                                value={rol.nombreRol}
                                checked={formData.roles.includes(rol.nombreRol)}
                                onChange={handleChange}
                                disabled={
                                    // Si ya hay investigador + uno, deshabilita los demás
                                    formData.roles.length === 2 &&
                                    !formData.roles.includes(rol.nombreRol) &&
                                    ((formData.roles.includes(idRolInvestigador) && rol.nombreRol !== idRolInvestigador) ||
                                        (!formData.roles.includes(idRolInvestigador)))
                                }
                            />
                            {rol.nombreRol.charAt(0).toUpperCase() + rol.nombreRol.slice(1).toLowerCase()}
                            <span className="checkmark"></span>
                        </label>
                    ))}
                </div>
                {idRolInvestigador && formData.roles.includes(idRolInvestigador) && (
                    <div className="input-group">
                        {/* Campos de investigador se manejan en el popup */}
                    </div>
                )}
                <button type="submit" className="submit-btn">Registrar</button>
                <button
                    type="button"
                    className="btn-link-login"
                    onClick={() => window.location.href = "/"}
                >
                    Ingresar en mi cuenta
                </button>
            </form>
            {idRolInvestigador && formData.roles.includes(idRolInvestigador) && mostrarPopup && (
                <RegistroInvestigador
                    onClose={() => setMostrarPopup(false)}
                    onConfirm={datos => {
                        // Normaliza los datos recibidos del popup
                        setDatosInvestigador({
                            institucionOrigen: datos.institucion,
                            unidadAcademica: datos.unidadAcademica,
                            idCodigoGradoAcademico: Number(datos.gradoAcademico) || null,
                            acreditaciones: Array.isArray(datos.acreditaciones) ? datos.acreditaciones : []
                        });
                        setMostrarPopup(false);
                    }}
                />
            )}
            {/* Popup de éxito visual */}
            {popupExito && (
                <div className="popup-success">
                    <div className="popup-title-success">
                        Usuario registrado exitosamente
                    </div>
                </div>
            )}
            {/* Popup de error visual */}
            {popupError.visible && (
                <div className="popup-overlay-error">
                    <div className="popup-content-general">
                        <button
                            onClick={() => setPopupError({ visible: false, mensaje: "" })}
                            className="popup-close-btn"
                            aria-label="Cerrar"
                        >&#10005;</button>
                        <div className="popup-title-error">
                            Error al intentar registrar el usuario
                        </div>
                        <div className="popup-message">
                            {popupError.mensaje}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Registro;