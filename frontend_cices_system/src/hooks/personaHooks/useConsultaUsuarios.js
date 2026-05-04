// src/modules/persona/hooks/useConsultaUsuarios.js
import { useState, useEffect } from "react";
import { useUsuarios } from "./queries/useUsuarios.js";
import { useRolesSistema } from "../referenceDataHooks/useRolesSistema.js";
import { useCambiarEstadoUsuario } from "../usuarioHooks/useCambiarEstadoUsuario.js";
import { useDebounce } from "../useDebounce.js";
import { confirm } from "../../utils/ui/confirm.jsx";
import { notify } from "../../utils/ui/notify.jsx";

const FILTRO_INICIAL = {
    nombre: "",
    roles: [],
    gradosAcademicos: [],
    activo: null          // null = todos, true = activos, false = inactivos
};

const PAGEABLE_INICIAL = { page: 0, size: 10 };

export const useConsultaUsuarios = () => {

    const [filtro, setFiltro] = useState(FILTRO_INICIAL);
    const [pageable, setPageable] = useState(PAGEABLE_INICIAL);

    const nombreDebounced = useDebounce(filtro.nombre, 350);

    // Todo el filtrado va al backend — incluyendo activo
    const filtroEfectivo = {
        nombre:           nombreDebounced,
        roles:            filtro.roles,
        gradosAcademicos: filtro.gradosAcademicos,
        // Solo enviamos el param si no es null (undefined se omite en axios params)
        ...(filtro.activo !== null && { activo: filtro.activo })
    };

    useEffect(() => {
        setPageable(prev => ({ ...prev, page: 0 }));
    }, [nombreDebounced, filtro.roles, filtro.activo]);

    const queryUsuarios = useUsuarios(filtroEfectivo, pageable);
    const paginaData    = queryUsuarios.data?.data ?? queryUsuarios.data ?? {};

    const usuarios      = paginaData.content       || [];
    const totalElements = paginaData.totalElements || 0;
    const totalPages    = paginaData.totalPages    || 0;

    // Roles para select
    const rolesSistemaQuery = useRolesSistema();
    const opcionesRoles = (rolesSistemaQuery.data?.data ?? rolesSistemaQuery.data ?? []).map(r => ({
        value: r.nombreRol ?? r,
        label: r.nombreRol ?? r
    }));

    // Mutation cambiar estado
    const { mutate: cambiarEstadoMutate } = useCambiarEstadoUsuario();

    const cambiarEstado = async (id, estadoActual) => {
        const accion = estadoActual ? "desactivar" : "activar";
        const confirmar = await confirm.action({
            title: `¿Desea ${accion} este usuario?`,
            message: ""
        });
        if (!confirmar) return;

        cambiarEstadoMutate(
            { id, activo: !estadoActual },
            {
                onSuccess: () => notify.success(`Usuario ${accion === "activar" ? "activado" : "desactivado"} correctamente.`),
                onError:   () => notify.error("Error al cambiar el estado del usuario.")
            }
        );
    };

    const cambiarFiltro = (campo, valor) => {
        setFiltro(prev => ({ ...prev, [campo]: valor }));
    };

    const limpiarFiltros = () => {
        setFiltro(FILTRO_INICIAL);
        setPageable(PAGEABLE_INICIAL);
    };

    const cambiarPagina = (page) => {
        setPageable(prev => ({ ...prev, page }));
    };

    return {
        usuarios,
        totalElements,
        totalPages,
        isLoading: queryUsuarios.isLoading,
        isError:   queryUsuarios.isError,

        filtro,
        cambiarFiltro,
        limpiarFiltros,

        pageable,
        cambiarPagina,

        opcionesRoles,
        cambiarEstado
    };
};