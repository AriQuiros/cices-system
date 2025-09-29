import React, { useState, useEffect } from "react";
import "./Registro.css";
import RegistroInvestigador from "./RegistroInvestigador";


function Registro() {
    // Estado para mostrar error de coincidencia de contraseñas
    const [errorContrasena, setErrorContrasena] = useState("");
    // Estado para mostrar popup de error general
    const [popupError, setPopupError] = useState({ visible: false, mensaje: "" });
    // Estado para error de formato de correo
    const [errorCorreo, setErrorCorreo] = useState("");
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
            setPopupError({ visible: true, mensaje: "Error de conexión" });
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
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 2000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(2px)"
                    }}>
                        <div style={{
                            position: "relative",
                            background: "#f3f3f3",
                            border: "1px solid #bdbdbd",
                            color: "#333",
                            padding: "24px 32px 20px 32px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                            minWidth: "320px",
                            maxWidth: "90vw",
                            textAlign: "center"
                        }}>
                            <button
                                onClick={() => setPopupIdentificacion(false)}
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "12px",
                                    background: "none",
                                    border: "none",
                                    fontSize: "1.2rem",
                                    color: "#888",
                                    cursor: "pointer"
                                }}
                                aria-label="Cerrar"
                            >&#10005;</button>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px", color: "#d32f2f" }}>
                                Error al registrar
                            </div>
                            <div style={{ fontSize: "1rem" }}>
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
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico: example@ucr.ac.cr"
                    className="input-field"
                    value={formData.correo}
                    onChange={handleChange}
                />
                {errorCorreo && (
                    <div style={{ color: '#d32f2f', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
                        {errorCorreo}
                    </div>
                )}
                <div className="input-group">
                    <input
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña"
                        className="input-field"
                        value={formData.contrasena}
                        onChange={handleChange}
                    />
                    <small className="input-message">Mínimo 8 caracteres</small>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="confirmarContrasena"
                        placeholder="Confirmar contraseña"
                        className="input-field"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                    />
                </div>
                {errorContrasena && (
                    <div style={{ color: '#d32f2f', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
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
                    style={{
                        background: "none",
                        border: "none",
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginTop: "10px",
                        fontSize: "1rem"
                    }}
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
                <div style={{
                    position: "fixed",
                    top: "6%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 4000,
                    background: "#e0e0e0",
                    border: "1px solid #bdbdbd",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    minWidth: "320px",
                    maxWidth: "90vw",
                    textAlign: "center",
                    padding: "18px 32px 16px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px", color: "#388e3c" }}>
                        Usuario registrado exitosamente
                    </div>
                </div>
            )}
            {/* Popup de error visual */}
            {popupError.visible && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 3000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(2px)"
                }}>
                    <div style={{
                        position: "relative",
                        background: "#e0e0e0",
                        border: "1px solid #bdbdbd",
                        color: "#333",
                        padding: "24px 32px 20px 32px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                        minWidth: "320px",
                        maxWidth: "90vw",
                        textAlign: "center"
                    }}>
                        <button
                            onClick={() => setPopupError({ visible: false, mensaje: "" })}
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "12px",
                                background: "none",
                                border: "none",
                                fontSize: "1.2rem",
                                color: "#888",
                                cursor: "pointer"
                            }}
                            aria-label="Cerrar"
                        >&#10005;</button>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px", color: "#d32f2f" }}>
                            Error al intentar registrar el usuario
                        </div>
                        <div style={{ fontSize: "1rem" }}>
                            {popupError.mensaje}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Registro;