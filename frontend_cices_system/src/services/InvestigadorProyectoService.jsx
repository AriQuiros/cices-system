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

        if (!res.ok) {
            const errorBody = await res.json();
            throw new Error(errorBody.message || "Error eliminando investigador");
        }

        return await res.json();
    }

    ,
    async obtenerPorId(id, token) {
        const res = await fetch(`${API}/investigador-proyecto/obtener/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Error al obtener investigador");
        }

        return await res.json();
    }

};