// src/modules/proyecto/hooks/useListadoProyectos.js
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useProyectos } from "./queries/useProyectos.js";
import { useListarInvestigadorProyecto } from "../investigadorProyectoHooks/queries/useListarInvestigadorProyecto.js";
import { useLineasInvestigacion } from "./queries/useLineasInvestigacion.js";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";
import { useRolesProyecto } from "../referenceDataHooks/useRolesProyecto.js";

const FILTRO_PROYECTO_INICIAL = {
    texto: "",
    estado: "",
    tipos: [],
    lineas: [],
    ordenFecha: "desc"
};

const FILTRO_INV_INICIAL = {
    rol: "",
    desde: null,
    hasta: null
};

const PAGEABLE_INICIAL = { page: 0, size: 8 };

export const useListadoProyectos = () => {
    const { user } = useContext(AppContext);

    // ── Detección de roles ──────────────────────────────────────────────
    const roles = user?.roles || [];
    const esInvestigador = roles.includes("INVESTIGADOR");
    const tieneRolAdmin = roles.some(r =>
        ["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"].includes(r)
    );
    // Usuario con doble rol: puede cambiar de vista
    const puedeAlternar = esInvestigador && tieneRolAdmin;

    // Vista activa: "todos" (rol admin) | "mis" (rol investigador)
    // Si solo es investigador arranca en "mis", si solo es admin arranca en "todos"
    const [vistaActiva, setVistaActiva] = useState(
        puedeAlternar ? "todos" : "mis"
    );

    // ── Filtros y paginación ────────────────────────────────────────────
    const [filtroProyecto, setFiltroProyecto] = useState(FILTRO_PROYECTO_INICIAL);
    const [filtroInv, setFiltroInv] = useState(FILTRO_INV_INICIAL);
    const [pageable, setPageable] = useState(PAGEABLE_INICIAL);

    // Resetear página al cambiar filtros o vista
    useEffect(() => {
        setPageable(prev => ({ ...prev, page: 0 }));
    }, [filtroProyecto, filtroInv, vistaActiva]);

    const cambiarFiltroProyecto = (campo, valor) => {
        setFiltroProyecto(prev => ({ ...prev, [campo]: valor }));
    };

    const cambiarFiltroInv = (campo, valor) => {
        setFiltroInv(prev => ({ ...prev, [campo]: valor }));
    };

    const limpiarFiltros = () => {
        setFiltroProyecto(FILTRO_PROYECTO_INICIAL);
        setFiltroInv(FILTRO_INV_INICIAL);
        setPageable(PAGEABLE_INICIAL);
    };

    const cambiarPagina = (page) => {
        setPageable(prev => ({ ...prev, page }));
    };

    // ── Queries de datos ────────────────────────────────────────────────

    // Vista "todos" — roles DIRECCION/ADMINISTRATIVO/ASISTENTE
    const queryTodos = useProyectos(
        filtroProyecto,
        pageable,
    );

    // Vista "mis proyectos" — rol INVESTIGADOR
    // filtroInv no tiene idInvestigador porque el backend lo saca del JWT
    const queryMis = useListarInvestigadorProyecto(
        filtroProyecto,
        filtroInv,
        pageable
    );

    // ── Selects / catálogos ─────────────────────────────────────────────
    const catalogosQuery = useCatalogos(["TIPO_PROYECTO", "ESTADO_PROYECTO"]);
    const catalogos = catalogosQuery.data?.data || catalogosQuery.data || {};

    const lineasQuery = useLineasInvestigacion();
    const rolesProyectoQuery = useRolesProyecto();

    const opcionesTipos = (catalogos["TIPO_PROYECTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesEstado = (catalogos["ESTADO_PROYECTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesLineas = (lineasQuery.data || []).map(l => ({
        value: l ?? l.nombre,
        label: l ?? l.nombre
    }));

    const opcionesRolesProyecto = (rolesProyectoQuery.data || []).map(r => ({
        value: r.nombreRolProyecto ?? r,
        label: r.nombreRolProyecto ?? r
    }));

    // ── Datos activos según vista ───────────────────────────────────────
    const queryActiva = vistaActiva === "todos" ? queryTodos : queryMis;
    const paginaData = queryActiva.data;

    // ProyectoInvestigadorDTO tiene { proyectoDatosDTO, rolProyecto, fechaInicioInvestigador, fechaFinInvestigador }
    // ProyectoDatosDTO tiene los campos directamente
    // Normalizamos para que la tarjeta siempre reciba el mismo shape
    const proyectos = (paginaData?.content || []).map(item => {
        if (vistaActiva === "mis" && item.proyectoDatosDTO) {
            return {
                ...item.proyectoDatosDTO,
                rolProyecto: item.rolProyecto,
                fechaInicioInvestigador: item.fechaInicioInvestigador,
                fechaFinInvestigador: item.fechaFinInvestigador
            };
        }
        return item; // ProyectoDatosDTO directo
    });

    return {
        // Auth
        esInvestigador,
        tieneRolAdmin,
        puedeAlternar,
        vistaActiva,
        setVistaActiva,

        // Datos
        proyectos,
        totalElements: paginaData?.totalElements || 0,
        totalPages: paginaData?.totalPages || 0,
        isLoading: queryActiva.isLoading,
        isError: queryActiva.isError,

        // Filtros
        filtroProyecto,
        filtroInv,
        cambiarFiltroProyecto,
        cambiarFiltroInv,
        limpiarFiltros,

        // Paginación
        pageable,
        cambiarPagina,

        // Opciones de selects
        opcionesTipos,
        opcionesEstado,
        opcionesLineas,
        opcionesRolesProyecto
    };
};