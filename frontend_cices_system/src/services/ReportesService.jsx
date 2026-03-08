const API_URL = "/api/reportes";

export const DistribucionHoras = {

    async obtenerPorProyecto(codigoProyecto) {
        const response = await fetch(`${API_URL}/presupuesto-horas/${codigoProyecto}`);

        if (!response.ok) {
            throw new Error("Error al obtener presupuestos de horas");
        }

        return await response.json();
    }

};

export const DetalleGastos = {

    async obtenerPorProyecto(codigoProyecto) {
        const response = await fetch(`${API_URL}/gastos/${codigoProyecto}`);

        if (!response.ok) {
            throw new Error("Error al obtener presupuestos con gastos");
        }

        return await response.json();
    }

};
