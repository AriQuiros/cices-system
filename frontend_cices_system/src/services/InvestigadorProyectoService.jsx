const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const InvestigadorProyectoService = {
    async guardarInvestigadoresProyecto(investigadores) {

        const response = await fetch(
            `${API}/investigador-proyecto/registro`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer `
                },
                body: JSON.stringify(investigadores)
            }
        );

        if (!response.ok) {
            throw new Error("Error guardando investigadores");
        }

        return await response.json();
    },
    async actualizarInvestigador(investigador) {

        const response = await fetch(
            `${API}/investigador-proyecto/actualizar`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer `
                },
                body: JSON.stringify(investigador)
            }
        );

        if (!response.ok) {
            throw new Error("Error actualizando investigador");
        }

        return await response.json();
    },
    async eliminarInvestigador(id) {
        const res = await fetch(`${API}/investigador-proyecto/eliminar/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Error al eliminar investigador de proyecto");
        return await res.json();
    }

};