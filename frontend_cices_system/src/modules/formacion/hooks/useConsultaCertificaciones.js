// src/modules/formacion/hooks/useConsultaCertificaciones.js
import { useState, useEffect, useMemo } from "react";
import { useCertificaciones } from "./queries/useCertificaciones.js";
import { useMisCertificaciones } from "./queries/useMisCertificaciones.js";
import { useCatalogos } from "../../referenceData/hooks/useCatalogos.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

const FILTRO_INICIAL = {
    investigador: "",
    nombreCertificacion: "",
    tipos: [],
    estados: [],
    ordenFecha: "desc"
};

const PAGEABLE_INICIAL = { page: 0, size: 10 };

// Mapeo de estados a colores suaves
export const COLORES_ESTADO = {
    "VIGENTE":            { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "PROXIMA A VENCER":   { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "VENCIDA":            { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" }
};

export const colorPorEstado = (estado = "") => {
    const key = estado.toUpperCase().trim();
    return COLORES_ESTADO[key] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
};

export const useConsultaCertificaciones = (modo = "todas") => {

    const [filtro, setFiltro] = useState(FILTRO_INICIAL);
    const [pageable, setPageable] = useState(PAGEABLE_INICIAL);

    // Debounce solo sobre campos de texto
    const investigadorDebounced    = useDebounce(filtro.investigador, 350);
    const nombreCertDebounced      = useDebounce(filtro.nombreCertificacion, 350);

    // Filtro efectivo que va al backend (con debounce aplicado)
    const filtroEfectivo = {
        investigador:        investigadorDebounced,
        nombreCertificacion: nombreCertDebounced,
        tipos:               filtro.tipos,
        estados:             filtro.estados,
        ordenFecha:          filtro.ordenFecha
    };

    // Resetear página cuando cambia cualquier filtro
    useEffect(() => {
        setPageable(prev => ({ ...prev, page: 0 }));
    }, [
        investigadorDebounced,
        nombreCertDebounced,
        filtro.tipos,
        filtro.estados,
        filtro.ordenFecha
    ]);

    // ── Queries ─────────────────────────────────────────────────────────
    const queryTodas = useCertificaciones(filtroEfectivo, pageable);
    const queryMis   = useMisCertificaciones(filtroEfectivo, pageable);

    const queryActiva = modo === "mis" ? queryMis : queryTodas;
    const paginaData  = queryActiva.data?.data ?? queryActiva.data ?? {};

    const certificaciones = paginaData.content  || [];
    const totalElements   = paginaData.totalElements || 0;
    const totalPages      = paginaData.totalPages    || 0;

    // ── Catálogos para los selects ───────────────────────────────────────
    const { data: catalogosRaw } = useCatalogos(["TIPO_CERTIFICACION", "ESTADO_CERTIFICACION"]);
    const catalogos = catalogosRaw?.data ?? catalogosRaw ?? {};

    const opcionesTipos = (catalogos["TIPO_CERTIFICACION"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesEstados = (catalogos["ESTADO_CERTIFICACION"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    // ── Resumen por estado (sobre los datos de la página actual) ─────────
    const resumenEstados = useMemo(() => {
        return certificaciones.reduce((acc, cert) => {
            const estado = cert.estado || "SIN ESTADO";
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});
    }, [certificaciones]);

    // ── Agrupamiento opcional ────────────────────────────────────────────
    const agruparPorInvestigador = (lista, orden = "desc") => {
        const grouped = lista.reduce((acc, cert) => {
            const key = cert.identificacionInvestigador || "SIN_ID";
            if (!acc[key]) {
                acc[key] = {
                    identificacion: key,
                    nombre: cert.nombreInvestigador,
                    certificaciones: []
                };
            }
            acc[key].certificaciones.push(cert);
            return acc;
        }, {});

        Object.values(grouped).forEach(g => {
            g.certificaciones.sort((a, b) => {
                const fA = new Date(a.fecha), fB = new Date(b.fecha);
                return orden === "desc" ? fB - fA : fA - fB;
            });
        });

        return Object.values(grouped);
    };

    // ── Acciones ────────────────────────────────────────────────────────
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
        // Datos
        certificaciones,
        totalElements,
        totalPages,
        isLoading: queryActiva.isLoading,
        isError:   queryActiva.isError,

        // Filtros
        filtro,
        cambiarFiltro,
        limpiarFiltros,

        // Paginación
        pageable,
        cambiarPagina,

        // Selects
        opcionesTipos,
        opcionesEstados,

        // Resumen
        resumenEstados,

        // Utilidades
        agruparPorInvestigador
    };
};