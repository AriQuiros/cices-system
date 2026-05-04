import { useMutation } from "@tanstack/react-query";
import {
    exportarCertificacionesSrv,
    exportarProyectosSrv
} from "../../services/exportServices/exportService.js";

export const useExportarCertificaciones = () => {
    return useMutation({
        mutationFn: ({ filtro, formato }) =>
            exportarCertificacionesSrv(filtro, formato)
    });
};

export const useExportarProyectos = () => {
    return useMutation({
        mutationFn: ({ filtro, formato }) =>
            exportarProyectosSrv(filtro, formato)
    });
};