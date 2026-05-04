// modules/proyecto/hooks/queries/useProyectosResumen.js
import { useQuery } from "@tanstack/react-query";
import { buscarProyectosResumen } from "../../../services/proyectoServices/proyectoConsultaService.js";

/**
 * Query ligera para el buscador — solo codigo, nombre, fechas.
 * Usa buscarProyectosResumen en lugar de obtenerProyectos (que carga filtros completos).
 */
export const useProyectosResumen = (texto, pageable, options = {}) => {
    return useQuery({
        queryKey: ["proyectos-resumen", texto, pageable],
        queryFn:  () => buscarProyectosResumen(texto, pageable),
        keepPreviousData: true,
        ...options,
    });
};