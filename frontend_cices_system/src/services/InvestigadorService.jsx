const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function obtenerInvestigadoresActivos(token, nombre = "") {
    const url = `${API}/investigadores?nombre=${encodeURIComponent(nombre)}`;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
        }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al obtener investigadores activos");
    }
    return await res.json();
}
