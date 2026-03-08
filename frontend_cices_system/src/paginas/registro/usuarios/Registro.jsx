import React, { useState, useEffect, useContext } from "react";
import "./Registro.css";
import { EmpleadoProvider } from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";
import { EmpleadoContext } from "../../../context/empleadoCtx/EmpleadoContext.jsx";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { UsuarioDTO } from "../../../modelos/empleadoDTO.jsx";
import { registerEmpleado } from "../../../services/EmpleadoService.jsx";
import { notify } from '../../../utils/estilo/notify.jsx';
import RegistroInvestigador from "./RegistroInvestigador.jsx";
import {InvestigadorContext} from "../../../context/investigadorCtx/InvestigadorContext.jsx";

function RegistroInner() {
    // Use empleado state from provider
    const { empleado, actualizarCampo, limpiarEmpleado } = useContext(EmpleadoContext);
    const { investigador, limpiarInvestigador } = useContext(InvestigadorContext);
    const [tipos, setTipos] = useState([]);
    const [rolesBD, setRolesBD] = useState([]);
    const [idRolInvestigador, setIdRolInvestigador] = useState(null);

    useEffect(() => {
        // cargar tipos usando fetchTiposCatalogo
        (async () => {
            try {
                const res = await fetchTiposCatalogo("", ["TIPO_IDENTIFICACION", "GRADO_ACADEMICO"]);
                if (res) {
                    setTipos(res);
                } else {
                    setTipos([]);
                }
            } catch {
                setTipos([]);
            }

            try {
                const r = await fetch("http://localhost:8080/api/rol-sistema");
                if (r.ok) {
                    const data = await r.json();
                    setRolesBD(data);
                    const investigador = data.find(r => r.toLowerCase() === "investigador");
                    if (investigador) setIdRolInvestigador(investigador);
                } else {
                    setRolesBD([]);
                }
            } catch {
                setRolesBD([]);
            }
        })();
    }, []);

    // Actualiza campos del empleado usando proveedor
    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "roles") {
            const currentRoles = empleado.usuario?.roles || [];
            let newRoles = [...currentRoles];

            if (checked)
                newRoles.push(value);
            else
                newRoles = newRoles.filter(r => r !== value);

            // eliminar duplicados
            newRoles = [...new Set(newRoles)];

            // máximo 2 roles
            if (newRoles.length > 2) {
                newRoles = newRoles.slice(0, 2);
            }

            // si hay 2 roles y ninguno es investigador
            if (newRoles.length === 2 && !newRoles.includes(idRolInvestigador)) {
                newRoles = [value];
            }

            actualizarCampo("usuario", {
                ...empleado.usuario,
                roles: newRoles
            });
            return;

        }else {
            // Si el name corresponde directamente a una propiedad de EmpleadoDTO -> actualizarla
            const directFields = [
                "nombreCompleto",
                "pais",
                "tipoId",
                "identificacion",
                "numeroTelefono",
                "gradoAcademico"
            ];
            if (directFields.includes(name)) {
                actualizarCampo(name, value);
            } else {
                if (name === "contrasena") {
                    actualizarCampo("usuario", { ...empleado.usuario, contrasena: value });
                }
                if (name === "correo") {
                    // sincronizar correo en raíz
                    actualizarCampo("correo", value);
                    actualizarCampo("usuario", { ...empleado.usuario, nombreUsuario: value });
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload;
        const esInvestigador = empleado.usuario?.roles?.includes("INVESTIGADOR");
        if (esInvestigador) {
            payload = {
                ...investigador,
                empleado: {
                    ...empleado,
                    usuario: {
                        ...UsuarioDTO,
                        ...(empleado.usuario || {})
                    }
                }
            };
        } else {
            payload = {
                ...empleado,
                usuario: {
                    ...UsuarioDTO,
                    ...(empleado.usuario || {})
                }
            };
        }

        console.log("Payload a enviar:", payload);
        try {
            const result = await registerEmpleado(payload, esInvestigador);

            if (result.ok) {
                notify.success("Registro exitoso");
                limpiarEmpleado();
                limpiarInvestigador();
            } else {
                notify.error(result.message || `Registro falló: ${result.status}`);
            }

        } catch (err) {
            notify.error(err?.message || "Error de conexión");
        }
    };

    return (
        <div className="form-container">
            <form className="form-content" onSubmit={handleSubmit}>
                <h2>Registro</h2>

                <div className="input-group">
                    <label htmlFor="nombre" className="input-label">Nombre Completo</label>
                    <input
                        id="nombreCompleto"
                        type="text"
                        name="nombreCompleto"
                        placeholder="Ingrese su nombre completo"
                        className="input-field"
                        value={empleado.nombreCompleto}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="pais" className="input-label">Nacionalidad</label>
                    <input
                        id="pais"
                        type="text"
                        name="pais"
                        placeholder="Ingrese su nacionalidad"
                        className="input-field"
                        value={empleado.pais}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="tipoId" className="input-label">Tipo de Identificación</label>
                    <select
                        id="tipoId"
                        className="input-field"
                        name="tipoId"
                        value={empleado.tipoId}
                        onChange={handleChange}
                    >
                        <option value="">identificación</option>
                        {tipos["TIPO_IDENTIFICACION"]?.map(tipo => (
                            <option key={tipo.id} value={tipo.valor}>
                                {tipo.despliegue ? tipo.despliegue.charAt(0).toUpperCase() + tipo.despliegue.slice(1).toLowerCase() : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="identificacion" className={`input-label`}>
                        Número de Identificación
                    </label>
                    <input
                        id="identificacion"
                        type="text"
                        name="identificacion"
                        placeholder="Sin guiones"
                        className="input-field"
                        value={empleado.identificacion}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="gradoAcademico" className="input-label">Grado Academico</label>
                    <select
                        id="gradoAcademico"
                        className="input-field"
                        name="gradoAcademico"
                        value={empleado.gradoAcademico}
                        onChange={handleChange}
                    >
                        <option value="">Grado</option>
                        {tipos["GRADO_ACADEMICO"]?.map(tipo => (
                            <option key={tipo.id} value={tipo.valor}>
                                {tipo.despliegue ? tipo.despliegue.charAt(0).toUpperCase() + tipo.despliegue.slice(1).toLowerCase() : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="numeroTelefono" className={`input-label`}>
                        Número de teléfono
                    </label>
                    <input
                        id="numeroTelefono"
                        type="tel"
                        name="numeroTelefono"
                        placeholder="Ejemplo: (+506)88888888"
                        className="input-field"
                        value={empleado.numeroTelefono}
                        onChange={handleChange}
                    />
                    <small className="input-message">Sin guiones</small>
                </div>

                <div className="input-group">
                    <label htmlFor="correo" className={`input-label`}>
                        Correo Electrónico
                    </label>
                    <input
                        id="correo"
                        type="email"
                        name="correo"
                        placeholder="example@ucr.ac.cr"
                        className="input-field"
                        value={empleado.correo}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="contrasena" className={`input-label`}>
                        Contraseña
                    </label>
                    <div className="password-container">
                        <input
                            id="contrasena"
                            type="password"
                            name="contrasena"
                            placeholder="********"
                            className="input-field password-input"
                            value={empleado.usuario?.contrasena || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <small className="input-message">Mínimo 8 caracteres</small>
                </div>

                <div className="roles">
                    {/* Todos los roles como checkboxes, con regla investigador + uno */}
                    {rolesBD.map((rol) => (
                        <label key={rol} className="round-checkbox">
                            <input
                                type="checkbox"
                                name="roles"
                                value={rol}
                                checked={(empleado.usuario?.roles || []).includes(rol)}
                                onChange={handleChange}
                                disabled={
                                    (empleado.usuario?.roles || []).length >= 2 &&
                                    !(empleado.usuario?.roles || []).includes(rol)
                                }
                            />
                            {rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase()}
                            <span className="checkmark"></span>
                        </label>
                    ))}
                </div>

                {empleado.usuario?.roles?.includes("INVESTIGADOR") && (
                    <RegistroInvestigador
                        nivelAcademico={tipos["GRADO_ACADEMICO"]}
                        onClose={() => actualizarCampo("usuario", { ...empleado.usuario, roles: empleado.usuario.roles.filter(r => r !== "INVESTIGADOR") })}
                    />
                )}

                <button type="submit" className="submit-btn">Registrar</button>
                <button
                    type="button"
                    className="btn-link-login"
                    onClick={() => window.location.href = "/"}
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default function Registro() {
    return (
        <EmpleadoProvider>
            <InvestigadorProvider>
                <RegistroInner />
            </InvestigadorProvider>
        </EmpleadoProvider>
    );
}
