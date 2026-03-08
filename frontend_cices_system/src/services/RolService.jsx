const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function obtenerRolesProyecto(token) {
    const res = await fetch(`${API}/rol-proyecto/roles`, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al obtener roles de proyecto");
    }

    return await res.json(); // expected: [{id, nombre}, ...]
}
