/**
 * FormularioUsuario.jsx
 *
 * Componente compartido entre Registro y Perfil.
 * No importa ningún CSS — recibe un objeto `clases` con los nombres
 * de clase que cada página quiera aplicar a cada elemento.
 *
 * Estructura del prop `clases`:
 * {
 *   contenedor:        className del div raíz
 *   form:              className del <form>
 *   titulo:            className del <h2>
 *   fila:              className de cada fila de campos agrupados
 *   grupoInput:        className del wrapper de un campo con label
 *   label:             className de los <label>
 *   passwordContainer: className del wrapper de campo contraseña + toggle
 *   passwordToggle:    className del botón 👁️ mostrar/ocultar contraseña
 *   rolLabel:          className de cada <label> de checkbox de rol
 *   roles:             className del contenedor de checkboxes de roles
 *   btnSubmit:         className del botón de submit
 *   btnEditar:         className de los botones "Editar …" (solo perfil)
 *   btnLogin:          className del botón "Iniciar Sesión" (solo registro)
 *   authModal:         className del overlay del modal de re-autenticación
 *   authBox:           className del contenido del modal
 * }
 *
 * Todos los valores son opcionales — si no se pasan quedan como
 * string vacío y el elemento se renderiza sin clase.
 */

import React, { useState } from "react";

import InputField from "../../../utils/validaciones/InputField.jsx";
import {
    required,
    correoUCR,
    minLength,
    maxLength,
    match,
} from "../../../utils/validaciones/Validators.jsx";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Select from "react-select";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

import RegistroInvestigador from "./RegistroInvestigador.jsx";
import BotonVolver from "../../../components/BotonVolver";

countries.registerLocale(es);

const countryOptions = Object.entries(countries.getNames("es")).map(
    ([code, name]) => ({ value: code, label: name })
);

// ── Helpers de roles ────────────────────────────────────────────────────────

const ROLES_RESTRINGIDOS = new Set(["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"]);

const normalizarNombreRol = (nombreRol = "") =>
    nombreRol.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

const combinacionRolesValida = (roles = []) => {
    const nombres = roles.map((r) => normalizarNombreRol(r?.nombreRol));
    const incluyeInvestigador = nombres.includes("INVESTIGADOR");

    if (roles.length > 2)
        return { valida: false, mensaje: "Solo se permiten máximo 2 roles" };

    if (roles.length === 2 && !incluyeInvestigador)
        return { valida: false, mensaje: "La combinación permitida es INVESTIGADOR y un rol adicional" };

    const incluyeRolRestringido = nombres.some((n) => ROLES_RESTRINGIDOS.has(n));
    const mezclaInvalida =
        incluyeRolRestringido &&
        nombres.some((n) => n !== "INVESTIGADOR" && !ROLES_RESTRINGIDOS.has(n));

    if (mezclaInvalida)
        return { valida: false, mensaje: "DIRECCION, ADMINISTRATIVO y ASISTENTE solo se pueden combinar con INVESTIGADOR" };

    return { valida: true, mensaje: "" };
};

/** Calcula config dinámica del campo identificación según el tipo. */
function getIdConfig(tipoId) {
    const config = { maxLength: 9, pattern: undefined };
    if (tipoId === "NACIONAL")  { config.maxLength = 10; config.pattern = "\\d{1,10}"; }
    if (tipoId === "DIMEX")     { config.maxLength = 15; config.pattern = "\\d{1,15}"; }
    if (tipoId === "PASAPORTE") { config.maxLength = 20; }
    return config;
}

/** Formatea el nombre del rol: primera letra mayúscula, resto minúsculas. */
const formatearRol = (nombreRol = "") =>
    nombreRol.charAt(0).toUpperCase() + nombreRol.slice(1).toLowerCase();


export default function FormularioUsuario({
    empleado,
    usuario,
    tipos,
    rolesBD,
    loading,

    // ── Handlers del hook useRegistro ──────────────────────────────────────
    handleChange,
    handleCodigoChange,
    actualizarCampo,
    actualizarCampoUsuario,
    onSubmit,

    // ── Modo ───────────────────────────────────────────────────────────────
    modoPerfil,

    // ── Solo Registro: confirmar contraseña ────────────────────────────────
    confirmarContrasena,
    setConfirmarContrasena,

    // ── Solo Perfil: re-autenticación ──────────────────────────────────────
    authOk,
    requiereAuth,
    authPassword,
    setRequiereAuth,
    setAuthPassword,
    handleReAuth,
    user,

    // ── Clases CSS (configurables por cada página) ─────────────────────────
    clases = {},
}) {
    const {
        contenedor        = "",
        form              = "",
        titulo            = "",
        fila              = "",
        grupoInput        = "",
        label             = "",
        passwordContainer = "",
        passwordToggle    = "",
        rolLabel          = "",
        roles             = "",
        btnSubmit         = "",
        btnEditar         = "",
        btnLogin          = "",
        authModal         = "",
        authBox           = "",
        phoneCss                 = "",
    } = clases;

    // ── Estado local ───────────────────────────────────────────────────────
    const [showPassword,        setShowPassword]        = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const tipoId   = (empleado.tipoId?.valor || "").toUpperCase();
    const idConfig = getIdConfig(tipoId);

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleIdentificacionChange = (e) => {
        if (modoPerfil && !authOk) { setRequiereAuth(true); return; }

        let value = e.target.value;
        if (tipoId === "NACIONAL" || tipoId === "DIMEX") value = value.replace(/\D/g, "");
        if (value.length <= idConfig.maxLength) actualizarCampo("identificacion", value);
    };

    const handleCorreoChange = (e) => {
        if (modoPerfil && !authOk) { setRequiereAuth(true); return; }
        actualizarCampo("correo", e.target.value);
        actualizarCampoUsuario("nombreUsuario", e.target.value);
    };

    const handleTelefonoChange = (value) => {
        if (!value) return actualizarCampo("numeroTelefono", value);
        const numeros = value.replace(/\D/g, "");
        const local   = numeros.startsWith("506") ? numeros.slice(3) : numeros;
        if (local.length <= 8) actualizarCampo("numeroTelefono", value);
    };

    /** Determina si un checkbox de rol debe estar deshabilitado. */
    const rolDeshabilitado = (rol) => {
        if (modoPerfil) return true;
        const rolesActuales = usuario?.roles || [];
        const yaSeleccionado = rolesActuales.some((r) => r.nombreRol === rol.nombreRol);
        if (yaSeleccionado) return false;
        return (
            rolesActuales.length >= 2 ||
            !combinacionRolesValida([...rolesActuales, rol]).valida
        );
    };

    // ────────────────────────────────────────────────────────────────────────

    return (
        <div className={contenedor}>

            <form className={form} onSubmit={onSubmit}>
                <BotonVolver/>
                <h2 className={titulo}>{modoPerfil ? "Mi Perfil" : "Registro"}</h2>

                {/* ── Fila 1: Nombre · Tipo ID · Número ID ─────────────────── */}
                <div className={fila}>
                    <InputField
                        label="Nombre Completo"
                        name="nombreCompleto"
                        placeholder="Nombre completo"
                        value={empleado.nombreCompleto}
                        onChange={handleChange}
                        rules={[required(), maxLength(30)]}
                        maxLength={30}
                        required
                    />

                    <div className={grupoInput}>
                        <label className={label}>Tipo de Identificación</label>
                        <Select
                            required
                            placeholder="Seleccione tipo de identificación"
                            options={tipos["TIPO_IDENTIFICACION"]?.map((t) => ({
                                value: t.valor,
                                label: t.despliegue,
                            }))}
                            value={
                                empleado.tipoId
                                    ? {value: empleado.tipoId.valor, label: empleado.tipoId.despliegue}
                                    : null
                            }
                            onChange={(opt) =>
                                handleCodigoChange("tipoId", opt.value, tipos["TIPO_IDENTIFICACION"])
                            }
                        />
                    </div>

                    <div className={grupoInput}>

                        <InputField
                            label="Número de Identificación"
                            name="identificacion"
                            placeholder="Sin guiones"
                            value={empleado.identificacion}
                            inputMode={tipoId === "NACIONAL" || tipoId === "DIMEX" ? "numeric" : "text"}
                            maxLength={idConfig.maxLength}
                            pattern={idConfig.pattern}
                            required
                            disabled={modoPerfil && !authOk}
                            onChange={handleIdentificacionChange}
                        />

                        {modoPerfil && !authOk && (
                            <button
                                type="button"
                                className={btnEditar}
                                onClick={() => setRequiereAuth(true)}
                            >
                                Editar identificación
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Fila 2: País · Teléfono · Grado Académico ────────────── */}
                <div className={fila}>
                    <div className={grupoInput}>
                        <label className={label}>País</label>
                        <Select
                            required
                            name="pais"
                            options={countryOptions}
                            placeholder="Buscar país..."
                            value={
                                empleado.pais
                                    ? countryOptions.find((c) => c.value === empleado.pais)
                                    : null
                            }
                            onChange={(opt) => actualizarCampo("pais", opt.value)}
                        />
                    </div>

                    <div className={grupoInput}>
                        <label className={label}>Número de teléfono</label>
                        <PhoneInput
                            className={phoneCss}
                            required
                            id="numeroTelefono"
                            name="numeroTelefono"
                            placeholder="Ingrese número"
                            value={empleado.numeroTelefono}
                            onChange={handleTelefonoChange}
                            defaultCountry={"CR" || empleado.pais}
                        />
                    </div>

                    <div className={`${grupoInput} col2`}>
                        <label className={label}>Grado Académico</label>
                        <Select
                            className="select-grado"
                            required
                            placeholder="Seleccione grado académico"
                            options={tipos["GRADO_ACADEMICO"]?.map((t) => ({
                                value: t.valor,
                                label: t.despliegue,
                            }))}
                            value={
                                empleado.gradoAcademico
                                    ? {value: empleado.gradoAcademico.valor, label: empleado.gradoAcademico.despliegue}
                                    : null
                            }
                            onChange={(opt) =>
                                handleCodigoChange("gradoAcademico", opt.value, tipos["GRADO_ACADEMICO"])
                            }
                        />
                    </div>
                </div>

                {/* ── Correo ───────────────────────────────────────────────── */}
                <InputField
                    label="Correo Electrónico"
                    type="email"
                    name="correo"
                    placeholder="ejemplo@ucr.ac.cr"
                    value={empleado.correo}
                    disabled={modoPerfil && !authOk}
                    onChange={handleCorreoChange}
                    rules={[required(), correoUCR(), maxLength(254)]}
                    maxLength={50}
                    required
                />

                {modoPerfil && !authOk && (
                    <button
                        type="button"
                        className={btnEditar}
                        onClick={() => setRequiereAuth(true)}
                    >
                        Editar correo
                    </button>
                )}

                {/* ── Contraseña (solo Registro) ────────────────────────────── */}
                {!modoPerfil && (
                    <>
                        <div className={passwordContainer}>
                            <InputField
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                name="contrasena"
                                placeholder="Mínimo 8 caracteres"
                                value={usuario?.contrasena || ""}
                                onChange={(e) => actualizarCampoUsuario("contrasena", e.target.value)}
                                rules={[required(), minLength(8), maxLength(254)]}
                                maxLength={32}
                                required
                            />
                            <button
                                type="button"
                                className={passwordToggle}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <div className={passwordContainer}>
                            <InputField
                                label="Confirmar Contraseña"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmarContrasena"
                                placeholder="Mínimo 8 caracteres"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                rules={[
                                    required(),
                                    match(() => usuario?.contrasena, "Las contraseñas no coinciden"),
                                    maxLength(254),
                                ]}
                                maxLength={32}
                                required
                            />
                            <button
                                type="button"
                                className={passwordToggle}
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </>
                )}

                {/* ── Roles ─────────────────────────────────────────────────── */}
                <div className={roles}>
                    {rolesBD.map((rol) => (
                        <label key={rol.id} className={rolLabel}>
                            <input
                                type="checkbox"
                                name="roles"
                                value={rol.nombreRol}
                                checked={(usuario?.roles || []).some(
                                    (r) => r.nombreRol === rol.nombreRol
                                )}
                                disabled={rolDeshabilitado(rol)}
                                onChange={handleChange}
                            />
                            {formatearRol(rol.nombreRol)}
                            <span className="checkmark"></span>
                        </label>
                    ))}
                </div>

                {/* ── Sección Investigador ──────────────────────────────────── */}
                {usuario?.roles?.some((r) => r.nombreRol === "INVESTIGADOR") && (
                    <RegistroInvestigador
                        nivelAcademico={tipos["GRADO_ACADEMICO"]}
                        modoPerfil={modoPerfil}
                    />
                )}

                {/* ── Botón submit ──────────────────────────────────────────── */}
                <button type="submit" className={btnSubmit} disabled={loading}>
                    {loading
                        ? modoPerfil ? "Actualizando..." : "Registrando..."
                        : modoPerfil ? "Actualizar Perfil" : "Registrar"}
                </button>

                {/* ── Botón "Iniciar Sesión" (solo Registro) ────────────────── */}
                {!modoPerfil && (
                    <button
                        type="button"
                        className={btnLogin}
                        onClick={() => window.location.href = "/"}
                    >
                        Iniciar Sesión
                    </button>
                )}

                {/* ── Modal re-autenticación (solo Perfil) ──────────────────── */}
                {modoPerfil && requiereAuth && (
                    <div className={authModal}>
                        <div className={authBox}>
                            <h3>Confirmar identidad</h3>
                            <p>{user?.username}</p>
                            <InputField
                                type="password"
                                placeholder="contraseña"
                                value={authPassword}
                                rules={[required(), minLength(8)]}
                                onChange={(e) => setAuthPassword(e.target.value)}
                            />
                            <button type="button" onClick={handleReAuth} disabled={!authPassword}>
                                Confirmar
                            </button>
                            <button type="button" onClick={() => setRequiereAuth(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
}
