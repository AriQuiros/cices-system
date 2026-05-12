// src/paginas/usuarios/formUsuario/FormularioUsuario.jsx
import { useState } from "react";
import InputField from "../../utils/ui/InputField.jsx";
import { required, correoUCR, minLength, maxLength, match } from "../../validators/Validators.jsx";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";
import RegistroInvestigador from "./RegistroInvestigador.jsx";

countries.registerLocale(es);
const countryOptions = Object.entries(countries.getNames("es")).map(
    ([code, name]) => ({ value: code, label: name })
);

const formatearRol = (nombreRol = "") =>
    nombreRol.charAt(0).toUpperCase() + nombreRol.slice(1).toLowerCase();

function getIdConfig(tipoId) {
    if (tipoId === "NACIONAL")  return { maxLength: 10, pattern: "\\d{1,10}" };
    if (tipoId === "DIMEX")     return { maxLength: 15, pattern: "\\d{1,15}" };
    if (tipoId === "PASAPORTE") return { maxLength: 20, pattern: undefined };
    return { maxLength: 9, pattern: undefined };
}

export default function FormularioUsuario({
                                              // Estado
                                              empleado, usuario, investigador,
                                              confirmarContrasena, setConfirmarContrasena,
                                              tipos, rolesBD, loading,

                                              // Handlers del hook
                                              handleChange,
                                              handleCodigoChange,
                                              actualizarCampo,
                                              actualizarCampoUsuario,
                                              actualizarCampoInvestigador,
                                              actualizarItemInvestigador,
                                              agregarItemInvestigador,
                                              eliminarItemInvestigador,

                                              // Handlers de campos especiales (vienen del hook)
                                              handleIdentificacionChange,
                                              handleCorreoChange,
                                              handleTelefonoChange,
                                              rolDeshabilitado,

                                              onSubmit,
                                              modoPerfil,

                                              // Re-auth
                                              authOk, requiereAuth, authPassword,
                                              setRequiereAuth, setAuthPassword, handleReAuth, user,

                                              clases = {}
                                          }) {
    const {
        contenedor = "", form = "", titulo = "", fila = "",
        grupoInput = "", label = "", passwordContainer = "",
        passwordToggle = "", rolLabel = "", roles = "",
        btnSubmit = "", btnEditar = "", btnLogin = "",
        authModal = "", authBox = "", phoneCss = ""
    } = clases;

    // Solo estado de UI puro — toggle visibilidad contraseña
    const [showPassword,        setShowPassword]        = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const tipoId   = (empleado.tipoId?.valor || "").toUpperCase();
    const idConfig = getIdConfig(tipoId);

    return (
        <div className={contenedor}>
            <form className={form} onSubmit={onSubmit}>

                <h2 className={titulo}>{modoPerfil ? "Mi Perfil" : "Registro"}</h2>

                {/* Fila 1: Nombre · Tipo ID · Número ID */}
                <div className={fila}>
                    <InputField
                        label="Nombre Completo" name="nombreCompleto"
                        placeholder="Nombre completo" value={empleado.nombreCompleto}
                        onChange={handleChange} rules={[required(), maxLength(30)]}
                        maxLength={30} required
                    />

                    <div className={grupoInput}>
                        <label className={label}>Tipo de Identificación</label>
                        <Select
                            required
                            placeholder="Seleccione tipo de identificación"
                            options={(tipos["TIPO_IDENTIFICACION"] || []).map(t => ({
                                value: t.valor, label: t.despliegue
                            }))}
                            value={empleado.tipoId
                                ? { value: empleado.tipoId.valor, label: empleado.tipoId.despliegue }
                                : null}
                            onChange={opt => handleCodigoChange("tipoId", opt.value, tipos["TIPO_IDENTIFICACION"])}
                        />
                    </div>

                    <div className={grupoInput}>
                        <InputField
                            label="Número de Identificación" name="identificacion"
                            placeholder="Sin guiones" value={empleado.identificacion}
                            inputMode={tipoId === "NACIONAL" || tipoId === "DIMEX" ? "numeric" : "text"}
                            maxLength={idConfig.maxLength} pattern={idConfig.pattern}
                            required disabled={modoPerfil && !authOk}
                            onChange={e => handleIdentificacionChange(e, authOk, setRequiereAuth)}
                        />
                        {modoPerfil && !authOk && (
                            <button type="button" className={btnEditar}
                                    onClick={() => setRequiereAuth(true)}>
                                Editar identificación
                            </button>
                        )}
                    </div>
                </div>

                {/* Fila 2: País · Teléfono · Grado Académico */}
                <div className={fila}>
                    <div className={grupoInput}>
                        <label className={label}>País</label>
                        <Select
                            required options={countryOptions} placeholder="Buscar país..."
                            value={empleado.pais ? countryOptions.find(c => c.value === empleado.pais) : null}
                            onChange={opt => actualizarCampo("pais", opt.value)}
                        />
                    </div>

                    <div className={grupoInput}>
                        <label className={label}>Número de teléfono</label>
                        <PhoneInput
                            className={phoneCss} required placeholder="Ingrese número"
                            value={empleado.numeroTelefono}
                            onChange={val => handleTelefonoChange(val)}
                            defaultCountry="CR"
                        />
                    </div>

                    <div  className={`${grupoInput} col2`}>
                        <label className={label}>Grado Académico</label>
                        <Select
                            className="select-grado"
                            required placeholder="Seleccione grado académico"
                            options={(tipos["GRADO_ACADEMICO"] || []).map(t => ({
                                value: t.valor, label: t.despliegue
                            }))}
                            value={empleado.gradoAcademico
                                ? { value: empleado.gradoAcademico.valor, label: empleado.gradoAcademico.despliegue }
                                : null}
                            onChange={opt => handleCodigoChange("gradoAcademico", opt.value, tipos["GRADO_ACADEMICO"])}
                        />
                    </div>
                </div>

                {/* Correo */}
                <InputField
                    label="Correo Electrónico" type="email" name="correo"
                    placeholder="ejemplo@ucr.ac.cr" value={empleado.correo}
                    disabled={modoPerfil && !authOk}
                    onChange={e => handleCorreoChange(e, authOk, setRequiereAuth)}
                    rules={[required(),  maxLength(254)]}
                    maxLength={50} required
                />
                {modoPerfil && !authOk && (
                    <button type="button" className={btnEditar}
                            onClick={() => setRequiereAuth(true)}>
                        Editar correo
                    </button>
                )}

                {/* Contraseña — solo Registro */}
                {!modoPerfil && (
                    <>
                        <div className={passwordContainer}>
                            <InputField
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                name="contrasena" placeholder="Mínimo 8 caracteres"
                                value={usuario?.contrasena || ""}
                                onChange={e => actualizarCampoUsuario("contrasena", e.target.value)}
                                rules={[required(), minLength(8), maxLength(254)]}
                                maxLength={32} required
                            />
                            <button type="button" className={passwordToggle}
                                    onClick={() => setShowPassword(v => !v)}>
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <div className={passwordContainer}>
                            <InputField
                                label="Confirmar Contraseña"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmarContrasena" placeholder="Mínimo 8 caracteres"
                                value={confirmarContrasena}
                                onChange={e => setConfirmarContrasena(e.target.value)}
                                rules={[
                                    required(),
                                    match(() => usuario?.contrasena, "Las contraseñas no coinciden"),
                                    maxLength(254)
                                ]}
                                maxLength={32} required
                            />
                            <button type="button" className={passwordToggle}
                                    onClick={() => setShowConfirmPassword(v => !v)}>
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </>
                )}

                {/* Roles */}
                <div className={roles}>
                    {rolesBD.map(rol => (
                        <label key={rol.id} className={rolLabel}>
                            <input
                                type="checkbox" name="roles" value={rol.nombreRol}
                                checked={(usuario?.roles || []).some(r => r.nombreRol === rol.nombreRol)}
                                disabled={rolDeshabilitado(rol)}
                                onChange={handleChange}
                            />
                            {formatearRol(rol.nombreRol)}
                            <span className="checkmark"></span>
                        </label>
                    ))}
                </div>

                {/* Sección Investigador */}
                {usuario?.roles?.some(r => r.nombreRol === "INVESTIGADOR") && (
                    <RegistroInvestigador
                        investigador={investigador}
                        nivelAcademico={tipos["GRADO_ACADEMICO"] || []}
                        modoPerfil={modoPerfil}
                        onActualizarCampo={actualizarCampoInvestigador}
                        onActualizarItem={actualizarItemInvestigador}
                        onAgregarItem={agregarItemInvestigador}
                        onEliminarItem={eliminarItemInvestigador}
                    />
                )}

                {/* Submit */}
                <button type="submit" className={btnSubmit} disabled={loading}>
                    {loading
                        ? (modoPerfil ? "Actualizando..." : "Registrando...")
                        : (modoPerfil ? "Actualizar Perfil" : "Registrar")}
                </button>

                {!modoPerfil && (
                    <button type="button" className={btnLogin}
                            onClick={() => window.location.href = "/"}>
                        Iniciar Sesión
                    </button>
                )}

                {/* Modal re-autenticación */}
                {modoPerfil && requiereAuth && (
                    <div className={authModal}>
                        <div className={authBox}>
                            <h3>Confirmar identidad</h3>
                            <p>{user?.username}</p>
                            <InputField
                                type="password" placeholder="Contraseña"
                                value={authPassword}
                                rules={[required(), minLength(8)]}
                                onChange={e => setAuthPassword(e.target.value)}
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