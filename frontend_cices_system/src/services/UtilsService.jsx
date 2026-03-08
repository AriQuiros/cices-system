const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getResumen(token) {
    const res = await fetch(`${API}/api/reports/resumen`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Error al obtener resumen");
    }

    const json = await res.json();
    return json[0] || {}; // la vista devuelve lista
}