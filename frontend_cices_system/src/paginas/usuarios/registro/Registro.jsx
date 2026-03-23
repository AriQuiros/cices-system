import React, { useState, useEffect, useContext } from "react";
import "../../../styles/paginas.css";
import { EmpleadoProvider } from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";
import { EmpleadoContext } from "../../../context/empleadoCtx/EmpleadoContext.jsx";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { registerEmpleado } from "../../../services/EmpleadoService.jsx";
import { notify } from '../../../utils/ui/notify.jsx';
import RegistroInvestigador from "./RegistroInvestigador.jsx";
import { InvestigadorContext } from "../../../context/investigadorCtx/InvestigadorContext.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, correoUCR, minLength, maxLength, match } from "../../../utils/validaciones/Validators.jsx";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";
import {AppContext} from "../../../context/AppContext.jsx";

countries.registerLocale(es);

const ROLES_RESTRINGIDOS = new Set(["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"]);

const normalizarNombreRol = (nombreRol = "") =>
    nombreRol
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

const combinacionRolesValida = (roles = []) => {
    const nombres = roles.map((r) => normalizarNombreRol(r?.nombreRol));
    const incluyeInvestigador = nombres.includes("INVESTIGADOR");

    if (roles.length > 2) {
        return {
            valida: false,
            mensaje: "Solo se permiten máximo 2 roles"
        };
    }

    if (roles.length === 2 && !incluyeInvestigador) {
        return {
            valida: false,
            mensaje: "La combinación permitida es INVESTIGADOR y un rol adicional"
        };
    }

    const incluyeRolRestringido = nombres.some((nombre) => ROLES_RESTRINGIDOS.has(nombre));
    const mezclaInvalida =
        incluyeRolRestringido &&
        nombres.some((nombre) => nombre !== "INVESTIGADOR" && !ROLES_RESTRINGIDOS.has(nombre));

    if (mezclaInvalida) {
        return {
            valida: false,
            mensaje: "DIRECCION, ADMINISTRATIVO y ASISTENTE solo se pueden combinar con INVESTIGADOR"
        };
    }

    return { valida: true, mensaje: "" };
};

function RegistroInner({ modoPerfil = false }) {
    const { token } = useContext(AppContext);

    const { empleado, actualizarCampo, setEmpleado, usuario, actualizarCampoUsuario, limpiarEmpleado, limpiarUsuario, setUsuario } = useContext(EmpleadoContext);
    const { investigador, limpiarInvestigador } = useContext(InvestigadorContext);

    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [tipos, setTipos] = useState([]);
    const [rolesBD, setRolesBD] = useState([]);

    const countryOptions = Object.entries(countries.getNames("es")).map(
        ([code, name]) => ({
            value: code,
            label: name
        })
    );

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

    useEffect(() => {

        if (!modoPerfil) return;

        (async () => {
            try {
                const res = await fetch("http://localhost:8080/api/reports/perfil/empleado", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error();

                const data = await res.json();

                const { usuario, ...empleadoData } = data;

                setEmpleado(empleadoData);
                setUsuario({
                    ...usuario,
                    nombreUsuario: data.correo
                });

            } catch {
                notify.error("Error cargando perfil");
            }
        })();

    }, [modoPerfil]);

    const handleChange = (e) => {

        const { name, value, checked } = e.target;

        if (name === "roles") {

            const currentRoles = usuario.roles || [];
            let newRoles = [...currentRoles];

            const rolSeleccionado = rolesBD.find(r => r.nombreRol === value);

            if (checked && rolSeleccionado) {

                if (currentRoles.length >= 2) {

                    notify.error("Solo se permiten máximo 2 roles");
                    return;

                }

                newRoles.push(rolSeleccionado);

            } else {

                newRoles = newRoles.filter(r => r.nombreRol !== value);

            }

            const validacion = combinacionRolesValida(newRoles);

            if (!validacion.valida) {

                notify.error(validacion.mensaje);
                return;

            }

            actualizarCampoUsuario("roles", newRoles);
            return;

        }

        if (name === "contrasena") {
            actualizarCampoUsuario("contrasena", value);
        }

        if (name === "correo") {
            actualizarCampo("correo", value);
            actualizarCampoUsuario("nombreUsuario", value);
        }
        else{
            actualizarCampo(name,value);
        }


    };

    const handleCodigoChange = (campo, valor, lista) => {

        const obj = lista.find(t => t.valor === valor);
        actualizarCampo(campo, obj);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const rolesSeleccionados = usuario.roles || [];

        if (rolesSeleccionados.length < 1 || rolesSeleccionados.length > 2) {
            notify.error("Debe seleccionar mínimo 1 rol y máximo 2 roles");
            return;
        }

        const validacionRoles = combinacionRolesValida(rolesSeleccionados);

        if (!validacionRoles.valida) {
            notify.error(validacionRoles.mensaje);
            return;
        }

        const esInvestigador = rolesSeleccionados.some((r) => normalizarNombreRol(r?.nombreRol) === "INVESTIGADOR");

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
console.log(payload)
        if (modoPerfil) {

            try {
                const res = await fetch("http://localhost:8080/api/empleados/actualizar", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    notify.success("Perfil actualizado");
                } else {
                    notify.error("Error al actualizar perfil");
                }

            } catch {
                notify.error("Error de conexión");
            }

            return;
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
        maxLength: 9,
        pattern: undefined
    };

    if (tipoId === "NACIONAL") {
        idConfig.maxLength = 10;
        idConfig.pattern = "\\d{1,10}";
    }

    if (tipoId === "DIMEX") {
        idConfig.maxLength = 15;
        idConfig.pattern = "\\d{1,15}";
    }

    if (tipoId === "PASAPORTE") {
        idConfig.maxLength = 20;
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (

        <div className={`form-container ${modoPerfil ? "perfil-page" : ""}`}>

            <form className={`form-content ${modoPerfil ? "perfil-card" : ""}`} onSubmit={handleSubmit}>

                <h2 className={modoPerfil ? "perfil-title" : ""}>{modoPerfil ? "Mi Perfil" : "Registro"}</h2>
                <div className="row">
                    <InputField
                        label="Nombre Completo"
                        name="nombreCompleto"
                        placeholder="Nombre completo"
                        value={empleado.nombreCompleto}
                        onChange={handleChange}
                        rules={[required(), maxLength(30)]}
                        maxLength={30}
                        className="input-field"
                        required
                    />
                    <div className={"input-group"}>
                    <label className="input-label">Tipo de Identificación</label>
                    <Select
                        required
                        placeholder="Seleccione tipo de identificación"
                        options={tipos["TIPO_IDENTIFICACION"]?.map(t => ({
                            value: t.valor,
                            label: t.despliegue
                        }))}
                        value={
                            empleado.tipoId
                                ? { value: empleado.tipoId.valor, label: empleado.tipoId.despliegue }
                                : null
                        }
                        onChange={(option) => handleCodigoChange("tipoId", option.value, tipos["TIPO_IDENTIFICACION"])}
                    />
                    </div>

                <InputField
                    label="Número de Identificación"
                    name="identificacion"
                    placeholder="Sin guiones"
                    value={empleado.identificacion}
                    onChange={(e) => {

                        let value = e.target.value;

                        // solo números si es NACIONAL o DIMEX
                        if (tipoId === "NACIONAL" || tipoId === "DIMEX") {
                            value = value.replace(/\D/g, "");
                        }

                        if (value.length <= idConfig.maxLength) {
                            actualizarCampo("identificacion", value);
                        }

                    }}
                    inputMode= {(tipoId === "NACIONAL" || tipoId === "DIMEX")?"numeric":"text"}
                    maxLength={idConfig.maxLength}
                    pattern={idConfig.pattern}
                    className="input-field"
                    required
                />
                </div>
                <div className="row">
                    <div className={"input-group"}>

                    <label className="input-label">País</label>

                    <Select
                        required
                        name={"pais"}
                        options={countryOptions}
                        placeholder="Buscar país..."
                        value={
                            empleado.pais
                                ? countryOptions.find(c => c.value === empleado.pais)
                                : null
                        }
                        onChange={(option) => actualizarCampo("pais", option.value)}
                    />

                </div>

                <div className="input-group">

                    <label className="input-label">Número de teléfono</label>

                    <PhoneInput
                        required
                        id="numeroTelefono"
                        name="numeroTelefono"
                        className="phone-input-control"
                        placeholder="Ingrese número"
                        value={empleado.numeroTelefono}
                        onChange={(value) => {
                            if (!value) return actualizarCampo("numeroTelefono", value);

                            const numeros = value.replace(/\D/g, "");
                            const local = numeros.startsWith("506") ? numeros.slice(3) : numeros;

                            if (local.length <= 8) {
                                actualizarCampo("numeroTelefono", value);
                            }
                        }}
                        defaultCountry="CR"
                    />

                </div>

                <div className="input-group">
                    <label className="input-label">Grado Académico</label>

                    <Select
                        required
                        placeholder="Seleccione grado académico"
                        options={tipos["GRADO_ACADEMICO"]?.map(t => ({
                            value: t.valor,
                            label: t.despliegue
                        }))}
                        value={
                            empleado.gradoAcademico
                                ? { value: empleado.gradoAcademico.valor, label: empleado.gradoAcademico.despliegue }
                                : null
                        }
                        onChange={(option) => handleCodigoChange("gradoAcademico", option.value, tipos["GRADO_ACADEMICO"])}
                    />
                </div>
                </div>

                <InputField
                    label="Correo Electrónico"
                    type="email"
                    name="correo"
                    placeholder="ejemplo@ucr.ac.cr"
                    value={empleado.correo}
                    onChange={handleChange}
                    rules={[required(), correoUCR(), maxLength(254)]}
                    maxLength={50}
                    className="input-field"
                    required
                />
                {!modoPerfil && (
                    <>
                <div className="password-container">
                    <InputField
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        placeholder="Mínimo 8 caracteres"
                        value={usuario?.contrasena || ""}
                        onChange={handleChange}
                        rules={[required(), minLength(8), maxLength(254)]}
                        maxLength={32}
                        className="input-field password-input"
                        required
                    />

                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="password-container">
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
                        maxLength={32}
                        className="input-field password-input"
                        required
                    />

                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                    >
                        {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                </div>
                    </>
                )}

                <div className="roles">

                    {rolesBD.map((rol) => (

                        <label key={rol.id} className="round-checkbox">

                            <input
                                type="checkbox"
                                name="roles"
                                value={rol.nombreRol}
                                checked={(usuario?.roles || []).some(r => r.nombreRol === rol.nombreRol)}
                                disabled={
                                    !(usuario?.roles || []).some((r) => r.nombreRol === rol.nombreRol) &&
                                    (
                                        (usuario?.roles || []).length >= 2 ||
                                        !combinacionRolesValida([...(usuario?.roles || []), rol]).valida
                                    )
                                 || modoPerfil}
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
                    {modoPerfil ? "Actualizar Perfil" : "Registrar"}
                </button>

                <button hidden={modoPerfil}
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

export default function Registro({ modoPerfil = false }) {

    return (
        <EmpleadoProvider>
            <InvestigadorProvider>
                <RegistroInner modoPerfil={modoPerfil} />
            </InvestigadorProvider>
        </EmpleadoProvider>
    );
}