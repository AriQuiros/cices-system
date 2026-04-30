// src/modules/persona/hooks/useConsultaPersonas.js
import { useState, useEffect } from "react";
import { useEmpleados } from "./queries/useEmpleados.js";
import { useInvestigadoresConsulta } from "./queries/useInvestigadores.js";
import { useCatalogos } from "../../referenceData/hooks/useCatalogos.js";
import { useRolesSistema } from "../../referenceData/hooks/useRolesSistema.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

const FILTRO_INICIAL = {
    nombre: "",
    roles: [],
    gradosAcademicos: []
};

const PAGEABLE_INICIAL = { page: 0, size: 10 };

export const useConsultaPersonas = (modo = "empleados") => {

    const [filtro, setFiltro] = useState(FILTRO_INICIAL);
    const [pageable, setPageable] = useState(PAGEABLE_INICIAL);

    const nombreDebounced = useDebounce(filtro.nombre, 350);

    const filtroEfectivo = {
        nombre: nombreDebounced,
        roles: modo === "investigadores" ? ["INVESTIGADOR"] : filtro.roles,
        gradosAcademicos: filtro.gradosAcademicos
    };

    // Reset página al cambiar filtros
    useEffect(() => {
        setPageable(prev => ({ ...prev, page: 0 }));
    }, [nombreDebounced, filtro.roles, filtro.gradosAcademicos]);

    // Queries — solo activa la del modo actual
    const queryEmpleados = useEmpleados(
        filtroEfectivo, pageable
    );

    const queryInvestigadores = useInvestigadoresConsulta(
        filtroEfectivo, pageable
    );

    const queryActiva = modo === "investigadores" ? queryInvestigadores : queryEmpleados;
    const paginaData  = queryActiva.data?.data ?? queryActiva.data ?? {};

    const personas      = paginaData.content       || [];
    const totalElements = paginaData.totalElements || 0;
    const totalPages    = paginaData.totalPages    || 0;

    // Selects
    const { data: catalogosRaw } = useCatalogos(["GRADO_ACADEMICO"]);
    const catalogos = catalogosRaw?.data ?? catalogosRaw ?? {};

    const opcionesGrados = (catalogos["GRADO_ACADEMICO"] || []).map(g => ({
        value: g.despliegue ?? g,
        label: g.despliegue ?? g
    }));

    const rolesSistemaQuery = useRolesSistema();
    const opcionesRoles = (rolesSistemaQuery.data?.data ?? rolesSistemaQuery.data ?? []).map(r => ({
        value: r.nombreRol ?? r,
        label: r.nombreRol ?? r
    }));

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
        personas,
        totalElements,
        totalPages,
        isLoading: queryActiva.isLoading,
        isError:   queryActiva.isError,

        filtro,
        cambiarFiltro,
        limpiarFiltros,

        pageable,
        cambiarPagina,

        opcionesGrados,
        opcionesRoles
    };
};