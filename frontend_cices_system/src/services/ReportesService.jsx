const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/consulta";

export const DistribucionHoras = {

    async obtenerPorProyecto(codigoProyecto) {
        const response = await fetch(`${API_URL}/presupuesto-horas/${codigoProyecto}`);

        if (!response.ok) {
            throw new Error("Error al obtener presupuestos de horas");
        }

        return await response.json();
    },

    async obtenerTodos() {
        const response = await fetch(`${API_URL}/presupuesto-horas`);

        if (!response.ok) {
            throw new Error("Error al obtener presupuestos de horas");
        }

        return await response.json();
    }

};

export const DetalleGastos = {

    async obtenerPorProyecto(tipo, codigoProyecto) {
        const response = await fetch(`${API_URL}/presupuestos/busqueda/${codigoProyecto}?tipo=${tipo}`);
        if (!response.ok) {
            throw new Error("Error al obtener presupuestos financieros");
        }

        return await response.json();
    },

    async obtenerPorId(idPresupuesto) {
        const response = await fetch(`${API_URL}/presupuestos/${idPresupuesto}`);

        if (!response.ok) {
            throw new Error("Error al obtener presupuesto por id");
        }

        return await response.json();
    }
    ,
    async obtenerGastosPorPresupuesto(idPresupuesto) {
        const response = await fetch(`${API_URL}/gastos/${idPresupuesto}`);

        if (!response.ok) {
            throw new Error("Error al obtener gastos por presupuesto");
        }

        return await response.json();
    }

};

export  async function obtenerInvestigadoresProyecto (codigoProyecto) {
    const res = await fetch(`${API_URL}/investigador-proyecto/${codigoProyecto}`, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer`,
        }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al obtener investigadores activos");
    }
    return await res.json();
}

export const obtenerProyectoPorId = async (codigo, token) => {
    const res = await fetch(`http://localhost:8080/api/proyectos/obtener/${codigo}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error cargando proyecto");

    return await res.json();
};