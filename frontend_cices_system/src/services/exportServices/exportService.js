import {
    exportarCertificaciones,
    exportarProyectos,
    exportarParticipantes,
    exportarPresupuestos
} from "../../api/exportApi/exportApi.js";

/* =========================
   helper descarga
========================= */
export const descargarArchivo = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};

export const exportarCertificacionesSrv = async (filtro, formato) => {
    const res = await exportarCertificaciones(filtro, formato);
    return res.data;
};

export const exportarProyectosSrv = async (filtro, formato) => {
    const res = await exportarProyectos(filtro, formato);
    return res.data;
};

export const exportarParticipantesSrv = async (filtro, formato) => {
    const res = await exportarParticipantes(filtro, formato);
    return res.data;
};

export const exportarPresupuestosSrv = async (filtro, formato) => {
    const res = await exportarPresupuestos(filtro, formato);
    return res.data;
};