import React, { useState } from "react";
import "./Registro.css";

import { EmpleadoProvider } from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";

import { useRegistro } from "../../../hooks/usuarios/useRegistro";
import { useAuthConfirm } from "../../../hooks/usuarios/useAuthConfirm";

import { buildPayloadRegistro } from "../../../services/EmpleadoService.jsx";

import RegistroInvestigador from "./RegistroInvestigador.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import {
    required,
    correoUCR,
    minLength,
    maxLength,
    match
} from "../../../utils/validaciones/Validators.jsx";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Select from "react-select";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

import { AppContext } from "../../../context/AppContext.jsx";

countries.registerLocale(es);

function RegistroInner({ modoPerfil = false }) {

    const {
        empleado,
        usuario,
        investigador,
        tipos,
        rolesBD,
        loading,
        handleChange,
        handleCodigoChange,
        actualizarCampo,
        actualizarCampoUsuario,
        handleSubmit
    } = useRegistro({ modoPerfil });

    const { user } = React.useContext(AppContext);

    const {
        requiereAuth,
        authPassword,
        authOk,
        setRequiereAuth,
        setAuthPassword,
        handleReAuth
    } = useAuthConfirm(user);

    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const countryOptions = Object.entries(countries.getNames("es")).map(
        ([code, name]) => ({ value: code, label: name })
    );

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

    // 🔹 submit limpio
    const onSubmit = (e) => {
        e.preventDefault();

        const payload = buildPayloadRegistro({
            empleado,
            usuario,
            investigador
        });

        handleSubmit(payload, authPassword);
    };

    return (
        <div className={`form-container ${modoPerfil ? "perfil-page" : ""}`}>
            <form className={`form-content ${modoPerfil ? "perfil-card" : ""}`} onSubmit={onSubmit}>
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
                        inputMode= {(tipoId === "NACIONAL" || tipoId === "DIMEX")?"numeric":"text"}
                        maxLength={idConfig.maxLength}
                        pattern={idConfig.pattern}
                        className="input-field"
                        required
                        disabled={modoPerfil && !authOk}
                        onChange={(e) => {

                            if (modoPerfil && !authOk) {
                                setRequiereAuth(true);
                                return;
                            }

                            let value = e.target.value;

                            if (tipoId === "NACIONAL" || tipoId === "DIMEX") {
                                value = value.replace(/\D/g, "");
                            }

                            if (value.length <= idConfig.maxLength) {
                                actualizarCampo("identificacion", value);
                            }

                        }}
                    />
                    {modoPerfil && !authOk && (
                        <button
                            type="button"
                            onClick={() => setRequiereAuth(true)}
                            className="btn-secondary"
                        >
                            Editar identificación
                        </button>
                    )}
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
                    placeholder={"Ejemplo@ucr.ac.cr"}
                    value={empleado.correo}
                    disabled={modoPerfil && !authOk}
                    onChange={(e) => {

                    if (modoPerfil && !authOk) {
                        setRequiereAuth(true);
                        return;
                    }

                    actualizarCampo("correo", e.target.value);
                    actualizarCampoUsuario("nombreUsuario", e.target.value);
                }}
                    rules={[required(), correoUCR(), maxLength(254)]}
                    required
                    />
                {modoPerfil && !authOk && (
                    <button
                        type="button"
                        onClick={() => setRequiereAuth(true)}
                        className="btn-secondary"
                    >
                        Editar correo
                    </button>
                )}

                {!modoPerfil && (
                    <>
                        <InputField
                            label="Contraseña"
                            type="password"
                            name="contrasena"
                            value={usuario?.contrasena || ""}
                            onChange={(e) =>
                                actualizarCampoUsuario("contrasena", e.target.value)
                            }
                            rules={[required(), minLength(8), maxLength(254)]}
                            required
                        />

                        <InputField
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            rules={[
                                required(),
                                match(
                                    () => usuario?.contrasena,
                                    "Las contraseñas no coinciden"
                                )
                            ]}
                            required
                        />
                    </>
                )}

                {/* --- ROLES --- */}
                <div className="roles">
                    {rolesBD.map((rol) => (
                        <label key={rol.id}>
                            <input
                                type="checkbox"
                                value={rol.nombreRol}
                                checked={(usuario?.roles || []).some(
                                    (r) => r.nombreRol === rol.nombreRol
                                )}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    let roles = [...(usuario.roles || [])];

                                    if (checked) {
                                        roles.push(rol);
                                    } else {
                                        roles = roles.filter(
                                            (r) => r.nombreRol !== rol.nombreRol
                                        );
                                    }

                                    actualizarCampoUsuario("roles", roles);
                                }}
                                disabled={modoPerfil}
                            />
                            {rol.nombreRol}
                        </label>
                    ))}
                </div>

                {/* --- INVESTIGADOR --- */}
                {usuario?.roles?.some((r) => r.nombreRol === "INVESTIGADOR") && (
                    <RegistroInvestigador
                        nivelAcademico={tipos["GRADO_ACADEMICO"]}
                        modoPerfil={modoPerfil}
                    />
                )}

                <button type="submit" className={"submit-btn"} disabled={loading}>
                    {loading
                        ? modoPerfil
                            ? "Actualizando..."
                            : "Registrando..."
                        : modoPerfil
                            ? "Actualizar Perfil"
                            : "Registrar"}
                </button>

                {requiereAuth && (
                    <div className="auth-modal">
                        <div className="auth-box">
                            <h3>Confirmar identidad</h3>

                            <p>{user?.username}</p>

                            <input
                                type="password"
                                placeholder={"contraseña"}
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                            />

                            <button type="button" onClick={handleReAuth}>
                                Confirmar
                            </button>

                            <button
                                type="button"
                                onClick={() => setRequiereAuth(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

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