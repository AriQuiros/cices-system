const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const esSoloInvestigador = (user) => {
    if (!user?.roles || user.roles.length === 0) return false;
    return user.roles.length === 1 && user.roles[0] === "INVESTIGADOR";
};

export async function registrarProyecto(proyecto, token) {
    const formData = new FormData();

    (proyecto.documentos || []).forEach(file => {
        formData.append("documentos", file);
    });

    delete proyecto.documentos;

    // Creamos un Blob de tipo JSON para que Spring lo interprete correctamente
    const proyectoBlob = new Blob([JSON.stringify(proyecto)], { type: "application/json" });
    formData.append("proyecto", proyectoBlob);

    const res = await fetch(`${API}/api/proyectos/registro`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}` // NO poner Content-Type
        },
        body: formData
    });

    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) throw data;
    return data;
}

export async function cargarProyectos(token, user, principal) {
    const esInvestidor = esSoloInvestigador(user)
    let url = esInvestidor
        ? `${API}/api/reports/proyectos/investigador`
        : `${API}/api/reports/proyectos/codigo-nombre-fechas`;

    if(esInvestidor && principal) url = url + "/principal"

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error cargando proyectos");
    return await res.json();
}

export async function obtenerProyectos(token, user, filtros, page = 0, size = 8, orden) {

    const params = new URLSearchParams();

    // filtros
    if (filtros.texto) params.append("texto", filtros.texto);
    if (filtros.estado) params.append("estado", filtros.estado);

    filtros.tipoProyecto?.forEach(t => params.append("tipoProyecto", t));
    filtros.lineaInvestigacion?.forEach(l => params.append("lineaInvestigacion", l));

    // paginación
    params.append("page", page);
    params.append("size", size);

    // orden
    if (orden) {
        params.append("sort", `${orden.campo},${orden.asc ? "asc" : "desc"}`);
    }

    const url = esSoloInvestigador(user)
        ? `${API}/api/investigadores/proyectos?${params}`
        : `${API}/api/proyectos/listar?${params}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error obteniendo proyectos");

    return await res.json();
}

export async function obtenerLineas(token) {
    const res = await fetch(`${API}/api/proyectos/lineas-investigacion`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error obteniendo lineas de investigación");
    return await res.json();
}
export async function exportarReporteProyectos(token, filtros, formato) {

    const res = await fetch(
        `${API}/api/reports/proyectos/exportar?formato=${formato}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(filtros)
        }
    );

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error exportando reporte");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", `reporte_proyectos.${formato}`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}