import React, { useState, useEffect } from "react";
import "./Registro.css";
import RegistroInvestigador from "./RegistroInvestigador";


function Registro() {
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
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
        roles: [],
        numeroBecario: ""
    });
    const [mostrarPopup, setMostrarPopup] = useState(false);

    // Actualiza el estado al cambiar cualquier campo
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "roles") {
            setFormData(prev => {
                let newRoles = [...prev.roles];
                if (type === "checkbox") {
                    if (checked) {
                        newRoles.push(value);
                    } else {
                        newRoles = newRoles.filter(r => r !== value);
                    }
                } else if (type === "radio") {
                    newRoles = [value];
                }
                // Mostrar/ocultar popup y campo becario según investigador
                if (idRolInvestigador && value === idRolInvestigador) {
                    setMostrarPopup(checked);
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

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mapear idCodigoTipoId dinámicamente y nacionalidad como ' '
        const tipoIdObj = tiposIdentificacion.find(tipo => tipo.valor === formData.tipoIdentificacion);
        const idCodigoTipoId = tipoIdObj ? tipoIdObj.id : null;
        const dataEnviar = {
            nombreCompleto: formData.nombre,
            nacionalidad: formData.nacionalidad,
            idCodigoTipoId: idCodigoTipoId,
            identificacion: formData.identificacion,
            correo: formData.correo,
            telefono: formData.telefono,
            nombreUsuario: formData.correo,
            contrasena: formData.contrasena,
            roles: formData.roles,
            numeroBecario: formData.numeroBecario
        };
        try {
            const response = await fetch("http://localhost:8080/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataEnviar)
            });
            if (response.ok) {
                // Registro exitoso
                alert("Usuario registrado correctamente");
            } else {
                // Mostrar el mensaje de error exacto del backend
                const errorMsg = await response.text();
                alert(errorMsg);
            }
        } catch (error) {
            alert("Error de conexión");
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
                    />
                    <small className="input-message">Sin guiones</small>
                </div>
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
                <div className="roles">
                    {rolesBD.map((rol) => (
                        <label key={rol.id} className={rol.nombreRol.toLowerCase() === "investigador" ? "round-checkbox" : ""}>
                            <input
                                type={rol.nombreRol.toLowerCase() === "investigador" ? "checkbox" : "radio"}
                                name="roles"
                                value={rol.nombreRol}
                                checked={formData.roles.includes(rol.nombreRol)}
                                onChange={handleChange}
                            />
                            {rol.nombreRol.charAt(0).toUpperCase() + rol.nombreRol.slice(1).toLowerCase()}
                            {rol.nombreRol.toLowerCase() === "investigador" && <span className="checkmark"></span>}
                        </label>
                    ))}
                </div>
                {idRolInvestigador && formData.roles.includes(idRolInvestigador) && (
                    <div className="input-group">
                        <label>Número de becario:</label>
                        <input
                            type="text"
                            name="numeroBecario"
                            placeholder="(Si aplica)"
                            className="input-field"
                            value={formData.numeroBecario}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <button type="submit" className="submit-btn">Registrar</button>
            </form>
            {idRolInvestigador && formData.roles.includes(idRolInvestigador) && mostrarPopup && (
                <RegistroInvestigador onClose={() => setMostrarPopup(false)} />
            )}
        </div>
    );
}

export default Registro;