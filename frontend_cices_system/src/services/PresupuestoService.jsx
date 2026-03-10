// PresupuestoService.jsx
// Servicio para manejar las operaciones relacionadas con presupuestos de proyectos

export async function obtenerPresupuestosProyecto(token, codigoProyecto) {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    const res = await fetch(`${API}/presupuestos/${codigoProyecto}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error cargando presupuestos");
    return await res.json();
}

export async function registrarPresupuestos(token, proyecto) {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const res = await fetch(`${API}/api/presupuestos/${proyecto.codigoProyecto}/registrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(proyecto.presupuestos)
    });

    if (!res.ok) throw new Error("Error registrando presupuestos");

    return await res.json();
}