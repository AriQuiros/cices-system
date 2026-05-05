import { useMutation } from "@tanstack/react-query";
import {
    exportarCertificacionesSrv,
    exportarParticipantesSrv,
    exportarPresupuestosSrv,
    exportarProyectosSrv
} from "../../../services/exportServices/exportService.js";

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

export const useExportarParticipantes = () => {
    return useMutation({
        mutationFn: ({ filtro, formato }) =>
            exportarParticipantesSrv(filtro, formato)
    });
};

export const useExportarPresupuestos = () => {
    return useMutation({
        mutationFn: ({ filtro, formato }) =>
            exportarPresupuestosSrv(filtro, formato)
    });
};