const API_URL = "http://localhost:8080/api";

export const BitacoraService = {

    obtenerPorGasto: async (gastoId, token) => {
        try {

            const res = await fetch(`${API_URL}/gasto-bit/gasto/${gastoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Error al obtener bitácora");
            }

            return await res.json();

        } catch (error) {
            console.error("BitacoraService.obtenerPorGasto:", error);
            throw error;
        }
    },

    obtenerPorPresupuesto: async (presupuestoId, token) => {
        try {

            const res = await fetch(`${API_URL}/presupuesto/${presupuestoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Error al obtener bitácora");
            }

            return await res.json();

        } catch (error) {
            console.error("BitacoraService.obtenerPorPresupuesto:", error);
            throw error;
        }
    }

};