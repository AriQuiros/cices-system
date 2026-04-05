const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const GastosService = {
    async registrarGastos(gastos) {
        const res = await fetch(`${API}/gastos/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gastos)
        });

        if (!res.ok) throw new Error("Error al registrar gasto");
        return await res.json();
    },

    async actualizarGasto(gasto, token) {
        const res = await fetch(`${API}/gastos/actualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(gasto)
        });

        if (!res.ok) throw new Error("Error al actualizar gasto");
        return await res.json();
    },

    async eliminarGasto(id, token) {
        const res = await fetch(`${API}/gastos/eliminar/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Error al eliminar gasto");
        return await res.json();
    }
};