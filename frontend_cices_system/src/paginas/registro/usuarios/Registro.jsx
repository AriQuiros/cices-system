import React, { useState, useEffect, useContext } from "react";
import "./Registro.css";
import { EmpleadoProvider } from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";
import { EmpleadoContext } from "../../../context/empleadoCtx/EmpleadoContext.jsx";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { registerEmpleado } from "../../../services/EmpleadoService.jsx";
import { notify } from '../../../utils/estilo/notify.jsx';
import RegistroInvestigador from "./RegistroInvestigador.jsx";
import { InvestigadorContext } from "../../../context/investigadorCtx/InvestigadorContext.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, correoUCR, minLength, maxLength, match } from "../../../utils/validaciones/Validators.jsx";

function RegistroInner() {

    const { empleado, actualizarCampo, usuario, actualizarCampoUsuario, limpiarEmpleado, limpiarUsuario } = useContext(EmpleadoContext);
    const { investigador, limpiarInvestigador } = useContext(InvestigadorContext);

    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [tipos, setTipos] = useState([]);
    const [rolesBD, setRolesBD] = useState([]);

    useEffect(() => {

        (async () => {

            try {

                const res = await fetchTiposCatalogo("", ["TIPO_IDENTIFICACION", "GRADO_ACADEMICO"]);
                setTipos(res || []);

            } catch {

                setTipos([]);

            }

            try {

                const r = await fetch("http://localhost:8080/api/rol-sistema");

                if (r.ok) {

                    const data = await r.json();
                    setRolesBD(data);

                } else {

                    setRolesBD([]);

                }

            } catch {

                setRolesBD([]);

            }

        })();

    }, []);

    const handleChange = (e) => {

        const { name, value, checked } = e.target;

        if (name === "roles") {

            const currentRoles = usuario.roles || [];
            let newRoles = [...currentRoles];

            const rolSeleccionado = rolesBD.find(r => r.nombreRol === value);

            if (checked && rolSeleccionado) {

                newRoles.push(rolSeleccionado);

            } else {

                newRoles = newRoles.filter(r => r.nombreRol !== value);

            }

            actualizarCampoUsuario("roles", newRoles);
            return;

        }

        const directFields = [
            "nombreCompleto",
            "pais",
            "identificacion",
            "numeroTelefono"
        ];

        if (directFields.includes(name)) {

            actualizarCampo(name, value);

        } else {

            if (name === "contrasena") {

                actualizarCampoUsuario("contrasena", value);

            }

            if (name === "correo") {

                actualizarCampo("correo", value);
                actualizarCampoUsuario("nombreUsuario", value);

            }

        }

    };

    const handleCodigoChange = (campo, valor, lista) => {

        const obj = lista.find(t => t.valor === valor);
        actualizarCampo(campo, obj);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario.roles || usuario.roles.length === 0) {
            notify.error("Debe seleccionar al menos un rol");
            return;
        }

        const esInvestigador = usuario.roles?.some(r => r.nombreRol === "INVESTIGADOR");

        let payload;

        if (esInvestigador) {

            payload = {
                ...investigador,
                empleado: {
                    ...empleado,
                    usuario
                }
            };

        } else {

            payload = {
                ...empleado,
                usuario
            };

        }

        try {

            const result = await registerEmpleado(payload, esInvestigador);

            if (result.ok) {

                notify.success("Registro exitoso");

                limpiarEmpleado();
                limpiarUsuario();
                limpiarInvestigador();
                setConfirmarContrasena("")

            } else {

                notify.error(result.message || `Registro falló`);

            }

        } catch {

            notify.error("Error de conexión");

        }

    };

    const tipoId = (empleado.tipoId?.valor || "").toUpperCase();

    const idConfig = {
        type: "text",
        maxLength: 20,
        pattern: undefined
    };

    if (tipoId === "NACIONAL") {

        idConfig.type = "number";
        idConfig.maxLength = 10;
        idConfig.pattern = "\\d{1,10}";

    }

    if (tipoId === "DIMEX") {

        idConfig.type = "number";
        idConfig.maxLength = 15;
        idConfig.pattern = "\\d{1,15}";

    }

    if (tipoId === "PASAPORTE") {

        idConfig.type = "text";
        idConfig.maxLength = 20;

    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (

        <div className="form-container">

            <form className="form-content" onSubmit={handleSubmit}>

                <h2>Registro</h2>

                <InputField
                    label="Nombre Completo"
                    name="nombreCompleto"
                    placeholder="Nombre completo"
                    value={empleado.nombreCompleto}
                    onChange={handleChange}
                    rules={[required(), maxLength(254)]}
                    maxLength={254}
                    required
                />

                <InputField
                    label="País"
                    name="pais"
                    placeholder="Ej: CR"
                    value={empleado.pais}
                    onChange={handleChange}
                    rules={[required(), maxLength(4)]}
                    maxLength={4}
                    required
                />

                <div className="input-group">

                    <label className="input-label">Tipo de Identificación</label>

                    <select
                        required
                        className="input-field"
                        value={empleado.tipoId?.valor || ""}
                        onChange={(e) => handleCodigoChange("tipoId", e.target.value, tipos["TIPO_IDENTIFICACION"])}
                    >

                        <option value="">identificación</option>

                        {tipos["TIPO_IDENTIFICACION"]?.map(tipo => (

                            <option key={tipo.id} value={tipo.valor}>
                                {tipo.despliegue}
                            </option>

                        ))}

                    </select>

                </div>

                <InputField
                    label="Número de Identificación"
                    name="identificacion"
                    placeholder="Sin guiones"
                    value={empleado.identificacion}
                    onChange={handleChange}
                    rules={[required(), maxLength(20)]}
                    type={idConfig.type}
                    maxLength={idConfig.maxLength}
                    pattern={idConfig.pattern}
                    required
                />

                <div className="input-group">

                    <label className="input-label">Grado Academico</label>

                    <select
                        required
                        className="input-field"
                        value={empleado.gradoAcademico?.valor || ""}
                        onChange={(e) => handleCodigoChange("gradoAcademico", e.target.value, tipos["GRADO_ACADEMICO"])}
                    >

                        <option value="">Grado</option>

                        {tipos["GRADO_ACADEMICO"]?.map(tipo => (

                            <option key={tipo.id} value={tipo.valor}>
                                {tipo.despliegue}
                            </option>

                        ))}

                    </select>

                </div>

                <InputField
                    label="Número de teléfono"
                    name="numeroTelefono"
                    placeholder="Ej: 88888888"
                    type="text"
                    value={empleado.numeroTelefono}
                    onChange={handleChange}
                    rules={[required(), maxLength(15)]}
                    maxLength={15}
                    required
                />

                <InputField
                    label="Correo Electrónico"
                    type="email"
                    name="correo"
                    placeholder="ejemplo@ucr.ac.cr"
                    value={empleado.correo}
                    onChange={handleChange}
                    rules={[required(), correoUCR(), maxLength(254)]}
                    maxLength={254}
                    required
                />

                <InputField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    name="contrasena"
                    placeholder="Mínimo 8 caracteres"
                    value={usuario?.contrasena || ""}
                    onChange={handleChange}
                    rules={[required(), minLength(8), maxLength(254)]}
                    maxLength={254}
                    required
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>

                <InputField
                    label="Confirmar Contraseña"
                    placeholder="Mínimo 8 caracteres"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmarContrasena"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    rules={[
                        required(),
                        match(() => usuario?.contrasena, "Las contraseñas no coinciden"),
                        maxLength(254)
                    ]}
                    maxLength={254}
                    required
                />

                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? "🙈" : "👁️"}
                </button>

                <div className="roles">

                    {rolesBD.map((rol) => (

                        <label key={rol.id} className="round-checkbox">

                            <input
                                type="checkbox"
                                name="roles"
                                value={rol.nombreRol}
                                checked={(usuario?.roles || []).some(r => r.nombreRol === rol.nombreRol)}
                                onChange={handleChange}
                            />

                            {rol.nombreRol.charAt(0).toUpperCase() + rol.nombreRol.slice(1).toLowerCase()}

                            <span className="checkmark"></span>

                        </label>

                    ))}

                </div>

                {usuario?.roles?.some(r => r.nombreRol === "INVESTIGADOR") && (

                    <RegistroInvestigador
                        nivelAcademico={tipos["GRADO_ACADEMICO"]}
                    />

                )}

                <button type="submit" className="submit-btn">
                    Registrar
                </button>

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