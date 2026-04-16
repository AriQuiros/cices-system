import axios from "axios";

const API_URL = "http://localhost:8080/api/reportes/investigadores-participantes";

export const exportarReporteInvestigadoresParticipantes = async (
    token,
    filtros,
    formato,
    orden
) => {
    const params = {
        codigoProyecto: filtros?.codigoProyecto || null,
        nombreProyecto: filtros?.nombreProyecto || null,

        idTipoProyecto:
            filtros?.idTipoProyecto ||
            filtros?.tipoProyecto ||
            filtros?.tipo ||
            null,

        idEstadoProyecto:
            filtros?.idEstadoProyecto ||
            filtros?.estadoProyecto ||
            filtros?.estado ||
            null,

        lineaInvestigacion:
            filtros?.lineaInvestigacion ||
            filtros?.linea ||
            filtros?.idLineaInvestigacion ||
            null,

        formato: formato || "pdf",
        orden: orden ? JSON.stringify(orden) : null
    };

    const response = await axios.get(`${API_URL}/exportar`, {
        params,
        responseType: "blob",
        headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
    });

    const extension = formato || "pdf";
    const contentType = response.headers["content-type"] || obtenerContentType(extension);

    const blob = new Blob([response.data], {
        type: contentType
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `reporte_investigadores_participantes.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 1000);

    return true;
};

const obtenerContentType = (formato) => {
    if (formato === "pdf") return "application/pdf";

    if (formato === "xlsx") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    if (formato === "docx") {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return "application/octet-stream";
};