import React, { useState, useEffect, useContext } from "react";
import "./Registro.css";
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

countries.registerLocale(es);

function RegistroInner() {
    const { empleado, actualizarCampo, usuario, actualizarCampoUsuario, limpiarEmpleado, limpiarUsuario } = useContext(EmpleadoContext);
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

                <div className="input-group">

                    <label className="input-label">País</label>

                    <Select
                        required
                        options={countryOptions}
                        placeholder="Buscar país..."
                        onChange={(option) => actualizarCampo("pais", option.value)}
                    />

                </div>

                    <div className="input-group">
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
                    required
                />

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

                <div className="input-group">

                    <label className="input-label">Número de teléfono</label>

                    <PhoneInput
                        required
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

                <InputField
                    label="Correo Electrónico"
                    type="email"
                    name="correo"
                    placeholder="ejemplo@ucr.ac.cr"
                    value={empleado.correo}
                    onChange={handleChange}
                    rules={[required(), correoUCR(), maxLength(254)]}
                    maxLength={50}
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
                    maxLength={32}
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
                    maxLength={32}
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