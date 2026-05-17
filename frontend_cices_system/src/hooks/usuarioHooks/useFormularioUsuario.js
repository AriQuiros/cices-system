// src/modules/usuario/hooks/useFormularioUsuario.js
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useAuth } from "../authHooks/useAuth.js";
import { usePerfilEmpleado } from "../empleadoHooks/queries/usePerfilEmpleado.js";
import { usePerfilInvestigador } from "../InvestigadorHooks/queries/usePerfilInvestigador.js";
import { useCrearEmpleado } from "../empleadoHooks/mutations/useCrearEmpleado.js";
import { useActualizarEmpleado } from "../empleadoHooks/mutations/useActualizarEmpleado.js";
import { useCrearInvestigador } from "../InvestigadorHooks/mutations/useCrearInvestigador.js";
import { useActualizarInvestigador } from "../InvestigadorHooks/mutations/useActualizarInvestigador.js";
import { useRolesSistema } from "../referenceDataHooks/useRolesSistema.js";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";
import { combinacionRolesValida } from "../../utils/rolesUtils.js";
import { notify } from "../../utils/ui/notify.jsx";
import { confirm } from "../../utils/ui/confirm.jsx";
import { loginSrv } from "../../services/authServices/authService.js";
import { EmpleadoDTO, UsuarioDTO } from "../../modelos/empleadoDTO.jsx";
import { InvestigadorDTO } from "../../modelos/investigadorDTO.jsx";

const buildPayloadRegistro = ({ empleado, usuario, investigador, isInvestigador }) => {
    if (isInvestigador) {
        return {
            ...investigador,
            empleado: {
                ...empleado,
                usuario
            }
        };
    }

    return {
        ...empleado,
        usuario
    };
};

export const useFormularioUsuario = ({ modoPerfil }) => {

    const { user, login } = useContext(AppContext);
    const { isInvestigador } = useAuth();

    // ── Estado local del formulario ──────────────────────────────────────
    const [empleado, setEmpleado] = useState({ ...EmpleadoDTO });
    const [usuario,  setUsuario]  = useState({ ...UsuarioDTO });
    const [investigador, setInvestigador] = useState({ ...InvestigadorDTO });
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    // ── Re-autenticación ─────────────────────────────────────────────────
    const [requiereAuth, setRequiereAuth] = useState(false);
    const [authPassword, setAuthPassword] = useState("");
    const [authOk,       setAuthOk]       = useState(false);

    // ── Catálogos ────────────────────────────────────────────────────────
    const catalogosQuery = useCatalogos(["TIPO_IDENTIFICACION", "GRADO_ACADEMICO"]);
    const catalogos = catalogosQuery.data?.data ?? catalogosQuery.data ?? {};

    const rolesSistemaQuery = useRolesSistema();
    const rolesBD = (rolesSistemaQuery.data?.data ?? rolesSistemaQuery.data ?? []);

    // ── Queries de perfil (solo en modoPerfil) ───────────────────────────
    const perfilEmpleadoQuery     = usePerfilEmpleado(!isInvestigador);
    const perfilInvestigadorQuery = usePerfilInvestigador(isInvestigador);

    // Cargar datos en el formulario cuando llega el perfil
    useEffect(() => {
        if (!modoPerfil) return;

        if (isInvestigador) {
            const data = perfilInvestigadorQuery.data;
            if (!data) return;
            const emp = data.empleado || {};
            const usr = emp.usuario  || {};
            setEmpleado(emp);
            setUsuario({ ...usr, nombreUsuario: emp.correo });
            setInvestigador({
                id:               data.id              || null,
                institucionOrigen: data.institucionOrigen || null,
                unidadAcademica:   data.unidadAcademica   || null,
                temaInteres:       data.temaInteres        || "",
                titulos:           data.titulos            || [],
                certificaciones:   data.certificaciones    || []
            });
        } else {
            const data = perfilEmpleadoQuery.data;
            if (!data) return;
            const { usuario: usr, ...emp } = data;
            setEmpleado(emp);
            setUsuario({ ...usr, nombreUsuario: emp.correo });
        }
    }, [
        modoPerfil,
        isInvestigador,
        perfilEmpleadoQuery.data,
        perfilInvestigadorQuery.data
    ]);

    // ── Mutations ────────────────────────────────────────────────────────
    const crearEmpleado        = useCrearEmpleado();
    const actualizarEmpleado   = useActualizarEmpleado();
    const crearInvestigador    = useCrearInvestigador();
    const actualizarInvestigador = useActualizarInvestigador();

    const loading =
        crearEmpleado.isPending        ||
        actualizarEmpleado.isPending   ||
        crearInvestigador.isPending    ||
        actualizarInvestigador.isPending ||
        perfilEmpleadoQuery.isLoading  ||
        perfilInvestigadorQuery.isLoading;

    // ── Helpers de campo ─────────────────────────────────────────────────
    const actualizarCampo = (campo, valor) => {
        setEmpleado(prev => ({ ...prev, [campo]: valor }));
    };

    const actualizarCampoUsuario = (campo, valor) => {
        setUsuario(prev => ({ ...prev, [campo]: valor }));
    };

    const actualizarCampoInvestigador = (campo, valor) => {
        setInvestigador(prev => ({ ...prev, [campo]: valor }));
    };

    const actualizarItemInvestigador = (coleccion, idx, campo, valor) => {
        setInvestigador(prev => {
            const lista = [...(prev[coleccion] || [])];
            lista[idx] = { ...lista[idx], [campo]: valor };
            return { ...prev, [coleccion]: lista };
        });
    };

    const agregarItemInvestigador = (coleccion, dto) => {
        setInvestigador(prev => ({
            ...prev,
            [coleccion]: [...(prev[coleccion] || []), { ...dto }]
        }));
    };

    const eliminarItemInvestigador = (coleccion, idx) => {
        setInvestigador(prev => {
            const lista = [...(prev[coleccion] || [])];
            lista.splice(idx, 1);
            return { ...prev, [coleccion]: lista };
        });
    };

    const handleCodigoChange = (campo, valor, lista) => {
        const obj = lista.find(t => t.valor === valor);
        actualizarCampo(campo, obj);
    };

    // handleChange unificado para el formulario principal
    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "roles") {
            const currentRoles = usuario.roles || [];
            let newRoles = [...currentRoles];
            const rolSeleccionado = rolesBD.find(r => r.nombreRol === value);

            if (checked && rolSeleccionado) {
                if (currentRoles.length >= 2) { notify.error("Solo se permiten máximo 2 roles"); return; }
                newRoles.push(rolSeleccionado);
            } else {
                newRoles = newRoles.filter(r => r.nombreRol !== value);
            }

            const validacion = combinacionRolesValida(newRoles);
            if (!validacion.valida) { notify.error(validacion.mensaje); return; }
            actualizarCampoUsuario("roles", newRoles);
            return;
        }

        if (name === "contrasena") { actualizarCampoUsuario("contrasena", value); return; }
        if (name === "correo") {
            actualizarCampo("correo", value);
            actualizarCampoUsuario("nombreUsuario", value);
            return;
        }
        actualizarCampo(name, value);
    };

    // ── Re-autenticación ─────────────────────────────────────────────────
    const handleReAuth = async () => {
        if (!authPassword)
            return;
        try {
            await loginSrv(user?.username, authPassword); setAuthOk(true);
            setRequiereAuth(false); }
        catch {
            notify.error("Contraseña incorrecta");
        }
    };

    // ── Submit ───────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        const rolesSeleccionados = usuario.roles || [];
        if (rolesSeleccionados.length < 1 || rolesSeleccionados.length > 2) {
            notify.error("Debe seleccionar mínimo 1 rol y máximo 2 roles");
            return;
        }
        const validacion = combinacionRolesValida(rolesSeleccionados);
        if (!validacion.valida) { notify.error(validacion.mensaje); return; }

        const payload = buildPayloadRegistro({ empleado, usuario, investigador, isInvestigador });
        const esInv   = rolesSeleccionados.some(r => r.nombreRol === "INVESTIGADOR");

        // PERFIL
        if (modoPerfil) {
            if (!(await confirm.update())) return;

            const mutation = esInv ? actualizarInvestigador : actualizarEmpleado;

            mutation.mutate(payload, {
                onSuccess: async () => {

                    const nuevoCorreo  = payload.empleado?.correo ?? payload.correo;

                    const correoActual = user?.username;

                    if (nuevoCorreo && nuevoCorreo !== correoActual) {

                        try {
                            console.log(nuevoCorreo)
                            console.log(authPassword)
                            const data = await loginSrv(nuevoCorreo, authPassword);
                            console.log(data);
                            login(data.user, data.token);

                        } catch {
                            notify.warning("Perfil actualizado. Vuelve a iniciar sesión con tu nuevo correo.");

                        }

                    } else {

                        notify.success("Perfil actualizado correctamente");

                    }

                    setAuthOk(false);

                    setAuthPassword("");

                },
                onError: (err) => {
                    notify.error(err?.response?.data?.message || "Error al actualizar perfil");
                }
            });
            return;
        }

        // REGISTRO
        const mutation = esInv ? crearInvestigador : crearEmpleado;
        mutation.mutate(payload, {
            onSuccess: () => {
                notify.success("Registro exitoso");
                setEmpleado({ ...EmpleadoDTO });
                setUsuario({ ...UsuarioDTO });
                setInvestigador({ ...InvestigadorDTO });
                setConfirmarContrasena("");
            },
            onError: (err) => {
                notify.error(err?.response?.data?.message || "Error en el registro");
            }
        });
    };

    const handleIdentificacionChange = (e, authOkFlag, setRequiereAuthFn) => {
        if (modoPerfil && !authOkFlag) { setRequiereAuthFn(true); return; }
        const tipoId = (empleado.tipoId?.valor || "").toUpperCase();
        let value = e.target.value;
        if (tipoId === "NACIONAL" || tipoId === "DIMEX") value = value.replace(/\D/g, "");
        const maxLen = tipoId === "NACIONAL" ? 10 : tipoId === "DIMEX" ? 15 : tipoId === "PASAPORTE" ? 20 : 9;
        if (value.length <= maxLen) actualizarCampo("identificacion", value);
    };

    const handleCorreoChange = (e, authOkFlag, setRequiereAuthFn) => {
        if (modoPerfil && !authOkFlag) { setRequiereAuthFn(true); return; }
        actualizarCampo("correo", e.target.value);
        actualizarCampoUsuario("nombreUsuario", e.target.value);
    };

    const handleTelefonoChange = (value) => {
        if (!value) return actualizarCampo("numeroTelefono", value);
        const numeros = value.replace(/\D/g, "");
        const local   = numeros.startsWith("506") ? numeros.slice(3) : numeros;
        if (local.length <= 8) actualizarCampo("numeroTelefono", value);
    };

    const rolDeshabilitado = (rol) => {
        if (modoPerfil) return true;
        const rolesActuales = usuario?.roles || [];
        const yaSeleccionado = rolesActuales.some(r => r.nombreRol === rol.nombreRol);
        if (yaSeleccionado) return false;
        return (
            rolesActuales.length >= 2 ||
            !combinacionRolesValida([...rolesActuales, rol]).valida
        );
    };

    return {
        // Estado formulario
        empleado,
        usuario,
        investigador,
        confirmarContrasena,
        setConfirmarContrasena,

        // Catálogos
        tipos: catalogos,
        rolesBD,

        // Estado UI
        loading,
        authOk,
        requiereAuth,
        authPassword,
        setRequiereAuth,
        setAuthPassword,

        // Helpers
        handleChange,
        handleCodigoChange,
        actualizarCampo,
        actualizarCampoUsuario,
        actualizarCampoInvestigador,
        actualizarItemInvestigador,
        agregarItemInvestigador,
        eliminarItemInvestigador,

        handleIdentificacionChange,
        handleCorreoChange,
        handleTelefonoChange,
        rolDeshabilitado,

        // Submit y re-auth
        handleSubmit,
        handleReAuth
    };
};