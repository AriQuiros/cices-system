// PresupuestoService.jsx
// Servicio para manejar las operaciones relacionadas con presupuestos de proyectos

export async function obtenerPresupuestosProyecto(token, codigoProyecto) {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const res = await fetch(`${API}/api/presupuestos/${codigoProyecto}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error cargando presupuestos");
    return await res.json();
}

export async function registrarPresupuestos(token, proyecto) {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const formData = new FormData();
    formData.append("idProyecto", proyecto.codigoProyecto);
    formData.append(
        "presupuestos",
        new Blob([JSON.stringify(proyecto.presupuestos)], { type: "application/json" })
    );

    const res = await fetch(`${API}/api/presupuestos/registrar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    if (!res.ok) throw new Error("Error registrando presupuestos");
    return await res.json();
}