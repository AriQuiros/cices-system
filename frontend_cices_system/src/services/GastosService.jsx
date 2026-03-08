export const GastosService = {
    async registrarGasto(codigoProyecto, gasto) {
        const res = await fetch(`/api/gastos/registro/${codigoProyecto}`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(gasto)
        });
        if (!res.ok) throw new Error("Error al registrar gasto");
        return await res.json();
    }
};