const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function registrarProyecto({ proyecto, token }) {
    console.log(proyecto)
    const res = await fetch(`${API}/api/proyectos/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(proyecto)
    });

    // backend returns an integer id in the controller example; try to parse JSON safely
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw data;
    }

    return data;
}

export async function cargarProyectos(token, ) {
    const res = await fetch(`${API}/api/proyectos/codigo-nombre-fechas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error cargando proyectos");
    return await res.json();
}

export const obtenerProyectos = async (todos, id) => {
    let url = `${API}/api/proyectos`;
    if(!todos)
        url += `-investigador?id=${encodeURIComponent(id)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error obteniendo proyectos");
    return await res.json();
};

export const obtenerLineas = async () => {
    const res = await fetch(`${API}/api/proyectos/lineas-investigacion`);
    if (!res.ok) throw new Error("Error obteniendo lineas de investigación");
    return await res.json();
};

