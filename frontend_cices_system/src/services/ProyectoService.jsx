const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const esSoloInvestigador = (user) => {
    if (!user?.roles || user.roles.length === 0) return false;
    return user.roles.length === 1 && user.roles[0] === "INVESTIGADOR";
};

export async function registrarProyecto(proyecto, token) {
    const res = await fetch(`${API}/api/proyectos/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(proyecto)
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
    let url = esSoloInvestigador(user)
        ? `${API}/api/reports/proyectos/investigador`
        : `${API}/api/reports/proyectos/codigo-nombre-fechas`;

    if(principal) url = url + "/principal"

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error cargando proyectos");
    return await res.json();
}

export async function obtenerProyectos(token, user) {
    const url = esSoloInvestigador(user)
        ? `${API}/api/reports/proyectos/investigador/list`
        : `${API}/api/reports/proyectos/list`;

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