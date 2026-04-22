import { useState, useEffect, useContext } from "react";

import { EmpleadoContext } from "../../context/empleadoCtx/EmpleadoContext.jsx";
import { InvestigadorContext } from "../../context/investigadorCtx/InvestigadorContext.jsx";

import { fetchTiposCatalogo } from "../../services/CatalogoService.js";
import { registerEmpleado } from "../../Services/EmpleadoService.jsx";

import { notify } from "../../utils/ui/notify.jsx";
import { confirm } from "../../utils/ui/confirm.jsx";

import { combinacionRolesValida } from "../../utils/registro/rolesUtils";

import { usePerfil } from "./usePerfil.js";

export const useRegistro = ({ modoPerfil }) => {

    const {
        empleado,
        actualizarCampo,
        setEmpleado,
        usuario,
        actualizarCampoUsuario,
        limpiarEmpleado,
        limpiarUsuario,
        setUsuario
    } = useContext(EmpleadoContext);

    const {
        investigador,
        setInvestigador,
        limpiarInvestigador
    } = useContext(InvestigadorContext);

    const [tipos, setTipos] = useState([]);
    const [rolesBD, setRolesBD] = useState([]);

    // 🔹 perfil hook (lo mantenemos aquí porque es parte del flujo)
    const { loading, actualizarPerfil } = usePerfil({
        modoPerfil,
        setEmpleado,
        setUsuario,
        setInvestigador
    });

    // 🔹 carga inicial
    useEffect(() => {

        (async () => {

            try {
                const res = await fetchTiposCatalogo("", [
                    "TIPO_IDENTIFICACION",
                    "GRADO_ACADEMICO"
                ]);
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

    const handleCodigoChange = (campo, valor, lista) => {
        const obj = lista.find(t => t.valor === valor);
        actualizarCampo(campo, obj);
    };

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
            return;
        }

        if (name === "correo") {
            actualizarCampo("correo", value);
            actualizarCampoUsuario("nombreUsuario", value);
            return;
        }

        actualizarCampo(name, value);
    };

    // 🔹 submit centralizado
    const handleSubmit = async (payload, authPassword)  => {

        const rolesSeleccionados = usuario.roles || [];

        // validaciones
        if (rolesSeleccionados.length < 1 || rolesSeleccionados.length > 2) {
            notify.error("Debe seleccionar mínimo 1 rol y máximo 2 roles");
            return;
        }

        const validacionRoles = combinacionRolesValida(rolesSeleccionados);

        if (!validacionRoles.valida) {
            notify.error(validacionRoles.mensaje);
            return;
        }

        // 🔸 MODO PERFIL
        if (modoPerfil) {

            if (!(await confirm.update())) return;

            await actualizarPerfil(payload, authPassword);

            return;
        }

        // 🔸 REGISTRO NORMAL
        try {

            const result = await registerEmpleado(payload, rolesSeleccionados);

            if (result.ok) {

                notify.success("Registro exitoso");

                limpiarEmpleado();
                limpiarUsuario();

                limpiarInvestigador();

            } else {

                notify.error(result.message || "Registro falló");

            }

        } catch {

            notify.error("Error de conexión");

        }
    };

    return {
        // estados
        empleado,
        usuario,
        investigador,
        tipos,
        rolesBD,
        loading,

        // setters / actions
        handleChange,
        handleCodigoChange,
        actualizarCampo,
        actualizarCampoUsuario,
        setEmpleado,
        setUsuario,
        setInvestigador,

        // submit
        handleSubmit
    };
};