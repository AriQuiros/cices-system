const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const HorasService = {
    async registrarHoras(horas) {
        const res = await fetch(`${API}/horas/registro`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(horas)
        });
        if (!res.ok) throw new Error("Error al registrar horas");
        return await res.json();
    },

    async actualizarHora(hora) {
        const res = await fetch(`${API}/horas/actualizar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hora)
        });

        if (!res.ok) throw new Error("Error al actualizar hora");
        return await res.json();
    },

    async eliminarHora(id) {
        const res = await fetch(`${API}/horas/eliminar/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Error eliminando");
        }

    }
};