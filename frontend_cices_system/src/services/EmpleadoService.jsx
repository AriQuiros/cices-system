const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function registerEmpleado(empleado, esInvestigador) {
    const controller = esInvestigador? "investigadores":"empleados";

    try {
        const res = await fetch(`${API}/${controller}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(empleado)
        });
        if (!res.ok) {
            const text = await res.text();
            return { ok: false, status: res.status, message: text };
        }
        const data = await res.json();
        return { ok: true, data };
    } catch (err) {
        return { ok: false, status: 0, message: String(err) };
    }
}
